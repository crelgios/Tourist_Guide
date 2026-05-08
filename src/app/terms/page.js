import Footer from "@/components/Footer";

export const metadata = {
  title: "Terms & Conditions",
  description: "Aliwvide provides informational recommendations only. We do not own or operate third-party services shown on this site."
};

export default function Page() {
  return (
    <>
      <main className="min-h-screen bg-white px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-6xl font-black tracking-[-0.07em]">Terms & Conditions</h1>
          <p className="mt-8 text-xl leading-9 text-gray-600">Aliwvide provides informational recommendations only. We do not own or operate third-party services shown on this site.</p>
          <div className="mt-10 rounded-[2rem] border border-gray-200 bg-gray-50 p-8 text-gray-600">
            <p>All trademarks, logos, websites, and app names belong to their respective owners. Always verify service availability, pricing, and official policies before use.</p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
