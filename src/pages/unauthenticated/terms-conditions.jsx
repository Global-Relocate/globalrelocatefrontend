import MainLayout from "@/components/layouts/MainLayout";
import React from "react";

const TermsAndConditions = () => {
  return (
    <MainLayout>
      <div className="flex justify-center items-center py-[150px]">
        <div className="w-[80%]" style={{ color: "black" }}>
          <h1 className="font-bold text-[30px]">Terms and Conditions</h1>

          <p className="my-5">
            Welcome to globalrelocate.com! These Terms and Conditions
            (&apos;Terms&apos;) govern your use of our AI-powered platform for
            seamless relocation, legal guidance, and global living, accessed
            through the URL globalrelocate.com (referred to as &apos;the
            Platform&apos;). By accessing or using the Platform, you agree to be
            bound by these Terms. Please read them carefully.
          </p>

          <h3 className="font-bold text-[18px]">1. Platform Use</h3>
          <p className="my-5">
            1.1 Eligibility: You must be at least 18 years old or have the legal
            capacity to enter into contracts in your jurisdiction to use the
            Platform. By accessing or using the Platform, you represent and
            warrant that you meet the eligibility requirements.
          </p>
          <p className="my-5">
            1.2 User Account: You may be required to create a user account to
            access certain features of the Platform. You are responsible for
            maintaining the confidentiality of your account information and
            agree to be solely responsible for all activities conducted through
            your account.
          </p>
          <p className="my-5">
            1.3 Prohibited Activities: You agree not to engage in any activities
            that violate these Terms or any applicable laws or regulations.
            Prohibited activities include, but are not limited to:
          </p>

          <ul className="list-disc pl-5 my-5">
            <li>Violating intellectual property rights</li>
            <li>
              Uploading or sharing content that is illegal, harmful, or
              infringing upon the rights of others
            </li>
            <li>Interfering with the proper functioning of the Platform</li>
            <li>Impersonating another person or entity</li>
          </ul>

          <h3 className="font-bold text-[18px]">2. Intellectual Property</h3>
          <p className="my-5">
            2.1 Ownership: All content, including but not limited to text,
            graphics, logos, images, audio clips, videos, and software,
            available on the Platform is owned by Global Relocate or its
            licensors and is protected by intellectual property laws.
          </p>
          <p className="my-5">
            2.2 Use of Content: You may access and use the content on the
            Platform for personal, non-commercial purposes only. You may not
            modify, reproduce, distribute, display, perform, or create
            derivative works from the content without prior written permission
            from Global Relocate.
          </p>

          <h3 className="font-bold text-[18px]">3. Disclaimer of Warranties</h3>
          <p className="my-5">
            3.1 The Platform is provided on an &apos;as is&apos; and &apos;as
            available&apos; basis without warranties of any kind. Global
            Relocate disclaims all warranties, whether express or implied,
            including but not limited to merchantability, fitness for a
            particular purpose, and non-infringement.
          </p>
          <p className="my-5">
            3.2 Global Relocate does not guarantee the accuracy, completeness,
            or reliability of any content or information on the Platform. You
            acknowledge that your use of the Platform is at your own risk.
          </p>

          <h3 className="font-bold text-[18px]">4. Limitation of Liability</h3>
          <p className="my-5">
            4.1 To the maximum extent permitted by law, Global Relocate and its
            directors, employees, affiliates, and agents shall not be liable for
            any direct, indirect, incidental, special, or consequential damages
            arising out of or in any way connected with your use of the Platform
            or the content therein.
          </p>

          <h3 className="font-bold text-[18px]">5. Third-Party Links</h3>
          <p className="my-5">
            5.1 The Platform may contain links to third-party websites or
            services. Global Relocate is not responsible for the content,
            accuracy, or reliability of any third-party websites or services.
            The inclusion of any such links does not imply endorsement or
            affiliation by Global Relocate.
          </p>

          <h3 className="font-bold text-[18px]">
            6. Modifications and Termination
          </h3>
          <p className="my-5">
            6.1 Global Relocate reserves the right to modify, suspend, or
            discontinue any part or all of the Platform, temporarily or
            permanently, without prior notice. Global Relocate shall not be
            liable to you or any third party for any modifications, suspension,
            or discontinuation of the Platform.
          </p>

          <h3 className="font-bold text-[18px]">
            7. Governing Law and Jurisdiction
          </h3>
          <p className="my-5">
            7.1 These Terms shall be governed by and construed in accordance
            with the laws of [Your Country]. Any dispute arising out of or
            relating to these Terms or your use of the Platform shall be subject
            to the exclusive jurisdiction of the courts in [Your City, Country].
          </p>

          <h3 className="font-bold text-[18px]">8. Entire Agreement</h3>
          <p className="my-5">
            8.1 These Terms constitute the entire agreement between you and
            Global Relocate regarding the use of the Platform and supersede any
            prior or contemporaneous agreements, communications, or
            representations.
          </p>

          <h3 className="font-bold text-[18px]">
            9. Why Choose Global Relocate
          </h3>
          <p className="my-5">
            At Global Relocate, we are committed to helping you relocate smarter
            and live better. Here’s why you should choose us:
          </p>
          <ul className="list-disc pl-5 my-5">
            <li>
              <strong>Time-Saving AI-Supported Data:</strong> Access always
              up-to-date and reliable information to make informed decisions.
            </li>
            <li>
              <strong>Verified Contacts & Trusted Sources:</strong> Benefit from
              a community-based platform ensuring credibility and trust.
            </li>
            <li>
              <strong>All-in-One Solution:</strong> Find everything from visas
              to cost of living in one place.
            </li>
            <li>
              <strong>Personalized Alerts:</strong> Stay ahead with tailored
              notifications and a favorites feature designed just for you.
            </li>
          </ul>
        </div>
      </div>
    </MainLayout>
  );
};

export default TermsAndConditions;
