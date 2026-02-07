import type { Metadata } from "next";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy — ZAIYA",
  description: "How ZAIYA collects, uses, and protects your personal information.",
};

export default function PrivacyPage() {
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
            Privacy Policy
          </h1>
          <p className="text-sm text-slate-500 font-[family-name:var(--font-geist-mono)]">
            Last updated: {lastUpdated}
          </p>
        </header>

        {/* Content */}
        <div className="space-y-10 text-slate-300 leading-relaxed text-sm sm:text-base">
          <section>
            <h2 className="text-lg sm:text-xl font-medium text-white mb-3 font-[family-name:var(--font-space-grotesk)]">
              1. Introduction
            </h2>
            <p>
              ZAIYA (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or engage our services.
            </p>
          </section>

          <section>
            <h2 className="text-lg sm:text-xl font-medium text-white mb-3 font-[family-name:var(--font-space-grotesk)]">
              2. Information We Collect
            </h2>
            <p className="mb-3">We may collect the following types of information:</p>
            <ul className="list-disc list-inside space-y-2 text-slate-400">
              <li><span className="text-slate-300">Personal Information:</span> Name, email address, phone number, and company name provided through our contact forms or direct communication.</li>
              <li><span className="text-slate-300">Technical Data:</span> IP address, browser type, operating system, referring URLs, and pages visited.</li>
              <li><span className="text-slate-300">Usage Data:</span> How you interact with our website, including page views, click patterns, and session duration.</li>
              <li><span className="text-slate-300">Cookies & Tracking:</span> Data collected through cookies and similar tracking technologies (see our <Link href="/cookies" className="text-cyan-400 hover:text-cyan-300 transition-colors">Cookie Policy</Link>).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg sm:text-xl font-medium text-white mb-3 font-[family-name:var(--font-space-grotesk)]">
              3. How We Use Your Information
            </h2>
            <ul className="list-disc list-inside space-y-2 text-slate-400">
              <li>To respond to inquiries and provide requested services.</li>
              <li>To improve our website, services, and user experience.</li>
              <li>To send relevant communications about our services (with your consent).</li>
              <li>To comply with legal obligations and protect our rights.</li>
              <li>To detect, prevent, and address technical or security issues.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg sm:text-xl font-medium text-white mb-3 font-[family-name:var(--font-space-grotesk)]">
              4. Data Sharing & Disclosure
            </h2>
            <p>
              We do not sell your personal information. We may share data with trusted third-party service providers who assist in operating our website and conducting our business, provided they agree to keep your information confidential. We may also disclose information when required by law or to protect our rights, safety, or property.
            </p>
          </section>

          <section>
            <h2 className="text-lg sm:text-xl font-medium text-white mb-3 font-[family-name:var(--font-space-grotesk)]">
              5. Data Security
            </h2>
            <p>
              We implement industry-standard security measures to protect your data, including encryption in transit (TLS), access controls, and regular security assessments. However, no method of electronic transmission or storage is 100% secure, and we cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-lg sm:text-xl font-medium text-white mb-3 font-[family-name:var(--font-space-grotesk)]">
              6. Data Retention
            </h2>
            <p>
              We retain your personal information only for as long as necessary to fulfill the purposes outlined in this policy, or as required by law. When data is no longer needed, it is securely deleted or anonymized.
            </p>
          </section>

          <section>
            <h2 className="text-lg sm:text-xl font-medium text-white mb-3 font-[family-name:var(--font-space-grotesk)]">
              7. Your Rights
            </h2>
            <p className="mb-3">Depending on your jurisdiction, you may have the right to:</p>
            <ul className="list-disc list-inside space-y-2 text-slate-400">
              <li>Access the personal data we hold about you.</li>
              <li>Request correction of inaccurate or incomplete data.</li>
              <li>Request deletion of your personal data.</li>
              <li>Object to or restrict processing of your data.</li>
              <li>Request data portability.</li>
              <li>Withdraw consent at any time.</li>
            </ul>
            <p className="mt-3">
              To exercise any of these rights, contact us at{" "}
              <a href="mailto:privacy@zaiya.com" className="text-cyan-400 hover:text-cyan-300 transition-colors">
                privacy@zaiya.com
              </a>.
            </p>
          </section>

          <section>
            <h2 className="text-lg sm:text-xl font-medium text-white mb-3 font-[family-name:var(--font-space-grotesk)]">
              8. Third-Party Links
            </h2>
            <p>
              Our website may contain links to third-party sites. We are not responsible for the privacy practices or content of those sites. We encourage you to review their privacy policies before providing any personal information.
            </p>
          </section>

          <section>
            <h2 className="text-lg sm:text-xl font-medium text-white mb-3 font-[family-name:var(--font-space-grotesk)]">
              9. Changes to This Policy
            </h2>
            <p>
              We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated effective date. Your continued use of our website after any changes constitutes acceptance of the revised policy.
            </p>
          </section>

          <section>
            <h2 className="text-lg sm:text-xl font-medium text-white mb-3 font-[family-name:var(--font-space-grotesk)]">
              10. Contact Us
            </h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at{" "}
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
