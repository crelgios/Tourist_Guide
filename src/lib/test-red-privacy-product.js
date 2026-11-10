export const TEST_RED_PRIVACY_PRODUCT = {
  id: "test-red-privacy-screen-protector",
  name: "Red Privacy Tempered Glass Screen Protector for iPhone",
  slug: "red-privacy-screen-protector",
  category: "Phone Accessories",
  description: "Add visual privacy and everyday screen protection to your iPhone. The red privacy effect helps make the display harder to view from the sides while keeping the screen visible from the front.",
  price: 19.99,
  compare_at_price: 29.99,
  currency: "USD",
  images: [],
  video_url: "",
  variants: [{
    name: "Phone Model",
    values: ["iPhone 16", "iPhone 16 Pro", "iPhone 16 Pro Max", "iPhone 17", "iPhone 17 Pro", "iPhone 17 Pro Max"]
  }],
  offers: [],
  shipping_text: "Test preview: final delivery estimate will be added before launch.",
  active: true,
  status: "active"
};

export function getTestRedPrivacyProduct(slug) {
  return slug === TEST_RED_PRIVACY_PRODUCT.slug ? TEST_RED_PRIVACY_PRODUCT : null;
}
