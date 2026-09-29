import type { Metadata } from "next";
import Link from "next/link";
import { LegalBody, LegalContact, LegalDates } from "@/components/marketing/legal-body";
import { PageHero, Section } from "@/components/marketing/section";
import { getLegalContext } from "@/server/legal";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "The terms that apply when you use the CoreGravity website and client portal.",
  alternates: { canonical: "/terms" },
};

export default async function TermsPage() {
  const legal = await getLegalContext();
  const we = legal.brand;

  return (
    <>
      <PageHero eyebrow="Legal" title="Terms of Use" description="The terms that apply when you use our website and client portal." />
      <Section>
        <LegalBody>
          <LegalDates effectiveDate={legal.effectiveDate} />

          <h2>1. Acceptance</h2>
          <p>
            These Terms of Use (“Terms”) apply to your use of the {we} website and client portal, provided by {legal.entity}
            {" "}(“{we}”, “we”, “us” or “our”). By using the website or creating a client account, you agree to these Terms. If
            you are using our services on behalf of a business, you confirm that you are authorized to accept these Terms for
            that business.
          </p>

          <h2>2. Services</h2>
          <p>
            {we} designs and develops websites, online stores, booking systems, business applications, customer portals and
            mobile applications for small businesses and independent vendors in Canada and India. Information on this website
            describes our services in general terms and is not an offer to provide any particular service.
          </p>

          <h2>3. Website use</h2>
          <p>
            You may use this website to learn about our services, send us an enquiry and access your client portal. We may
            update, change or remove content on the website at any time.
          </p>

          <h2>4. Client accounts</h2>
          <p>
            You are responsible for keeping your sign-in details secure and for activity under your account. The information
            you give us must be accurate and kept up to date. Please tell us promptly if you believe your account has been used
            without your permission.
          </p>

          <h2>5. Project submissions</h2>
          <p>
            Submitting an enquiry or a project request does not create an obligation for either party to proceed. We review
            each request and, where appropriate, respond with questions or a written Proposal.
          </p>

          <h2>6. Project agreements</h2>
          <p>
            These Terms cover the use of our website and client portal only. The work we carry out for you is governed by a
            separate written Proposal and Project Agreement, which set out the deliverables, scope, timeline, fees, payment
            schedule, revisions, ownership, third-party services, maintenance, cancellation and launch terms for your project.
            Optional ongoing services are covered by a separate Maintenance Agreement. If these Terms conflict with a Project
            Agreement or Maintenance Agreement, that agreement prevails for the project it covers.
          </p>

          <h2>7. Pricing and currencies</h2>
          <p>
            Prices on this website are shown in Canadian dollars (CA$) for customers in Canada and in Indian rupees (₹) for
            customers in India, based on the country you select. Published prices are starting prices for general guidance.
            The price for your project is the price stated in your Proposal and Project Agreement.
          </p>

          <h2>8. Taxes</h2>
          <p>
            Unless stated otherwise, prices do not include taxes. Applicable taxes, such as sales taxes in Canada or GST in
            India, are added where they apply and are shown on your invoice.
          </p>

          <h2>9. Payments</h2>
          <p>
            Payment amounts, schedules and methods are set out in your Project Agreement and on each invoice. We do not collect
            payment card details through this website.
          </p>

          <h2>10. Client responsibilities</h2>
          <p>
            To keep your project on schedule, you agree to provide accurate information, content and feedback in a timely way,
            to review designs and deliverables when requested, and to make sure you have the rights to any content, images,
            trademarks or data you provide to us.
          </p>

          <h2>11. Intellectual property</h2>
          <p>
            The content, design and code of this website belong to {we} or its licensors. You keep ownership of the content you
            provide to us. Ownership of project deliverables, and any licences to use them, are set out in your Project
            Agreement.
          </p>

          <h2>12. Third-party services</h2>
          <p>
            Projects may rely on third-party services such as hosting, domain registration, payment processing, email or
            software libraries. These services are provided under their own terms and pricing, and we are not responsible for
            their availability or performance.
          </p>

          <h2>13. Revisions</h2>
          <p>
            You can request changes to designs and deliverables through the client portal. The number and scope of revisions
            included in your project are set out in your Project Agreement.
          </p>

          <h2>14. Approvals</h2>
          <p>
            When you approve a design, a completed website or a launch through the client portal, we record your name and the
            date of your approval and rely on it to continue with the next stage of your project. An approval confirms your
            decision for that stage of the project only.
          </p>

          <h2>15. Launch</h2>
          <p>
            We launch a website or application only after you have approved it. Launch arrangements, including domains and
            hosting, are agreed in your Project Agreement.
          </p>

          <h2>16. Maintenance</h2>
          <p>
            Maintenance, updates and additional development after launch are provided only under a Maintenance Agreement or
            another written arrangement.
          </p>

          <h2>17. Acceptable use</h2>
          <p>You agree not to:</p>
          <ul>
            <li>use the website or client portal for anything unlawful, harmful or misleading;</li>
            <li>upload content that you do not have the right to share or that contains malicious code;</li>
            <li>attempt to access accounts, projects or data that are not yours;</li>
            <li>interfere with the security or operation of the website; or</li>
            <li>send automated or excessive requests to the website.</li>
          </ul>

          <h2>18. Confidentiality</h2>
          <p>
            We treat the business information and files you share with us as confidential and use them only to provide our
            services, except where disclosure is required by law. Your Project Agreement may include further confidentiality
            terms.
          </p>

          <h2>19. Availability</h2>
          <p>
            We aim to keep the website and client portal available, but we do not guarantee uninterrupted access. We may carry
            out maintenance or make changes that temporarily affect availability.
          </p>

          <h2>20. Disclaimers</h2>
          <p>
            The website and client portal are provided on an “as is” and “as available” basis. To the extent permitted by law,
            we do not make warranties about the website beyond those stated in these Terms or in your Project Agreement.
            Nothing in these Terms limits any rights you have under consumer protection laws that cannot be excluded.
          </p>

          <h2>21. Limitation of liability</h2>
          <p>
            To the extent permitted by law, {we} is not liable for any indirect, incidental, special or consequential loss, or
            for loss of profits, revenue or data, arising from your use of the website or client portal. Our liability in
            connection with project work is set out in your Project Agreement.
          </p>

          <h2>22. Indemnity</h2>
          <p>
            You agree to be responsible for, and to compensate us for, claims arising from content you provide to us that you
            did not have the right to use, or from your breach of these Terms, to the extent permitted by law.
          </p>

          <h2>23. Suspension and termination</h2>
          <p>
            We may suspend or close access to the client portal if these Terms are breached or if we need to protect the
            security of the website or other users. You may stop using the website at any time. Ending access to the portal
            does not end a Project Agreement, which can only be ended under its own terms.
          </p>

          <h2>24. Privacy</h2>
          <p>
            Our <Link href="/privacy">Privacy Policy</Link> explains how we collect, use and protect personal information.
          </p>

          <h2>25. Governing law</h2>
          <p>
            {legal.jurisdiction
              ? `These Terms are governed by the laws of ${legal.jurisdiction}, unless your Project Agreement states otherwise or applicable law requires otherwise.`
              : "These Terms are governed by the laws that apply where you are located in Canada or India, unless your Project Agreement states otherwise."}
          </p>

          <h2>26. Changes</h2>
          <p>
            We may update these Terms from time to time. The updated Terms apply from the date shown on this page. If the changes
            are significant, we will let clients know through the client portal or by email.
          </p>

          <h2>27. Contact</h2>
          <p>If you have questions about these Terms, please contact us:</p>
          <LegalContact entity={legal.entity} address={legal.address} email={legal.contactEmail} />
        </LegalBody>
      </Section>
    </>
  );
}
