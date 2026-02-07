import type { Metadata } from "next";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Cookie Policy — ZAIYA",
  description: "How ZAIYA uses cookies and similar tracking technologies on our website.",
};

export default function CookiePolicyPage() {
  const lastUpdated = "February 7, 2026";

  return (
    <div className="relative bg-slate-950 text-white min-h-screen">
      <Navbar />

      <main className="max-w-3xl mx-auto px-5 sm:px-8 md:px-12 pt-32 sm:pt-40 pb-20 sm:pb-28">
        {/* Header */}
        <header className="mb-12 sm:mb-16">
          <p className="text-xs tracking-[0.25em] uppercase text-cyan-400/75 font-[family-name:var(--font-geist-mono)] mb-4">
            Legal
          </p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-light leading-tight font-[family-name:var(--font-space-grotesk)] mb-4">
            Cookie Policy
          </h1>
          <p className="text-sm text-slate-500 font-[family-name:var(--font-geist-mono)]">
            Last updated: {lastUpdated}
          </p>
        </header>

        {/* Content */}
        <div className="space-y-10 text-slate-300 leading-relaxed text-sm sm:text-base">
          <section>
            <h2 className="text-lg sm:text-xl font-medium text-white mb-3 font-[family-name:var(--font-space-grotesk)]">
              1. What Are Cookies
            </h2>
            <p>
              Cookies are small text files placed on your device when you visit a website. They are widely used to make websites work efficiently, provide analytics, and improve user experience. Cookies may be set by the website you are visiting (&quot;first-party cookies&quot;) or by third-party services operating on that website (&quot;third-party cookies&quot;).
            </p>
          </section>

          <section>
            <h2 className="text-lg sm:text-xl font-medium text-white mb-3 font-[family-name:var(--font-space-grotesk)]">
              2. How We Use Cookies
            </h2>
            <p className="mb-4">We use cookies for the following purposes:</p>

            {/* Cookie table */}
            <div className="overflow-x-auto rounded-lg border border-slate-800">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-900/50">
                    <th className="px-4 py-3 font-medium text-white">Category</th>
                    <th className="px-4 py-3 font-medium text-white">Purpose</th>
                    <th className="px-4 py-3 font-medium text-white">Duration</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  <tr>
                    <td className="px-4 py-3 text-slate-300 whitespace-nowrap">Essential</td>
                    <td className="px-4 py-3 text-slate-400">Required for the website to function properly. These cannot be disabled.</td>
                    <td className="px-4 py-3 text-slate-400 whitespace-nowrap">Session</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-slate-300 whitespace-nowrap">Analytics</td>
                    <td className="px-4 py-3 text-slate-400">Help us understand how visitors interact with our website by collecting anonymous usage data.</td>
                    <td className="px-4 py-3 text-slate-400 whitespace-nowrap">Up to 2 years</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-slate-300 whitespace-nowrap">Functional</td>
                    <td className="px-4 py-3 text-slate-400">Remember your preferences and settings to enhance your experience on return visits.</td>
                    <td className="px-4 py-3 text-slate-400 whitespace-nowrap">Up to 1 year</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-slate-300 whitespace-nowrap">Performance</td>
                    <td className="px-4 py-3 text-slate-400">Monitor website performance and help us identify and fix issues.</td>
                    <td className="px-4 py-3 text-slate-400 whitespace-nowrap">Up to 1 year</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-lg sm:text-xl font-medium text-white mb-3 font-[family-name:var(--font-space-grotesk)]">
              3. Third-Party Cookies
            </h2>
            <p>
              Some cookies are placed by third-party services that appear on our pages. We use third-party cookies for analytics and performance monitoring. These third parties have their own privacy policies governing the data they collect.
            </p>
          </section>

          <section>
            <h2 className="text-lg sm:text-xl font-medium text-white mb-3 font-[family-name:var(--font-space-grotesk)]">
              4. Managing Cookies
            </h2>
            <p className="mb-3">
              You can control and manage cookies through your browser settings. Most browsers allow you to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-slate-400">
              <li>View what cookies are stored and delete them individually.</li>
              <li>Block third-party cookies.</li>
              <li>Block cookies from specific sites.</li>
              <li>Block all cookies.</li>
              <li>Delete all cookies when you close your browser.</li>
            </ul>
            <p className="mt-3 text-slate-400">
              Note that blocking or deleting cookies may impact your experience on our website and some features may not function as intended.
            </p>
          </section>

          <section>
            <h2 className="text-lg sm:text-xl font-medium text-white mb-3 font-[family-name:var(--font-space-grotesk)]">
              5. Similar Technologies
            </h2>
            <p>
              In addition to cookies, we may use similar technologies such as web beacons (pixel tags), local storage, and session storage to collect information and improve our services. These technologies work similarly to cookies and are subject to the same controls described above.
            </p>
          </section>

          <section>
            <h2 className="text-lg sm:text-xl font-medium text-white mb-3 font-[family-name:var(--font-space-grotesk)]">
              6. Changes to This Policy
            </h2>
            <p>
              We may update this Cookie Policy from time to time to reflect changes in technology, regulation, or our business practices. Any updates will be posted on this page with an updated effective date.
            </p>
          </section>

          <section>
            <h2 className="text-lg sm:text-xl font-medium text-white mb-3 font-[family-name:var(--font-space-grotesk)]">
              7. More Information
            </h2>
            <p>
              For more details about how we handle your personal data, see our{" "}
              <Link href="/privacy" className="text-cyan-400 hover:text-cyan-300 transition-colors">
                Privacy Policy
              </Link>. If you have questions about our use of cookies, contact us at{" "}
              <a href="mailto:privacy@zaiya.com" className="text-cyan-400 hover:text-cyan-300 transition-colors">
                privacy@zaiya.com
              </a>.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
