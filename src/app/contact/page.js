import Footer from "@/components/Footer";
import ContactForm from "@/components/ContactForm";

export const metadata = {
  title: "Contact Us",
  description:
    "Contact Aliwvide to suggest a country, submit service details, report a broken link, or request travel guide corrections.",
  alternates: { canonical: "/contact" }
};

export default function ContactPage() {
  return (
    <>
      <ContactForm />
      <Footer />
    </>
  );
}
