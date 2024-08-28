import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const PrivacyPolicy = () => {
  return (
    <div className="container mx-auto p-4">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Privacy Policy</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">Last updated: 2024-01-01</p>
          <p className="mb-4">
            RoomMateFinder ("we", "our", or "us") is committed to protecting
            your privacy. This Privacy Policy explains how we collect, use,
            disclose, and safeguard your information when you visit our website
            www.roommatefinder.com or use our services.
          </p>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">
            Information We Collect
          </CardTitle>
        </CardHeader>
        <CardContent>
          <h3 className="text-xl font-semibold mb-2">Personal Information</h3>
          <p className="mb-4">
            We may collect personal information that you provide to us, such as:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Name</li>
            <li>Email address</li>
            <li>Phone number</li>
            <li>Mailing address</li>
            <li>Payment information</li>
          </ul>

          <h3 className="text-xl font-semibold mb-2">Usage Information</h3>
          <p className="mb-4">
            We may also collect information about how you use our website and
            services, including:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>IP address</li>
            <li>Browser type</li>
            <li>Pages visited</li>
            <li>Time and date of visits</li>
            <li>Referring website</li>
          </ul>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">
            How We Use Your Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            We may use the information we collect for various purposes,
            including:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Provide, maintain, and improve our services</li>
            <li>Process transactions and send related information</li>
            <li>Send you technical notices, updates, and support messages</li>
            <li>Respond to your comments and questions</li>
            <li>Analyze usage patterns and improve our website</li>
          </ul>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">
            Disclosure of Your Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            We may share your information in the following situations:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>With service providers who perform services on our behalf</li>
            <li>To comply with legal obligations</li>
            <li>To protect our rights, privacy, safety, or property</li>
            <li>
              In connection with a business transaction, such as a merger or
              acquisition
            </li>
          </ul>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">Your Choices</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            You have certain rights regarding your personal information,
            including:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Accessing and updating your information</li>
            <li>Opting out of marketing communications</li>
            <li>Requesting deletion of your personal information</li>
          </ul>
          <p>
            To exercise these rights, please contact us at
            roommatefinder@email.com.
          </p>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">Security</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            We implement reasonable security measures to protect your personal
            information. However, no method of transmission over the internet or
            electronic storage is 100% secure, and we cannot guarantee absolute
            security.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">
            Changes to This Privacy Policy
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            We may update our Privacy Policy from time to time. We will notify
            you of any changes by posting the new Privacy Policy on this page
            and updating the "Last updated" date.
          </p>
          <p>
            If you have any questions about this Privacy Policy, please contact
            us at roommatefinder@email.com.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default PrivacyPolicy;
