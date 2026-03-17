import Layout from '../components/Layout';

export default function PrivacyPage() {
  const sections = [
    {
      title: '1. Information We Collect',
      content: `We collect information you provide directly to us, such as when you subscribe to our newsletter, contact us, or use our free tools. This may include your name, email address, and any messages you send us. We also automatically collect certain technical information when you visit our website, including your IP address, browser type, operating system, referring URLs, and pages viewed.`,
    },
    {
      title: '2. How We Use Your Information',
      content: `We use the information we collect to operate and improve AIToolsHub, send you newsletters and updates you have subscribed to, respond to your comments and questions, monitor and analyze usage patterns and trends, and detect and prevent fraudulent activity. We never sell your personal data to third parties.`,
    },
    {
      title: '3. Cookies',
      content: `AIToolsHub uses cookies and similar tracking technologies to track activity on our site and hold certain information. Cookies are files with small amounts of data. You can instruct your browser to refuse all cookies or indicate when a cookie is being sent. However, if you do not accept cookies, some portions of our site may not function properly.`,
    },
    {
      title: '4. Third-Party Links',
      content: `Our website contains links to external AI tools and websites. We are not responsible for the privacy practices or content of those third-party sites. We encourage you to read the privacy policies of any external sites you visit. The AI tools listed on AIToolsHub have their own separate privacy policies.`,
    },
    {
      title: '5. Data Security',
      content: `We implement commercially reasonable security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction. However, no internet transmission or electronic storage is 100% secure, and we cannot guarantee absolute security of your data.`,
    },
    {
      title: '6. Children\'s Privacy',
      content: `AIToolsHub is not directed to individuals under the age of 13. We do not knowingly collect personal information from children under 13. If we become aware that a child under 13 has provided us with personal information, we will take steps to delete such information from our systems.`,
    },
    {
      title: '7. Changes to This Policy',
      content: `We may update this Privacy Policy from time to time. We will notify you of any significant changes by posting the new policy on this page and updating the "Last Updated" date. Your continued use of AIToolsHub after any changes constitutes your acceptance of the updated policy.`,
    },
    {
      title: '8. Contact Us',
      content: `If you have any questions or concerns about this Privacy Policy or our data practices, please contact us at phatanrayyankhan9@gmail.com. We will respond to all privacy-related inquiries within 48 hours.`,
    },
  ];

  return (
    <Layout title="Privacy Policy" description="AIToolsHub Privacy Policy">
      <div className="bg-gradient-to-br from-gray-900 to-brand-900 py-14 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-5xl mb-4">🔒</div>
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">Privacy Policy</h1>
          <p className="text-gray-300 text-lg">
            Last Updated: <span className="text-brand-300 font-semibold">March 13, 2026</span>
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="bg-brand-50 border border-brand-100 rounded-2xl p-6 mb-10">
          <p className="text-brand-700 text-sm leading-relaxed">
            <strong>Summary:</strong> AIToolsHub respects your privacy. We collect minimal data, never sell it, and use it only to improve your experience. If you have any questions, email us at{' '}
            <a href="mailto:phatanrayyankhan9@gmail.com" className="font-semibold underline">
              phatanrayyankhan9@gmail.com
            </a>
          </p>
        </div>

        <div className="space-y-8">
          {sections.map((section, i) => (
            <div key={i} className="bg-white rounded-2xl p-7 border border-gray-100 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-brand-100 text-brand-700 text-sm font-bold flex items-center justify-center flex-shrink-0">
                  {i + 1}
                </span>
                {section.title.replace(/^\d+\.\s/, '')}
              </h2>
              <p className="text-gray-600 leading-relaxed">{section.content}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center bg-gray-50 rounded-2xl p-8 border border-gray-100">
          <p className="text-gray-600 mb-3">Questions about our Privacy Policy?</p>
          <a
            href="mailto:phatanrayyankhan9@gmail.com"
            className="btn-primary inline-flex"
          >
            📧 Email Us: phatanrayyankhan9@gmail.com
          </a>
        </div>
      </div>
    </Layout>
  );
}
