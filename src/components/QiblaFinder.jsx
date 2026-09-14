"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertCircle, CheckCircle2, Compass, LocateFixed, Navigation, RotateCcw, Settings } from "lucide-react";

const KAABA = { lat: 21.422487, lng: 39.826206 };
const EARTH_RADIUS_KM = 6371;

function toRadians(value) {
  return (value * Math.PI) / 180;
}

function toDegrees(value) {
  return (value * 180) / Math.PI;
}

function qiblaBearing(latitude, longitude) {
  const lat1 = toRadians(latitude);
  const lat2 = toRadians(KAABA.lat);
  const deltaLng = toRadians(KAABA.lng - longitude);
  const y = Math.sin(deltaLng) * Math.cos(lat2);
  const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(deltaLng);
  return (toDegrees(Math.atan2(y, x)) + 360) % 360;
}

function distanceToKaaba(latitude, longitude) {
  const lat1 = toRadians(latitude);
  const lat2 = toRadians(KAABA.lat);
  const deltaLat = toRadians(KAABA.lat - latitude);
  const deltaLng = toRadians(KAABA.lng - longitude);
  const a = Math.sin(deltaLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLng / 2) ** 2;
  return EARTH_RADIUS_KM * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function bearingLabel(value) {
  const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  return directions[Math.round(value / 45) % 8];
}

function isIOSDevice() {
  if (typeof navigator === "undefined") return false;
  return /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
}

export default function QiblaFinder() {
  const [location, setLocation] = useState(null);
  const [heading, setHeading] = useState(null);
  const [status, setStatus] = useState("Tap Find my Qibla to use your current location.");
  const [locating, setLocating] = useState(false);
  const [compassEnabled, setCompassEnabled] = useState(false);
  const [locationProblem, setLocationProblem] = useState(null);
  const [permissionState, setPermissionState] = useState("unknown");

  const bearing = useMemo(() => location ? qiblaBearing(location.latitude, location.longitude) : null, [location]);
  const distance = useMemo(() => location ? distanceToKaaba(location.latitude, location.longitude) : null, [location]);
  const relativeDirection = bearing == null || heading == null ? bearing : (bearing - heading + 360) % 360;

  useEffect(() => {
    let permission;
    async function checkPermission() {
      try {
        if (!navigator.permissions?.query) return;
        permission = await navigator.permissions.query({ name: "geolocation" });
        setPermissionState(permission.state);
        permission.onchange = () => setPermissionState(permission.state);
      } catch {
        // Safari may not expose geolocation permission through the Permissions API.
      }
    }
    checkPermission();
    return () => {
      if (permission) permission.onchange = null;
    };
  }, []);

  useEffect(() => {
    if (!compassEnabled) return undefined;
    const onOrientation = (event) => {
      let value = null;
      if (typeof event.webkitCompassHeading === "number") value = event.webkitCompassHeading;
      else if (typeof event.alpha === "number") value = (360 - event.alpha) % 360;
      if (value != null && Number.isFinite(value)) setHeading(value);
    };
    window.addEventListener("deviceorientationabsolute", onOrientation, true);
    window.addEventListener("deviceorientation", onOrientation, true);
    return () => {
      window.removeEventListener("deviceorientationabsolute", onOrientation, true);
      window.removeEventListener("deviceorientation", onOrientation, true);
    };
  }, [compassEnabled]);

  function findLocation() {
    setLocationProblem(null);

    if (!window.isSecureContext) {
      setStatus("Location requires a secure HTTPS page.");
      setLocationProblem("secure");
      return;
    }

    if (!navigator.geolocation) {
      setStatus("Location is not supported by this browser.");
      setLocationProblem("unsupported");
      return;
    }

    setLocating(true);
    setStatus("Waiting for location permission…");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy
        });
        setPermissionState("granted");
        setLocationProblem(null);
        setLocating(false);
        setStatus("Location detected. Your Qibla direction is ready.");
      },
      (error) => {
        setLocating(false);

        if (error.code === error.PERMISSION_DENIED) {
          setPermissionState("denied");
          setLocationProblem("denied");
          setStatus(
            isIOSDevice()
              ? "Location access is blocked for this website on your iPhone. Enable it in Safari website settings, then tap Try again."
              : "Location permission is blocked for this website. Allow location access in your browser settings, then try again."
          );
          return;
        }

        if (error.code === error.POSITION_UNAVAILABLE) {
          setLocationProblem("unavailable");
          setStatus("Your iPhone could not determine its location. Make sure Location Services are turned on and try again.");
          return;
        }

        setLocationProblem("timeout");
        setStatus("Location request timed out. Check Location Services and your connection, then try again.");
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  }

  async function enableCompass() {
    if (!location) {
      setStatus("Find your location first, then enable the live compass.");
      return;
    }
    try {
      if (typeof DeviceOrientationEvent !== "undefined" && typeof DeviceOrientationEvent.requestPermission === "function") {
        const permission = await DeviceOrientationEvent.requestPermission();
        if (permission !== "granted") {
          setStatus("Compass permission was not granted. You can still use the Qibla bearing in degrees.");
          return;
        }
      }
      setCompassEnabled(true);
      setStatus("Live compass enabled. Hold your phone flat and rotate until the green arrow points forward.");
    } catch {
      setStatus("Compass access is unavailable. You can still use the Qibla bearing in degrees.");
    }
  }

  return (
    <div className="mx-auto max-w-4xl">
      <section className="overflow-hidden rounded-[2rem] bg-slate-950 px-5 py-7 text-white shadow-2xl sm:px-10 sm:py-12">
        <div className="max-w-3xl">
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-emerald-400/15 text-emerald-300 ring-1 ring-emerald-300/20 sm:h-14 sm:w-14">
              <Compass className="h-6 w-6 sm:h-7 sm:w-7" />
            </div>
            <p className="text-[11px] font-black uppercase tracking-[0.25em] text-emerald-300 sm:text-xs">Aliwvide Qibla Finder</p>
          </div>
          <h1 className="mt-4 text-3xl font-black tracking-tight sm:text-5xl">Find the Qibla from where you are</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300 sm:text-lg sm:leading-7">
            Tap once to request your current location. Aliwvide uses it only in your browser to calculate the direction of the Kaaba in Makkah.
          </p>
        </div>
      </section>

      <section className="mt-5 rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
        {!location ? (
          <div className="text-center">
            <div className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100">
              <LocateFixed className="h-10 w-10" />
            </div>
            <h2 className="mt-5 text-2xl font-black text-slate-950">Ready to find your Qibla?</h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600 sm:text-base">
              Your browser should ask for location access after you tap the button below.
            </p>

            <button
              type="button"
              onClick={findLocation}
              disabled={locating}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-6 py-4 text-base font-black text-white shadow-lg shadow-emerald-100 transition hover:bg-emerald-700 disabled:cursor-wait disabled:opacity-70 sm:w-auto"
            >
              <LocateFixed className="h-5 w-5" />
              {locating ? "Waiting for location…" : locationProblem ? "Try location again" : "Find my Qibla"}
            </button>

            <div className="mx-auto mt-4 max-w-xl rounded-2xl bg-slate-50 p-4 text-left text-sm leading-6 text-slate-600">
              <div className="flex gap-3">
                {locationProblem ? <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" /> : <LocateFixed className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />}
                <div>
                  <p className="font-bold text-slate-900">{status}</p>
                  {permissionState === "denied" && isIOSDevice() && (
                    <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 p-3 text-amber-950">
                      <div className="flex items-center gap-2 font-black"><Settings className="h-4 w-4" /> iPhone Safari</div>
                      <p className="mt-1">Tap the page menu/address-bar website settings → Location → Allow. If Location Services are off entirely, open iPhone Settings → Privacy & Security → Location Services and turn them on.</p>
                    </div>
                  )}
                  {permissionState !== "denied" && (
                    <p className="mt-1 text-slate-500">If no iPhone permission popup appears, location may already be allowed or blocked for this website.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="rounded-3xl bg-slate-950 p-4 text-white sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-300">Qibla direction</p>
                  <p className="mt-1 text-4xl font-black sm:text-5xl">{Math.round(bearing)}°</p>
                  <p className="mt-1 text-sm font-bold text-slate-300">{bearingLabel(bearing)} from true north</p>
                </div>
                <div className="rounded-2xl bg-white/10 px-4 py-3 text-right">
                  <p className="text-xs text-slate-400">Location accuracy</p>
                  <p className="mt-1 font-black text-white">± {Math.round(location.accuracy)} m</p>
                </div>
              </div>

              <div className="mt-5 flex justify-center">
                <div className="relative grid h-64 w-64 place-items-center rounded-full border-[8px] border-emerald-400/20 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.08),rgba(15,23,42,0.96)_68%)] shadow-[0_0_45px_rgba(16,185,129,0.12)] sm:h-72 sm:w-72">
                  <span className="absolute top-3 text-sm font-black text-white">N</span>
                  <span className="absolute bottom-3 text-sm font-black text-slate-400">S</span>
                  <span className="absolute left-4 text-sm font-black text-slate-400">W</span>
                  <span className="absolute right-4 text-sm font-black text-slate-400">E</span>
                  <div className="absolute inset-9 transition-transform duration-300 ease-out" style={{ transform: `rotate(${relativeDirection ?? bearing}deg)` }}>
                    <div className="mx-auto h-24 w-3 rounded-full bg-emerald-400 shadow-[0_0_20px_rgba(52,211,153,.7)] sm:h-28" />
                    <div className="mx-auto -mt-1 h-0 w-0 border-x-[15px] border-b-[25px] border-x-transparent border-b-emerald-400" />
                  </div>
                  <div className="relative z-10 grid h-20 w-20 place-items-center rounded-full bg-white text-center text-slate-950 shadow-xl ring-4 ring-slate-950/40">
                    <span className="text-xs font-black leading-4">QIBLA<br />🕋</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-white/10 p-4"><p className="text-xs text-slate-400">Direction</p><p className="mt-1 text-lg font-black">{Math.round(bearing)}°</p></div>
                <div className="rounded-2xl bg-white/10 p-4"><p className="text-xs text-slate-400">Distance to Kaaba</p><p className="mt-1 text-lg font-black">{Math.round(distance).toLocaleString()} km</p></div>
              </div>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <button type="button" onClick={findLocation} disabled={locating} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-5 py-4 font-black text-white transition hover:bg-emerald-700 disabled:cursor-wait disabled:opacity-70">
                <RotateCcw className="h-5 w-5" />{locating ? "Updating…" : "Update location"}
              </button>
              <button type="button" onClick={enableCompass} disabled={compassEnabled} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-4 font-black text-white transition hover:bg-slate-800 disabled:cursor-default disabled:bg-slate-700">
                <Navigation className="h-5 w-5" />{compassEnabled ? "Live compass enabled" : "Enable live compass"}
              </button>
            </div>

            <div className={`mt-4 flex items-start gap-3 rounded-2xl p-4 text-sm leading-6 ${compassEnabled ? "bg-emerald-50 text-emerald-900" : "bg-slate-50 text-slate-700"}`}>
              {compassEnabled ? <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" /> : <Compass className="mt-0.5 h-5 w-5 shrink-0 text-slate-500" />}
              <p>{status}</p>
            </div>

            <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4 text-sm leading-6 text-slate-600">
              <strong className="text-slate-900">Compass tip:</strong> hold your phone flat and move away from metal objects, speakers and magnetic phone cases if the arrow looks unstable.
            </div>
          </>
        )}
      </section>
    </div>
  );
}
