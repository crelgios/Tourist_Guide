insert into public.blogs (title, slug, description, content, status, published_at)
values
(
  'Best Travel Apps for India Tourists',
  'best-travel-apps-for-india-tourists',
  'A simple guide to the most useful taxi, train, metro, maps, food delivery and shopping apps for tourists visiting India.',
  'India has many useful apps for tourists. For taxi booking, tourists can use Uber, Ola and Rapido in many cities.\n\nFor trains, IRCTC Rail Connect and MakeMyTrip can help with booking and checking train details.\n\nFor metro travel, city-specific metro apps are useful in Delhi, Mumbai, Bengaluru and other cities.\n\nGoogle Maps is important for navigation, routes and nearby places.\n\nFood delivery apps like Zomato and Swiggy are popular in many Indian cities.',
  'published',
  now()
),
(
  'Best Taxi Apps in India for Tourists',
  'best-taxi-apps-in-india-for-tourists',
  'Compare popular taxi and ride booking apps used in India by locals and tourists.',
  'Taxi apps are very helpful for tourists in India.\n\nUber is available in many major cities and is easy for international tourists.\n\nOla is also widely used in India.\n\nRapido is useful for bike taxi and quick city rides where available.\n\nTourists should always check pickup location, fare estimate, driver details, vehicle number and payment method before starting the ride.',
  'published',
  now()
)
on conflict (slug) do nothing;

insert into public.faqs (category, question, answer, sort_order)
values
(
  'Taxi & Transport',
  'Which taxi app is best in India for tourists?',
  'Uber and Ola are popular taxi apps in India. Rapido is also useful in some cities for bike taxi and quick local rides.',
  10
),
(
  'General',
  'Does Aliwvide show travel apps by country?',
  'Yes, Aliwvide helps tourists find transport, maps, train, metro, food delivery and shopping apps used in different countries.',
  20
)
on conflict do nothing;

insert into public.shop_products (name, affiliate_url, active, sort_order)
select product_name, 'https://www.amazon.in/dp/B0CXM9Q1SW?tag=aliwvidetrave-21', true, product_order
from (values
  ('Cabin Trolley Bag', 1), ('Travel Backpack 45L', 2), ('Packing Cubes Set', 3),
  ('Universal Travel Adapter', 4), ('Digital Luggage Scale', 5), ('Memory Foam Neck Pillow', 6),
  ('RFID Passport Wallet', 7), ('Hanging Toiletry Bag', 8), ('20,000mAh Power Bank', 9),
  ('Foldable Travel Bottle', 10), ('Cable Organizer Pouch', 11), ('Luggage Strap', 12),
  ('Luggage Tags', 13), ('Travel Shoe Bags', 14), ('Compression Socks', 15), ('Sleep Mask', 16),
  ('Travel Umbrella', 17), ('Foldable Daypack', 18), ('Waterproof Phone Pouch', 19),
  ('Travel First Aid Pouch', 20), ('TSA Combination Lock', 21), ('Travel Laundry Bag', 22),
  ('Phone Tripod', 23), ('Car Phone Holder', 24), ('Travel Sling Bag', 25), ('Foldable Duffel Bag', 26),
  ('Travel Towel', 27), ('Portable Mini Fan', 28), ('Backpack Rain Cover', 29),
  ('Travel Document Organizer', 30)
) as products(product_name, product_order)
on conflict (name) do nothing;
