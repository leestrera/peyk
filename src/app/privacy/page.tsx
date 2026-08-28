import LegalPageLayout from "@/components/LegalPageLayout";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Peyk Architecture",
  description: "Privacy Policy for Peyk Architecture.",
};

export default function PrivacyPolicyPage() {
  return (
    <LegalPageLayout title="Privacy Policy" lastUpdated="August 28, 2026">
      <p>
        At Peyk Architecture, we are committed to protecting your privacy and ensuring that your personal information is handled in a safe and responsible manner. This Privacy Policy outlines how we collect, use, and protect your data when you visit our website or engage our services.
      </p>

      <h2>1. Information We Collect</h2>
      <p>
        When you interact with our website or initialize a project through our secure communication channel, we may collect the following types of information:
      </p>
      <ul>
        <li><strong>Personal Information:</strong> Name, email address, phone number, and company name provided via our contact forms.</li>
        <li><strong>Project Details:</strong> Information regarding your estimated budget, required services, and architectural requirements.</li>
        <li><strong>Usage Data:</strong> We may automatically collect information about how you access and use our website, including your IP address, browser type, and device information, to optimize the digital experience.</li>
      </ul>

      <h2>2. How We Use Your Information</h2>
      <p>
        We use the information we collect for the following purposes:
      </p>
      <ul>
        <li>To respond to your inquiries and establish communication regarding potential projects.</li>
        <li>To architect and deliver the digital solutions you request.</li>
        <li>To improve our website functionality, security, and user experience.</li>
        <li>To comply with legal obligations and protect our legitimate business interests.</li>
      </ul>

      <h2>3. Cookie Policy</h2>
      <p>
        To enhance your experience, our website uses "cookies" and similar tracking technologies. A cookie is a small data file transferred to your device that allows us to recognize your browser and capture certain information.
      </p>
      <ul>
        <li><strong>Essential Cookies:</strong> Required for the website to function securely and properly.</li>
        <li><strong>Analytics Cookies:</strong> Help us understand how visitors interact with our digital infrastructure by collecting and reporting information anonymously.</li>
      </ul>
      <p>
        You can choose to have your computer warn you each time a cookie is being sent, or you can choose to turn off all cookies through your browser settings. However, disabling cookies may impact the seamless experience of our digital environment.
      </p>

      <h2>4. Data Security and Retention</h2>
      <p>
        We implement industry-standard security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction. We retain your data only for as long as necessary to fulfill the purposes outlined in this policy or as required by law.
      </p>

      <h2>5. Third-Party Services</h2>
      <p>
        We do not sell, trade, or otherwise transfer your personally identifiable information to outside parties. This does not include trusted third parties who assist us in operating our website, conducting our business, or servicing you, so long as those parties agree to keep this information confidential.
      </p>

      <h2>6. Your Rights</h2>
      <p>
        Depending on your jurisdiction, you may have the right to access, correct, or delete your personal data. If you wish to exercise any of these rights, please contact us.
      </p>

      <h2>7. Changes to This Policy</h2>
      <p>
        We reserve the right to update this Privacy Policy at any time. Any changes will be posted on this page with an updated revision date.
      </p>

      <h2>8. Contact Us</h2>
      <p>
        If you have any questions or concerns regarding this Privacy Policy, please initiate contact through our secure intake protocol on the <a href="/contact">Contact</a> page.
      </p>
    </LegalPageLayout>
  );
}
