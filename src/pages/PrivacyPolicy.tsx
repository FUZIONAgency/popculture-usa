import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
        <div className="prose max-w-none">
          <p className="mb-4">Last updated: {new Date().toLocaleDateString()}</p>
          
          <section className="mb-6">
            <h2 className="text-2xl font-semibold mb-4">1. Information We Collect</h2>
            <p>We collect information that you provide directly to us, including:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Name and contact information</li>
              <li>Account credentials</li>
              <li>Payment information</li>
              <li>Communication preferences</li>
            </ul>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-semibold mb-4">2. How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Provide and maintain our services</li>
              <li>Process your transactions</li>
              <li>Send you updates and marketing communications</li>
              <li>Improve our services</li>
            </ul>
          </section>

          {/* Add more sections as needed */}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;