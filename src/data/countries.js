const link = (name, type, description, web, android, ios, badges, docs) => ({
  name,
  type,
  description,
  web,
  android,
  ios,
  badges,
  docs
});

export const countries = [
  { slug: "india", name: "India" },
  { slug: "japan", name: "Japan" },
  { slug: "uae", name: "United Arab Emirates" },
  { slug: "thailand", name: "Thailand" },
  { slug: "usa", name: "United States" },
  { slug: "uk", name: "United Kingdom" },
  { slug: "germany", name: "Germany" },
  { slug: "france", name: "France" },
  { slug: "china", name: "China" },
  { slug: "southkorea", name: "South Korea" },
  { slug: "singapore", name: "Singapore" },
  { slug: "malaysia", name: "Malaysia" },
  { slug: "indonesia", name: "Indonesia" },
  { slug: "saudi", name: "Saudi Arabia" },
  { slug: "qatar", name: "Qatar" },
  { slug: "turkey", name: "Turkey" },
  { slug: "italy", name: "Italy" },
  { slug: "spain", name: "Spain" },
  { slug: "canada", name: "Canada" },
  { slug: "australia", name: "Australia" },
  { slug: "brazil", name: "Brazil" },
  { slug: "mexico", name: "Mexico" },
  { slug: "egypt", name: "Egypt" },
  { slug: "russia", name: "Russia" }
];

export const categories = [
  { key: "emergency", icon: "🆘" },
  { key: "transport", icon: "🚖" },
  { key: "maps", icon: "🗺️" },
  { key: "train", icon: "🚄" },
  { key: "metro", icon: "🚇" },
  { key: "bus", icon: "🚌" },
  { key: "flights", icon: "✈️" },
  { key: "shopping", icon: "🛍️" },
  { key: "food", icon: "🍔" }
];

export const defaultCountryData = {
  transport: [
    link("Uber", "Premium taxi and ride service", "Popular ride-hailing platform for city and airport rides.", "https://www.uber.com/", "https://play.google.com/store/apps/details?id=com.ubercab", "https://apps.apple.com/app/uber-request-a-ride/id368677368", ["Taxi", "Global", "Premium"], ["Enable GPS before booking.", "Compare fare categories.", "Verify pickup point carefully."])
  ],
  maps: [
    link("Google Maps", "Navigation and route planning", "Global navigation and local search service.", "https://maps.google.com/", "https://play.google.com/store/apps/details?id=com.google.android.apps.maps", "https://apps.apple.com/app/google-maps/id585027354", ["Maps", "Navigation", "Global"], ["Download offline maps.", "Check traffic before travel.", "Verify public transport routes."])
  ],
  train: [
    link("Omio", "Train and transport platform", "Popular train, bus, and route platform for many regions.", "https://www.omio.com/", "https://play.google.com/store/apps/details?id=com.goeuro.rosie", "https://apps.apple.com/app/omio-trains-buses-flights/id885372509", ["Train", "Travel", "Routes"], ["Compare train operators.", "Check station information.", "Verify luggage rules."])
  ],
  metro: [
    link("Moovit", "Metro and public transit navigation", "Metro and public transit navigation service.", "https://moovitapp.com/", "https://play.google.com/store/apps/details?id=com.tranzmate", "https://apps.apple.com/app/moovit-all-transit-options/id498477945", ["Metro", "Transit", "Routes"], ["Use live transit updates.", "Verify interchange stations.", "Download city maps if needed."])
  ],
  bus: [
    link("FlixBus", "Bus travel service", "Intercity bus travel platform.", "https://www.flixbus.com/", "https://play.google.com/store/apps/details?id=de.meinfernbus", "https://apps.apple.com/app/flixbus-smart-bus-travel/id783437367", ["Bus", "Travel", "Intercity"], ["Arrive early at boarding point.", "Check luggage allowance.", "Verify boarding gate."])
  ],
  flights: [
    link("Skyscanner", "Flight comparison platform", "Global flight search and comparison service.", "https://www.skyscanner.com/", "https://play.google.com/store/apps/details?id=net.skyscanner.android.main", "https://apps.apple.com/app/skyscanner-travel-deals/id415458524", ["Flights", "Travel", "Global"], ["Compare baggage rules.", "Check visa requirements.", "Verify airport terminal details."])
  ],
  shopping: [
    link("Amazon", "Shopping marketplace", "Online shopping platform for daily products and travel essentials.", "https://www.amazon.com/", "https://play.google.com/store/apps/details?id=com.amazon.mShop.android.shopping", "https://apps.apple.com/app/amazon-shopping/id297606951", ["Shopping", "Marketplace", "Global"], ["Check seller reviews.", "Verify delivery availability.", "Compare prices before purchase."])
  ],
  food: [
    link("Uber Eats", "Food delivery service", "Food ordering and delivery platform.", "https://www.ubereats.com/", "https://play.google.com/store/apps/details?id=com.ubercab.eats", "https://apps.apple.com/app/uber-eats-food-delivery/id1058959277", ["Food", "Delivery", "Global"], ["Check delivery timing.", "Verify address before ordering.", "Review restaurant ratings."])
  ],
  emergency: [
    link("SOS Emergency", "Emergency help and safety numbers", "Call the local emergency service immediately for police, ambulance, or fire support.", "tel:112", "tel:112", "tel:112", ["SOS", "Emergency", "Call Now"], ["Call only during a real emergency.", "Share your exact location clearly.", "Keep your passport or ID details ready if safe."])
  ]
};

export const countryData = {
  india: {
    ...defaultCountryData,
    emergency: [
      link("India SOS Emergency", "National emergency helpline", "Call 112 in India for emergency support. Police can also be reached at 100, ambulance at 108, and fire at 101.", "tel:112", "tel:112", "tel:112", ["SOS", "112", "India"], ["Call 112 for urgent emergency help.", "Police: 100 • Ambulance: 108 • Fire: 101", "Share your location and nearby landmark clearly."])
    ],
    transport: [
      link("Uber India", "Premium taxi and chauffeur rides", "Premium ride-hailing service with airport, city, and executive rides across India.", "https://www.uber.com/in/en/", "https://play.google.com/store/apps/details?id=com.ubercab", "https://apps.apple.com/app/uber-request-a-ride/id368677368", ["5 Star", "Premium", "Taxi"], ["Enable live location before booking.", "Compare ride categories.", "Check airport pickup instructions."]),
      link("Ola", "Premium local cab service", "Popular premium cab platform with city rides and airport transfers.", "https://www.olacabs.com/", "https://play.google.com/store/apps/details?id=com.olacabs.customer", "https://apps.apple.com/in/app/ola-cabs/id539179365", ["5 Star", "Cab", "Airport Rides"], ["Use Ola Prime for premium rides.", "Check estimated fare.", "Verify driver and vehicle details."])
    ],
    train: [
      link("IRCTC Rail Connect", "Official Indian railway platform", "Official railway platform for Indian train services.", "https://www.irctc.co.in/", "https://play.google.com/store/apps/details?id=cris.org.in.prs.ima", "https://apps.apple.com/in/app/irctc-rail-connect/id1386197253", ["Train", "Official", "India"], ["Keep ID ready.", "Verify train timings.", "Use official railway alerts."])
    ],
    bus: [
      link("redBus", "Bus booking platform", "Popular bus route and booking platform in India.", "https://www.redbus.in/", "https://play.google.com/store/apps/details?id=in.redbus.android", "https://apps.apple.com/in/app/redbus-bus-train-booking-app/id733712604", ["Bus", "India", "Travel"], ["Check pickup location.", "Compare operator ratings.", "Verify luggage policy."])
    ],
    flights: [
      link("MakeMyTrip", "Flights and travel booking", "Flight, hotel, and travel booking platform in India.", "https://www.makemytrip.com/", "https://play.google.com/store/apps/details?id=com.makemytrip", "https://apps.apple.com/in/app/makemytrip-flights-hotels/id530488359", ["Flights", "Travel", "India"], ["Compare airlines.", "Check baggage rules.", "Verify terminal details."])
    ],
    shopping: [
      link("Amazon India", "Shopping marketplace", "Popular Indian shopping and delivery platform.", "https://www.amazon.in/", "https://play.google.com/store/apps/details?id=in.amazon.mShop.android.shopping", "https://apps.apple.com/in/app/amazon-india-shop-pay-mini-tv/id1478350915", ["Shopping", "India", "Marketplace"], ["Check seller ratings.", "Verify return policy.", "Use official listings."])
    ],
    food: [
      link("Zomato", "Food delivery service", "Food ordering and restaurant discovery service.", "https://www.zomato.com/", "https://play.google.com/store/apps/details?id=com.application.zomato", "https://apps.apple.com/in/app/zomato-food-delivery-dining/id434613896", ["Food", "Delivery", "India"], ["Check delivery timing.", "Review restaurant ratings.", "Verify address."])
    ]
  },
  japan: {
    ...defaultCountryData,
    emergency: [
      link("Japan SOS Emergency", "Police, ambulance, and fire numbers", "Call 110 for police in Japan. Call 119 for ambulance or fire emergency services.", "tel:110", "tel:110", "tel:110", ["SOS", "110", "119"], ["Police: 110", "Ambulance/Fire: 119", "Explain your location slowly and clearly."])
    ],
    transport: [link("GO Taxi", "Premium taxi booking service", "Trusted taxi service widely used across Japan.", "https://go.goinc.jp/", "https://play.google.com/store/apps/details?id=jp.ne.goinc.go", "https://apps.apple.com/search?term=GO%20Taxi", ["5 Star", "Japan", "Taxi"], ["Best in major cities.", "Confirm pickup point.", "Check payment methods."])],
    shopping: [link("Rakuten Japan", "Shopping marketplace", "Major Japanese shopping platform.", "https://www.rakuten.co.jp/", "https://play.google.com/store/apps/details?id=jp.co.rakuten.pointclub.android", "https://apps.apple.com/jp/app/rakuten-pointclub/id492214705", ["Shopping", "Japan", "Marketplace"], ["Some listings may be Japanese-only.", "Check delivery support.", "Compare seller ratings."])]
  },
  uae: {
    ...defaultCountryData,
    emergency: [
      link("UAE SOS Emergency", "Police, ambulance, and fire numbers", "Call 999 for police in the UAE. Ambulance can be reached at 998 and fire at 997.", "tel:999", "tel:999", "tel:999", ["SOS", "999", "UAE"], ["Police: 999", "Ambulance: 998 • Fire: 997", "Share emirate, street, and landmark details."])
    ],
    transport: [link("Careem", "Premium chauffeur and taxi service", "Luxury and premium ride service popular in UAE cities.", "https://www.careem.com/", "https://play.google.com/store/apps/details?id=com.careem.acma", "https://apps.apple.com/us/app/careem-rides-food-more/id592978487", ["5 Star", "Luxury", "UAE"], ["Choose premium categories.", "Airport transfers available.", "Check city coverage."])],
    shopping: [link("Noon", "Shopping platform", "Popular shopping platform in UAE.", "https://www.noon.com/uae-en/", "https://play.google.com/store/apps/details?id=com.noon.buyerapp", "https://apps.apple.com/us/app/noon-shopping-food-grocery/id1269038866", ["Shopping", "UAE", "Marketplace"], ["Check delivery area.", "Compare sellers.", "Check return policy."])]
  },
  thailand: {
    ...defaultCountryData,
    emergency: [
      link("Thailand SOS Emergency", "Tourist and public emergency numbers", "Call 191 for police in Thailand. Tourist police can be reached at 1155 and ambulance at 1669.", "tel:191", "tel:191", "tel:191", ["SOS", "191", "Tourist Police"], ["Police: 191", "Tourist Police: 1155 • Ambulance: 1669", "Tell them your hotel, street, or landmark."])
    ],
    transport: [link("Grab", "Premium taxi and local rides", "Popular ride service in Thailand and Southeast Asia.", "https://www.grab.com/th/en/", "https://play.google.com/store/apps/details?id=com.grabtaxi.passenger", "https://apps.apple.com/us/app/grab-taxi-food-delivery/id647268330", ["5 Star", "Taxi", "Thailand"], ["Best for city rides.", "Compare fare.", "Verify pickup pin."])],
    food: [link("GrabFood", "Food delivery", "Food delivery service inside Grab.", "https://www.grab.com/th/en/food/", "https://play.google.com/store/apps/details?id=com.grabtaxi.passenger", "https://apps.apple.com/us/app/grab-taxi-food-delivery/id647268330", ["Food", "Delivery", "Thailand"], ["Check restaurant rating.", "Confirm address.", "Check delivery area."])]
  }
};

export function getCountryData(countrySlug) {
  return countryData[countrySlug] || defaultCountryData;
}

export function getCountryName(countrySlug) {
  return countries.find((country) => country.slug === countrySlug)?.name || "Selected Country";
}
