"use client";

import { useEffect, useMemo, useState } from "react";
import { Compass, LocateFixed, Navigation } from "lucide-react";

const KAABA = { lat: 21.422487, lng: 39.826206 };

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

function bearingLabel(value) {
  const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  return directions[Math.round(value / 45) % 8];
}

export default function QiblaFinder() {
  const [location, setLocation] = useState(null);
  const [heading, setHeading] = useState(null);
  const [status, setStatus] = useState("Tap Find my Qibla to use your current location.");
  const [locating, setLocating] = useState(false);
  const [compassEnabled, setCompassEnabled] = useState(false);

  const bearing = useMemo(() => {
    if (!location) return null;
    return qiblaBearing(location.latitude, location.longitude);
  }, [location]);

  const relativeDirection = bearing == null || heading == null ? bearing : (bearing - heading + 360) % 360;

  useEffect(() => {
    if (!compassEnabled) return undefined;

    const onOrientation = (event) => {
      let value = null;

      if (typeof event.webkitCompassHeading === "number") {
        value = event.webkitCompassHeading;
      } else if (typeof event.alpha === "number") {
        value = (360 - event.alpha) % 360;
      }

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
    if (!navigator.geolocation) {
      setStatus("Location is not supported by this browser.");
      return;
    }

    setLocating(true);
    setStatus("Finding your location…");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy
        });
        setLocating(false);
        setStatus("Location found. Follow the Qibla direction shown below.");
      },
      (error) => {
        setLocating(false);
        if (error.code === 1) setStatus("Location permission was denied. Allow location access in your browser and try again.");
        else setStatus("Could not get your location. Check location services and try again.");
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 60000 }
    );
  }

  async function enableCompass() {
    try {
      if (typeof DeviceOrientationEvent !== "undefined" && typeof DeviceOrientationEvent.requestPermission === "function") {
        const permission = await DeviceOrientationEvent.requestPermission();
        if (permission !== "granted") {
          setStatus("Compass permission was not granted. You can still use the Qibla bearing in degrees.");
          return;
        }
      }
      setCompassEnabled(true);
      setStatus("Compass enabled. Hold your phone flat and rotate until the arrow points forward.");
    } catch {
      setStatus("Compass access is unavailable. You can still use the Qibla bearing in degrees.");
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      <section className="overflow-hidden rounded-[2rem] bg-slate-950 p-6 text-white shadow-2xl sm:p-10">
        <div className="flex items-start gap-4">
          <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-emerald-400/15 text-emerald-300 ring-1 ring-emerald-300/20">
            <Compass className="h-7 w-7" />
          </div>
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-300">Aliwvide Qibla Finder</p>
            <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-5xl">Find the Qibla from where you are</h1>
            <p className="mt-4 max-w-2xl leading-7 text-slate-300">
              Use your device location to calculate the direction of the Kaaba in Makkah. On supported phones, enable the compass for a live direction arrow.
            </p>
          </div>
        </div>
      </section>

      <section className="mt-6 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={findLocation}
            disabled={locating}
            className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-5 py-3 font-black text-white transition hover:bg-emerald-700 disabled:cursor-wait disabled:opacity-70"
          >
            <LocateFixed className="h-5 w-5" />
            {locating ? "Finding location…" : "Find my Qibla"}
          </button>

          <button
            type="button"
            onClick={enableCompass}
            className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 font-black text-white transition hover:bg-slate-800"
          >
            <Navigation className="h-5 w-5" />
            Enable compass
          </button>
        </div>

        <p className="mt-4 text-sm leading-6 text-slate-600">{status}</p>

        {bearing != null && (
          <div className="mt-8 grid gap-6 md:grid-cols-[1fr_.85fr] md:items-center">
            <div className="flex justify-center">
              <div className="relative grid h-64 w-64 place-items-center rounded-full border-[10px] border-slate-100 bg-gradient-to-b from-white to-emerald-50 shadow-inner">
                <span className="absolute top-3 text-xs font-black text-slate-500">N</span>
                <span className="absolute bottom-3 text-xs font-black text-slate-400">S</span>
                <span className="absolute left-4 text-xs font-black text-slate-400">W</span>
                <span className="absolute right-4 text-xs font-black text-slate-400">E</span>

                <div
                  className="absolute inset-8 transition-transform duration-500 ease-out"
                  style={{ transform: `rotate(${relativeDirection ?? bearing}deg)` }}
                >
                  <div className="mx-auto h-24 w-3 rounded-full bg-emerald-600 shadow-lg shadow-emerald-200" />
                  <div className="mx-auto -mt-1 h-0 w-0 border-x-[14px] border-b-[24px] border-x-transparent border-b-emerald-600" />
                </div>

                <div className="relative z-10 grid h-20 w-20 place-items-center rounded-full bg-slate-950 text-center text-white shadow-xl">
                  <span className="text-xs font-black leading-4">QIBLA<br />🕋</span>
                </div>
              </div>
            </div>

            <div>
              <p className="text-sm font-black uppercase tracking-[0.16em] text-emerald-600">Qibla bearing</p>
              <p className="mt-2 text-5xl font-black tracking-tight text-slate-950">{Math.round(bearing)}°</p>
              <p className="mt-2 text-lg font-bold text-slate-700">{bearingLabel(bearing)} from true north</p>

              {heading != null && (
                <div className="mt-5 rounded-2xl bg-emerald-50 p-4 text-sm leading-6 text-emerald-900">
                  Live compass is active. Rotate your phone until the green arrow points straight toward the top of the screen.
                </div>
              )}

              <div className="mt-5 rounded-2xl bg-slate-50 p-4 text-sm leading-6 text-slate-600">
                Location accuracy: about {Math.round(location.accuracy)} m. Magnetic interference from cases, vehicles and electronics can affect the live compass, so calibrate your device if the arrow appears unstable.
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
