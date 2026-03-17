import Layout from '../components/Layout';

export default function TermsPage() {
  const sections = [
    {
      icon: '✅',
      title: 'Acceptance of Terms',
      content: `By accessing and using AIToolsHub ("the Site"), you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our website. These terms apply to all visitors, users, and anyone who accesses or uses our services.`,
    },
    {
      icon: '📋',
      title: 'Description of Service',
      content: `AIToolsHub is a directory and information website that lists, categorizes, and provides information about AI tools and free online utilities. We do not own or operate the third-party AI tools listed on our website. We provide information, descriptions, and links to these tools as a convenience to our users.`,
    },
    {
      icon: '🚫',
      title: 'Prohibited Activities',
      content: `You agree not to use AIToolsHub for any unlawful purpose or in any way that violates these terms. Prohibited activities include scraping or harvesting our content without permission, attempting to gain unauthorized access to our systems, using our site to distribute spam or malicious content, reproducing our content for commercial use without written permission, or impersonating AIToolsHub or its team members.`,
    },
    {
      icon: '🔗',
      title: 'Third-Party Tools and Links',
      content: `AIToolsHub provides links to third-party AI tools and websites for informational purposes only. We do not endorse, guarantee, or take responsibility for any third-party tools, their accuracy, legality, or content. Your use of any third-party tool is subject to that tool's own terms and conditions. We are not liable for any damages or losses caused by third-party tools.`,
    },
    {
      icon: '⚠️',
      title: 'Disclaimer of Warranties',
      content: `AIToolsHub is provided "as is" and "as available" without warranties of any kind, either express or implied. We do not warrant that the site will be error-free, uninterrupted, or free of viruses or other harmful components. Tool information, ratings, and descriptions are provided for general informational purposes only and may not always reflect the current state of listed tools.`,
    },
    {
      icon: '💡',
      title: 'Intellectual Property',
      content: `All content on AIToolsHub, including text, graphics, logos, and the compilation thereof, is the property of AIToolsHub and is protected by applicable intellectual property laws. You may not reproduce, distribute, or create derivative works from our content without express written permission. The names and logos of third-party AI tools belong to their respective owners.`,
    },
    {
      icon: '🔄',
      title: 'Changes to Terms',
      content: `We reserve the right to modify these Terms of Service at any time. We will notify users of significant changes by updating the "Last Updated" date at the top of this page. Your continued use of AIToolsHub after any changes constitutes your acceptance of the new terms. We encourage you to review these terms periodically.`,
    },
    {
      icon: '⚖️',
      title: 'Governing Law',
      content: `These Terms of Service shall be governed by and construed in accordance with applicable laws. Any disputes arising from these terms or your use of AIToolsHub shall be resolved through good-faith negotiation. If you have a dispute, please contact us first at phatanrayyankhan9@gmail.com before pursuing other remedies.`,
    },
  ];

  return (
    <Layout title="Terms of Service" description="AIToolsHub Terms of Service">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 py-14 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-5xl mb-4">📜</div>
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">Terms of Service</h1>
          <p className="text-gray-300 text-lg">
            Last Updated: <span className="text-yellow-400 font-semibold">March 13, 2026</span>
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6 mb-10">
          <p className="text-yellow-800 text-sm leading-relaxed">
            <strong>⚠️ Please read these terms carefully.</strong> By using AIToolsHub, you agree to these Terms of Service. For questions, contact{' '}
            <a href="mailto:phatanrayyankhan9@gmail.com" className="font-semibold underline">
              phatanrayyankhan9@gmail.com
            </a>
          </p>
        </div>

        <div className="space-y-6">
          {sections.map((section, i) => (
            <div key={i} className="bg-white rounded-2xl p-7 border border-gray-100 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-3">
                <span className="text-2xl">{section.icon}</span>
                {section.title}
              </h2>
              <p className="text-gray-600 leading-relaxed">{section.content}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center bg-gray-50 rounded-2xl p-8 border border-gray-100">
          <p className="text-gray-600 mb-3">Questions about our Terms of Service?</p>
          <a href="mailto:phatanrayyankhan9@gmail.com" className="btn-primary inline-flex">
            📧 Email: phatanrayyankhan9@gmail.com
          </a>
        </div>
      </div>
    </Layout>
  );
}
