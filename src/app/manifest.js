export default function manifest() {
  return {
    name: "Tourist Guide",
    short_name: "Tourist Guide",
    description: "Best travel apps by country.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#020817",
    icons: [
      {
        src: "/icon.png",
        sizes: "512x512",
        type: "image/png"
      }
    ]
  };
}
