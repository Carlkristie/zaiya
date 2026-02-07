import type { Metadata } from "next";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service — ZAIYA",
  description: "Terms and conditions governing the use of ZAIYA's website and services.",
};

export default function TermsPage() {
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
            Terms of Service
          </h1>
          <p className="text-sm text-slate-500 font-[family-name:var(--font-geist-mono)]">
            Last updated: {lastUpdated}
          </p>
        </header>

        {/* Content */}
        <div className="space-y-10 text-slate-300 leading-relaxed text-sm sm:text-base">
          <section>
            <h2 className="text-lg sm:text-xl font-medium text-white mb-3 font-[family-name:var(--font-space-grotesk)]">
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing or using the ZAIYA website and services, you agree to be bound by these Terms of Service. If you do not agree to all of these terms, you may not access or use our services.
            </p>
          </section>

          <section>
            <h2 className="text-lg sm:text-xl font-medium text-white mb-3 font-[family-name:var(--font-space-grotesk)]">
              2. Description of Services
            </h2>
            <p>
              ZAIYA provides cybersecurity consulting, penetration testing, web application development, cloud infrastructure auditing, and compliance advisory services. The scope, deliverables, and timelines of specific engagements are defined in individual service agreements.
            </p>
          </section>

          <section>
            <h2 className="text-lg sm:text-xl font-medium text-white mb-3 font-[family-name:var(--font-space-grotesk)]">
              3. Eligibility
            </h2>
            <p>
              You must be at least 18 years old and have the legal capacity to enter into binding contracts to use our services. By engaging ZAIYA, you represent that you meet these requirements.
            </p>
          </section>

          <section>
            <h2 className="text-lg sm:text-xl font-medium text-white mb-3 font-[family-name:var(--font-space-grotesk)]">
              4. Client Responsibilities
            </h2>
            <ul className="list-disc list-inside space-y-2 text-slate-400">
              <li>Provide accurate and complete information necessary for service delivery.</li>
              <li>Ensure proper authorization before requesting penetration testing or security assessments on any systems.</li>
              <li>Maintain confidentiality of any credentials, reports, or sensitive findings shared during an engagement.</li>
              <li>Comply with all applicable laws and regulations related to the services.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg sm:text-xl font-medium text-white mb-3 font-[family-name:var(--font-space-grotesk)]">
              5. Intellectual Property
            </h2>
            <p className="mb-3">
              All content on the ZAIYA website—including text, graphics, logos, animations, and code—is the property of ZAIYA and is protected by intellectual property laws. You may not reproduce, distribute, or create derivative works without our prior written consent.
            </p>
            <p>
              For client projects, intellectual property ownership and licensing terms are defined in the applicable service agreement.
            </p>
          </section>

          <section>
            <h2 className="text-lg sm:text-xl font-medium text-white mb-3 font-[family-name:var(--font-space-grotesk)]">
              6. Confidentiality
            </h2>
            <p>
              ZAIYA treats all client data, findings, and communications as confidential. We will not disclose client information to third parties without prior consent, except as required by law. Mutual confidentiality obligations are typically formalized in our service agreements.
            </p>
          </section>

          <section>
            <h2 className="text-lg sm:text-xl font-medium text-white mb-3 font-[family-name:var(--font-space-grotesk)]">
              7. Payment Terms
            </h2>
            <p>
              Payment terms, fees, and billing schedules are specified in individual service agreements. Unless otherwise agreed, invoices are due within 30 days of issuance. ZAIYA reserves the right to suspend services for overdue accounts.
            </p>
          </section>

          <section>
            <h2 className="text-lg sm:text-xl font-medium text-white mb-3 font-[family-name:var(--font-space-grotesk)]">
              8. Limitation of Liability
            </h2>
            <p>
              To the fullest extent permitted by law, ZAIYA shall not be liable for any indirect, incidental, consequential, or punitive damages arising from the use of our website or services. Our total liability for any claim shall not exceed the fees paid by you for the specific service giving rise to the claim.
            </p>
          </section>

          <section>
            <h2 className="text-lg sm:text-xl font-medium text-white mb-3 font-[family-name:var(--font-space-grotesk)]">
              9. Disclaimer of Warranties
            </h2>
            <p>
              Our services are provided &quot;as is&quot; and &quot;as available.&quot; While we strive for accuracy and thoroughness, no security assessment can guarantee the discovery of all vulnerabilities. ZAIYA makes no warranties, express or implied, regarding the completeness or effectiveness of our testing or recommendations.
            </p>
          </section>

          <section>
            <h2 className="text-lg sm:text-xl font-medium text-white mb-3 font-[family-name:var(--font-space-grotesk)]">
              10. Termination
            </h2>
            <p>
              Either party may terminate a service engagement in accordance with the terms of the applicable service agreement. ZAIYA reserves the right to terminate website access for any user who violates these terms.
            </p>
          </section>

          <section>
            <h2 className="text-lg sm:text-xl font-medium text-white mb-3 font-[family-name:var(--font-space-grotesk)]">
              11. Governing Law
            </h2>
            <p>
              These Terms of Service shall be governed by and construed in accordance with applicable law, without regard to conflict of law principles. Any disputes shall be resolved through binding arbitration or in the courts of competent jurisdiction.
            </p>
          </section>

          <section>
            <h2 className="text-lg sm:text-xl font-medium text-white mb-3 font-[family-name:var(--font-space-grotesk)]">
              12. Changes to These Terms
            </h2>
            <p>
              We may update these Terms of Service at any time. Changes will be posted on this page with an updated effective date. Continued use of our website or services after changes constitutes acceptance of the revised terms.
            </p>
          </section>

          <section>
            <h2 className="text-lg sm:text-xl font-medium text-white mb-3 font-[family-name:var(--font-space-grotesk)]">
              13. Contact Us
            </h2>
            <p>
              If you have questions about these Terms of Service, please contact us at{" "}
              <a href="mailto:legal@zaiya.com" className="text-cyan-400 hover:text-cyan-300 transition-colors">
                legal@zaiya.com
              </a>{" "}
              or visit our{" "}
              <Link href="/contact" className="text-cyan-400 hover:text-cyan-300 transition-colors">
                Contact page
              </Link>.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
