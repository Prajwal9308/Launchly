import type { Metadata } from "next";
import Link from "next/link";
import { LegalBody, LegalContact, LegalDates } from "@/components/marketing/legal-body";
import { PageHero, Section } from "@/components/marketing/section";
import { getLegalContext } from "@/server/legal";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How CoreGravity collects, uses, shares and protects personal information for customers in Canada and India.",
  alternates: { canonical: "/privacy" },
};

export default async function PrivacyPage() {
  const legal = await getLegalContext();
  const { providers } = legal;
  const providerList = [
    providers.hosting ? `${providers.hosting}, which hosts this website and client portal` : "a website hosting provider",
    "a managed PostgreSQL database provider, which stores account and project records",
    providers.storage ? `${providers.storage}, which stores files uploaded to the client portal` : null,
    providers.email ? `${providers.email}, which delivers account and project emails` : null,
    providers.google ? "Google, if you choose to sign in with your Google account" : null,
    providers.ai ? `${providers.ai.name}, which provides the AI service described below` : null,
  ].filter(Boolean) as string[];

  return (
    <>
      <PageHero eyebrow="Legal" title="Privacy Policy" description="How we collect, use, share and protect your personal information." />
      <Section>
        <LegalBody>
          <LegalDates effectiveDate={legal.effectiveDate} />

          <p>
            This Privacy Policy explains how {legal.entity}
            {legal.entity !== legal.brand ? ` (“${legal.brand}”, “we”, “us” or “our”)` : " (“we”, “us” or “our”)"} handles
            personal information when you visit our website, contact us, create a client account or work with us on a project.
            We serve small businesses and independent vendors in Canada and India.
          </p>

          <h2>Information we collect</h2>
          <p>We collect the information you choose to provide and a limited amount of technical information.</p>
          <h3>Account information</h3>
          <p>
            When you create a client account, we collect your name, email address, business name, country, phone number (if
            provided) and your password in encrypted (hashed) form. If you sign in with Google, we receive your name and email
            address from Google.
          </p>
          <h3>Business and project information</h3>
          <p>
            When you submit an enquiry or complete the project questionnaire, we collect details about your business, your
            customers, your goals and your project requirements, including budget range, timeline, brand preferences and any
            websites you refer us to.
          </p>
          <h3>Uploaded files</h3>
          <p>
            You may upload logos, photos, documents and other content. These files may contain personal information about you
            or other people. Please only upload content you have the right to share with us.
          </p>
          <h3>Communications</h3>
          <p>
            We keep the messages, change requests, approvals and comments you send through the client portal, and emails you
            send to us.
          </p>
          <h3>Technical information</h3>
          <p>
            Our servers and hosting provider process technical information such as your IP address, browser type, device
            information and the pages you request. We use this to operate and secure the website, including to prevent abuse
            and limit repeated submissions.
          </p>

          <h2>How we use information</h2>
          <ul>
            <li>To respond to your enquiry and prepare a proposal.</li>
            <li>To create and manage your client account.</li>
            <li>To plan, design, build, test, launch and support your project.</li>
            <li>To communicate with you about your project, including notifications about messages, designs and approvals.</li>
            <li>To keep records of approvals and decisions made during a project.</li>
            <li>To show prices, budget ranges and tax wording that apply to your country.</li>
            <li>To maintain the security of our website and services and to prevent misuse.</li>
            <li>To meet our legal, tax, accounting and record-keeping obligations.</li>
          </ul>
          <p>We do not sell your personal information.</p>

          <h2>Project information</h2>
          <p>
            Information you provide about your project is used to deliver the services described in your Proposal and Project
            Agreement. Access is restricted to authorized personnel and to service providers who need it to provide or maintain
            our services.
          </p>

          <h2>Service providers</h2>
          <p>We use trusted service providers to operate this website and client portal. They currently include:</p>
          <ul>
            {providerList.map((item) => (
              <li key={item}>{item.charAt(0).toUpperCase() + item.slice(1)}.</li>
            ))}
          </ul>
          <p>
            These providers process personal information on our behalf and only as needed to provide their services to us. Some
            of them may store or process information outside your country of residence. When information is processed in
            another country, it may be subject to the laws of that country, including laws that allow access by courts or
            government authorities.
          </p>

          {providers.ai && (
            <>
              <h2>AI services</h2>
              <p>
                We use {providers.ai.name}&apos;s AI service to help summarize project questionnaire answers into an internal
                project brief for our team. AI may process the project information you submit for this summarization and for
                related project administration.
              </p>
              <p>
                AI-generated content is reviewed by our team before it is relied upon. Your project information is not used to
                train public AI models unless this is separately disclosed to you and legally authorized.
              </p>
            </>
          )}

          <h2>Cookies</h2>
          <p>We use a small number of cookies that are necessary for the website and client portal to work:</p>
          <ul>
            <li>Sign-in cookies that keep you signed in to your client account securely.</li>
            <li>A preference cookie that remembers the country you selected, so prices are shown in the right currency.</li>
          </ul>
          <p>We do not use advertising cookies. You can clear or block cookies in your browser, but signing in requires them.</p>

          <h2>Security</h2>
          <p>
            We use reasonable administrative, technical and physical safeguards to protect personal information, including
            encrypted connections, hashed passwords, access controls and restricted access to uploaded files. No method of
            transmission or storage is completely secure, so we cannot guarantee absolute security.
          </p>

          <h2>Retention</h2>
          <p>
            We keep personal information only for as long as it is needed for the purposes described in this policy, including
            to deliver and support your project, maintain business records and meet legal, tax and accounting obligations. When
            it is no longer needed, we delete it or anonymize it.
          </p>

          <h2>Your privacy rights</h2>
          <p>
            Depending on where you live, you may have the right to access the personal information we hold about you, ask us to
            correct it, withdraw your consent, or ask us to delete it, subject to legal and contractual limits. To make a request,
            contact us using the details below. We may need to verify your identity before responding.
          </p>
          <h3>Canada</h3>
          <p>
            For users in Canada, our handling of personal information is intended to comply with applicable Canadian privacy
            legislation. Depending on the circumstances, this may include the Personal Information Protection and Electronic
            Documents Act (PIPEDA) and applicable substantially similar provincial privacy legislation.
          </p>
          <h3>India</h3>
          <p>
            For users in India, we handle digital personal data in accordance with applicable Indian data-protection
            requirements, including the Digital Personal Data Protection Act, 2023 and applicable rules and regulations. You may
            ask us to access, correct, update or erase your personal data, withdraw consent, and nominate another person to
            exercise your rights, as provided by applicable law.
          </p>

          <h2>Commercial communications</h2>
          <p>
            We send service messages about your enquiry, account and projects. We will only send marketing messages where you
            have consented or where the law otherwise permits, including under Canada&apos;s Anti-Spam Legislation (CASL) where it
            applies. Every marketing message will include a way to unsubscribe.
          </p>

          <h2>Children&apos;s privacy</h2>
          <p>
            Our website and services are intended for businesses and are not directed to children. We do not knowingly collect
            personal information from anyone under 18. If you believe a child has provided us with personal information, please
            contact us so we can delete it.
          </p>

          <h2>Changes to this policy</h2>
          <p>
            We may update this policy from time to time. When we do, we will update the date on this page and, where the changes
            are significant, let clients know through the client portal or by email.
          </p>

          <h2>Contact and privacy complaints</h2>
          <p>
            If you have a question, request or complaint about how we handle personal information, please contact us first and
            we will respond as soon as reasonably possible.
          </p>
          <LegalContact entity={legal.entity} address={legal.address} email={legal.privacyEmail} />
          <p>
            If you are not satisfied with our response, you may be able to contact a privacy regulator. In Canada, this is the
            Office of the Privacy Commissioner of Canada or, where applicable, your provincial privacy commissioner. In India,
            you may be able to raise a complaint with the Data Protection Board of India after using our grievance process.
          </p>
          <p>
            See also our <Link href="/terms">Terms of Use</Link>.
          </p>
        </LegalBody>
      </Section>
    </>
  );
}
