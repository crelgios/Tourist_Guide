export const homepageAppIcons = {
  uberindia: "/app-icons/uber.svg",
  uberjapan: "/app-icons/uber.svg",
  ubersaudiarabia: "/app-icons/uber.svg",
  uber: "/app-icons/uber.svg",
  ola: "/app-icons/ola.svg",
  googlemaps: "/app-icons/google-maps.svg",
  googlemapsrestaurantsnearby: "/app-icons/google-maps.svg",
  googlemapsshoppingnearby: "/app-icons/google-maps.svg",
  mappls: "/app-icons/mappls.svg",
  zomato: "/app-icons/zomato.svg",
  swiggy: "/app-icons/swiggy.svg",
  gotaxi: "/app-icons/go-taxi.svg",
  ubereatsjapan: "/app-icons/uber-eats.svg",
  demaecan: "/app-icons/demae-can.svg",
  jreast: "/app-icons/jr-east.svg",
  careem: "/app-icons/careem.svg",
  hungerstation: "/app-icons/hungerstation.svg",
  jahez: "/app-icons/jahez.svg",
  noon: "/app-icons/noon.svg",
  noonksa: "/app-icons/noon.svg",
  almosafer: "/app-icons/almosafer.svg",
  bookingcom: "/app-icons/booking.svg",
  rome2rio: "/app-icons/rome2rio.svg",
  saudiarabiaemergencyhelpline: "/app-icons/emergency.svg",
  saudiarabiapoliceemergency: "/app-icons/emergency.svg",
  default: "/app-icons/default-app.svg"
};

export function getHomepageAppIcon(appName = "") {
  const key = appName.toLowerCase().replace(/[^a-z0-9]/g, "");
  return homepageAppIcons[key] || null;
}
