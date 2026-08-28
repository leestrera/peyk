import LegalPageLayout from "@/components/LegalPageLayout";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | Peyk Architecture",
  description: "Terms of Service for Peyk Architecture.",
};

export default function TermsOfServicePage() {
  return (
    <LegalPageLayout title="Terms of Service" lastUpdated="August 28, 2026">
      <p>
        Welcome to Peyk Architecture. By accessing our website and engaging our services, you agree to comply with and be bound by the following terms and conditions. Please read these Terms of Service carefully before initializing a project with us.
      </p>

      <h2>1. Acceptance of Terms</h2>
      <p>
        By accessing this website, you agree to be bound by these Terms of Service, all applicable laws, and regulations, and agree that you are responsible for compliance with any applicable local laws. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
      </p>

      <h2>2. Services Provided</h2>
      <p>
        Peyk Architecture provides hyper-premium software architecture, web development, and digital design services. The specific scope, deliverables, timeline, and pricing of any project will be outlined in a separate Statement of Work (SOW) or project contract agreed upon by both parties.
      </p>

      <h2>3. Intellectual Property</h2>
      <p>
        Unless otherwise stated in a project contract, the visual design, architecture, and codebase of this website, as well as the branding and assets of Peyk Architecture, are the intellectual property of Peyk Architecture and are protected by applicable copyright and trademark laws. 
      </p>
      <p>
        Upon full payment for any commissioned project, intellectual property rights for the deliverables will be transferred to the client as specified in the individual project contract.
      </p>

      <h2>4. User Responsibilities</h2>
      <p>
        When initializing a secure transmission via our contact protocol, you agree to provide accurate, current, and complete information. You are prohibited from using this site for any unlawful purpose or to solicit others to perform or participate in any unlawful acts.
      </p>

      <h2>5. Limitation of Liability</h2>
      <p>
        In no event shall Peyk Architecture or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on our website, even if we have been notified orally or in writing of the possibility of such damage.
      </p>

      <h2>6. Revisions and Errata</h2>
      <p>
        The materials appearing on Peyk Architecture's website could include technical, typographical, or photographic errors. We do not warrant that any of the materials on our website are accurate, complete, or current. We may make changes to the materials contained on our website at any time without notice.
      </p>

      <h2>7. Governing Law</h2>
      <p>
        Any claim relating to Peyk Architecture's website shall be governed by the laws of our primary jurisdiction without regard to its conflict of law provisions.
      </p>

      <h2>8. Modifications to Terms</h2>
      <p>
        We reserve the right to revise these terms of service for our website at any time without notice. By using this website you are agreeing to be bound by the then-current version of these Terms of Service.
      </p>

      <h2>9. Contact Information</h2>
      <p>
        If you have any questions or concerns regarding these Terms of Service, please initiate contact through our secure intake protocol on the <a href="/contact">Contact</a> page.
      </p>
    </LegalPageLayout>
  );
}
