'use client';

import Link from 'next/link';

export default function BoardReviewPage() {
  const services = [
    {
      name: 'GitHub',
      purpose: 'Source code hosting and version control',
      icon: '📦',
      freeTier: 'Unlimited public/private repos, unlimited collaborators, GitHub Actions (2,000 mins/month)',
      currentUsage: 'Well within free tier',
      monthlyCost: '$0',
      scalingNotes: 'Free tier is sufficient for this project indefinitely. No expected costs.',
      link: 'https://github.com/pricing',
    },
    {
      name: 'Vercel',
      purpose: 'Website hosting, automatic deployments, CDN, SSL certificates',
      icon: '▲',
      freeTier: '100GB bandwidth/month, unlimited deployments, automatic HTTPS, preview deployments',
      currentUsage: 'Well within free tier',
      monthlyCost: '$0',
      scalingNotes: 'Pro plan ($20/month) needed if: >100GB bandwidth, need team features, or custom SLAs. Unlikely to be needed for a school PTA site.',
      link: 'https://vercel.com/pricing',
    },
    {
      name: 'Supabase',
      purpose: 'Database (PostgreSQL), user authentication, file storage',
      icon: '⚡',
      freeTier: '500MB database, 1GB file storage, 50,000 monthly active users, unlimited API requests',
      currentUsage: 'Well within free tier',
      monthlyCost: '$0',
      scalingNotes: 'Pro plan ($25/month) needed if: >500MB database, need daily backups, or >1GB file storage. Unlikely for text-based content.',
      link: 'https://supabase.com/pricing',
    },
    {
      name: 'Stripe',
      purpose: 'Payment processing for donations',
      icon: '💳',
      freeTier: 'No monthly fee - only pay per transaction',
      currentUsage: 'Pay as you go',
      monthlyCost: '2.9% + $0.30 per donation',
      scalingNotes: 'For a $50 donation, Stripe takes ~$1.75. This is industry standard and unavoidable for online payments.',
      link: 'https://stripe.com/pricing',
    },
  ];

  const maintenanceTasks = {
    admin: [
      { task: 'Manage user accounts and roles', frequency: 'As needed', difficulty: 'Easy' },
      { task: 'Review and approve new editor accounts', frequency: 'As needed', difficulty: 'Easy' },
      { task: 'Monitor Supabase dashboard for issues', frequency: 'Monthly', difficulty: 'Easy' },
      { task: 'Review Vercel deployment logs if site is down', frequency: 'Rare', difficulty: 'Medium' },
      { task: 'Update environment variables if keys change', frequency: 'Yearly', difficulty: 'Medium' },
      { task: 'Renew domain name', frequency: 'Yearly', difficulty: 'Easy' },
    ],
    editor: [
      { task: 'Post news articles', frequency: 'Weekly', difficulty: 'Easy' },
      { task: 'Create and update events', frequency: 'As needed', difficulty: 'Easy' },
      { task: 'Manage sponsor information', frequency: 'Quarterly', difficulty: 'Easy' },
      { task: 'Update volunteer opportunities', frequency: 'As needed', difficulty: 'Easy' },
      { task: 'Respond to contact form submissions', frequency: 'Weekly', difficulty: 'Easy' },
    ],
  };

  const knownIssues = [
    {
      category: 'Dead Links / Placeholder Content',
      items: [
        { issue: 'Donate button needs Stripe account connected', status: 'needs-setup', priority: 'High' },
        { issue: '"Privacy Policy" link in login footer goes nowhere', status: 'placeholder', priority: 'Medium' },
        { issue: '"Terms of Service" link in login footer goes nowhere', status: 'placeholder', priority: 'Medium' },
        { issue: '"Support" link in login footer goes nowhere', status: 'placeholder', priority: 'Low' },
        { issue: '"Forgot password?" functionality not implemented', status: 'not-built', priority: 'Medium' },
        { issue: '"Membership" link in footer goes nowhere', status: 'placeholder', priority: 'Medium' },
      ],
    },
    {
      category: 'Content Needed',
      items: [
        { issue: 'About page needs real PTA board member photos and bios', status: 'content-needed', priority: 'Medium' },
        { issue: 'Homepage hero image is a placeholder', status: 'content-needed', priority: 'High' },
        { issue: 'Sponsor logos need to be collected from actual sponsors', status: 'content-needed', priority: 'High' },
        { issue: 'News articles are empty - need initial content', status: 'content-needed', priority: 'High' },
        { issue: 'Events calendar needs real school events', status: 'content-needed', priority: 'High' },
        { issue: 'Volunteer opportunities need real listings', status: 'content-needed', priority: 'Medium' },
      ],
    },
    {
      category: 'Technical Improvements (Nice to Have)',
      items: [
        { issue: 'Email notifications for contact form submissions', status: 'not-built', priority: 'Medium' },
        { issue: 'Email notifications for volunteer signups', status: 'not-built', priority: 'Medium' },
        { issue: 'Password reset email flow', status: 'not-built', priority: 'Medium' },
        { issue: 'Image upload for news articles (currently URL-based)', status: 'not-built', priority: 'Low' },
        { issue: 'Rich text editor for news content', status: 'not-built', priority: 'Low' },
      ],
    },
  ];

  const domainInfo = {
    options: [
      { domain: 'schweitzerpta.org', price: '~$12-15/year', recommended: false },
      { domain: 'schweitzerpta.com', price: '~$12-15/year', recommended: true },
      { domain: 'schweitzer-pta.org', price: '~$12-15/year', recommended: false },
    ],
    registrars: [
      { name: 'Namecheap', price: 'Cheapest option', link: 'https://namecheap.com' },
      { name: 'Vercel Domains', price: 'At-cost pricing', link: 'https://domains.vercel.com' },
      { name: 'Cloudflare', price: 'At-cost pricing', link: 'https://cloudflare.com/products/registrar' },
    ],
    steps: [
      'Purchase domain from registrar (~$12-15/year)',
      'Add domain to Vercel project (free)',
      'Update DNS records as instructed by Vercel',
      'SSL certificate is automatic and free',
    ],
  };

  const trafficEstimates = [
    { scenario: 'Current (Pre-launch)', visitors: '10-50/month', bandwidth: '<1GB', cost: '$0' },
    { scenario: 'After Launch', visitors: '200-500/month', bandwidth: '2-5GB', cost: '$0' },
    { scenario: 'Active School Year', visitors: '500-1,000/month', bandwidth: '5-10GB', cost: '$0' },
    { scenario: 'Viral Event', visitors: '5,000+/month', bandwidth: '20-50GB', cost: '$0 (still under 100GB limit)' },
  ];

  return (
    <div className="min-h-screen bg-[#f9f7f5]">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#181411] to-[#2a2420] text-white py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 bg-amber-500 text-black text-xs font-bold rounded-full uppercase">
              Draft for Board Review
            </span>
          </div>
          <h1 className="text-4xl font-bold mb-4">Website Adoption Proposal</h1>
          <p className="text-white/80 text-lg max-w-3xl">
            A comprehensive overview of the new Schweitzer PTA website, including costs, maintenance requirements, 
            and items needing attention before launch.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12 space-y-16">
        {/* Cost Summary */}
        <section>
          <h2 className="text-2xl font-bold text-[#181411] mb-2">💰 Monthly Cost Summary</h2>
          <p className="text-gray-600 mb-6">All services are currently operating within free tiers.</p>
          
          <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-6 mb-8">
            <div className="flex items-center gap-4">
              <div className="text-5xl font-bold text-green-600">$0</div>
              <div>
                <div className="font-bold text-green-800">Total Monthly Hosting Cost</div>
                <div className="text-green-700 text-sm">Only pay-per-use for Stripe donations (2.9% + $0.30)</div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {services.map((service) => (
              <div key={service.name} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="text-3xl">{service.icon}</div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-[#181411]">{service.name}</h3>
                    <p className="text-gray-600 text-sm mb-3">{service.purpose}</p>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Current Cost:</span>
                        <span className="font-bold text-green-600">{service.monthlyCost}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Status:</span>
                        <span className="text-green-600">{service.currentUsage}</span>
                      </div>
                    </div>

                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                      <div className="text-xs text-gray-500 uppercase font-bold mb-1">Free Tier Includes</div>
                      <div className="text-sm text-gray-700">{service.freeTier}</div>
                    </div>

                    <div className="mt-3 p-3 bg-amber-50 rounded-lg">
                      <div className="text-xs text-amber-700 uppercase font-bold mb-1">When Would We Pay?</div>
                      <div className="text-sm text-amber-800">{service.scalingNotes}</div>
                    </div>

                    <a
                      href={service.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 mt-3 text-primary text-sm font-medium hover:underline"
                    >
                      View Pricing Page →
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Traffic Estimates */}
        <section>
          <h2 className="text-2xl font-bold text-[#181411] mb-2">📊 Traffic & Cost Scaling</h2>
          <p className="text-gray-600 mb-6">Estimated traffic scenarios and associated costs.</p>
          
          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-xl border border-gray-200 shadow-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left p-4 font-bold text-[#181411]">Scenario</th>
                  <th className="text-left p-4 font-bold text-[#181411]">Monthly Visitors</th>
                  <th className="text-left p-4 font-bold text-[#181411]">Bandwidth</th>
                  <th className="text-left p-4 font-bold text-[#181411]">Estimated Cost</th>
                </tr>
              </thead>
              <tbody>
                {trafficEstimates.map((estimate, i) => (
                  <tr key={i} className="border-b border-gray-100 last:border-0">
                    <td className="p-4 font-medium">{estimate.scenario}</td>
                    <td className="p-4 text-gray-600">{estimate.visitors}</td>
                    <td className="p-4 text-gray-600">{estimate.bandwidth}</td>
                    <td className="p-4 font-bold text-green-600">{estimate.cost}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <p className="text-sm text-gray-500 mt-4">
            * A typical school PTA website rarely exceeds 1,000 visitors/month. The free tiers are designed for exactly this use case.
          </p>
        </section>

        {/* Domain Name */}
        <section>
          <h2 className="text-2xl font-bold text-[#181411] mb-2">🌐 Domain Name</h2>
          <p className="text-gray-600 mb-6">The only recurring cost: approximately $12-15/year for a custom domain.</p>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h3 className="font-bold text-lg mb-4">Recommended Domain Options</h3>
              <div className="space-y-3">
                {domainInfo.options.map((option) => (
                  <div
                    key={option.domain}
                    className={`flex items-center justify-between p-3 rounded-lg ${
                      option.recommended ? 'bg-primary/10 border-2 border-primary' : 'bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {option.recommended && (
                        <span className="px-2 py-0.5 bg-primary text-white text-xs font-bold rounded">
                          Recommended
                        </span>
                      )}
                      <span className="font-mono font-bold">{option.domain}</span>
                    </div>
                    <span className="text-gray-600">{option.price}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h3 className="font-bold text-lg mb-4">Setup Steps</h3>
              <ol className="space-y-3">
                {domainInfo.steps.map((step, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-white text-sm font-bold flex items-center justify-center">
                      {i + 1}
                    </span>
                    <span className="text-gray-700">{step}</span>
                  </li>
                ))}
              </ol>

              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="text-sm text-gray-500 mb-2">Recommended Registrars:</div>
                <div className="flex flex-wrap gap-2">
                  {domainInfo.registrars.map((reg) => (
                    <a
                      key={reg.name}
                      href={reg.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-sm font-medium transition-colors"
                    >
                      {reg.name}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Maintenance Requirements */}
        <section>
          <h2 className="text-2xl font-bold text-[#181411] mb-2">🔧 Maintenance Requirements</h2>
          <p className="text-gray-600 mb-6">What ongoing work is needed to keep the site running.</p>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* Admin Tasks */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                  <span className="material-symbols-outlined text-red-600">admin_panel_settings</span>
                </span>
                <div>
                  <h3 className="font-bold text-lg">Administrator Tasks</h3>
                  <p className="text-sm text-gray-500">Requires technical access</p>
                </div>
              </div>
              <div className="space-y-3">
                {maintenanceTasks.admin.map((task, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium text-sm">{task.task}</div>
                      <div className="text-xs text-gray-500">{task.frequency}</div>
                    </div>
                    <span
                      className={`px-2 py-1 rounded text-xs font-bold ${
                        task.difficulty === 'Easy'
                          ? 'bg-green-100 text-green-700'
                          : task.difficulty === 'Medium'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {task.difficulty}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Editor Tasks */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="material-symbols-outlined text-blue-600">edit_note</span>
                </span>
                <div>
                  <h3 className="font-bold text-lg">Editor Tasks</h3>
                  <p className="text-sm text-gray-500">Content management via admin panel</p>
                </div>
              </div>
              <div className="space-y-3">
                {maintenanceTasks.editor.map((task, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium text-sm">{task.task}</div>
                      <div className="text-xs text-gray-500">{task.frequency}</div>
                    </div>
                    <span
                      className={`px-2 py-1 rounded text-xs font-bold ${
                        task.difficulty === 'Easy'
                          ? 'bg-green-100 text-green-700'
                          : task.difficulty === 'Medium'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {task.difficulty}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Known Issues */}
        <section>
          <h2 className="text-2xl font-bold text-[#181411] mb-2">⚠️ Known Issues & Items Needing Attention</h2>
          <p className="text-gray-600 mb-6">Things that need to be addressed before or after launch.</p>
          
          <div className="space-y-6">
            {knownIssues.map((category) => (
              <div key={category.category} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                  <h3 className="font-bold text-lg">{category.category}</h3>
                </div>
                <div className="divide-y divide-gray-100">
                  {category.items.map((item, i) => (
                    <div key={i} className="flex items-center justify-between px-6 py-4">
                      <div className="flex items-center gap-3">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            item.priority === 'High'
                              ? 'bg-red-500'
                              : item.priority === 'Medium'
                              ? 'bg-amber-500'
                              : 'bg-gray-400'
                          }`}
                        />
                        <span className="text-gray-800">{item.issue}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            item.status === 'needs-setup'
                              ? 'bg-red-100 text-red-700'
                              : item.status === 'placeholder'
                              ? 'bg-amber-100 text-amber-700'
                              : item.status === 'content-needed'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {item.status.replace('-', ' ')}
                        </span>
                        <span
                          className={`px-2 py-1 rounded text-xs font-bold ${
                            item.priority === 'High'
                              ? 'bg-red-500 text-white'
                              : item.priority === 'Medium'
                              ? 'bg-amber-500 text-white'
                              : 'bg-gray-300 text-gray-700'
                          }`}
                        >
                          {item.priority}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Summary */}
        <section className="bg-[#181411] text-white rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-6">📋 Summary for Board Decision</h2>
          
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white/10 rounded-xl p-6">
              <div className="text-3xl font-bold text-primary mb-2">$0/mo</div>
              <div className="text-white/80">Hosting Costs</div>
              <div className="text-sm text-white/60 mt-2">All services on free tiers</div>
            </div>
            <div className="bg-white/10 rounded-xl p-6">
              <div className="text-3xl font-bold text-primary mb-2">~$15/yr</div>
              <div className="text-white/80">Domain Name</div>
              <div className="text-sm text-white/60 mt-2">Only recurring cost</div>
            </div>
            <div className="bg-white/10 rounded-xl p-6">
              <div className="text-3xl font-bold text-primary mb-2">2.9%</div>
              <div className="text-white/80">Stripe Fees</div>
              <div className="text-sm text-white/60 mt-2">Per donation + $0.30</div>
            </div>
          </div>

          <div className="space-y-4 text-white/90">
            <p>
              <strong className="text-primary">Total Annual Cost:</strong> Approximately $15/year for domain name only.
              All other services operate within generous free tiers that are unlikely to be exceeded by a school PTA website.
            </p>
            <p>
              <strong className="text-primary">Maintenance:</strong> Minimal technical knowledge required for day-to-day operations.
              Editors can manage content through a user-friendly admin panel. Administrator tasks are infrequent and straightforward.
            </p>
            <p>
              <strong className="text-primary">Before Launch:</strong> Stripe account setup, content population (news, events, sponsors),
              and domain name acquisition are the main items requiring attention.
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-white/20">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-orange-600 rounded-lg font-bold transition-colors"
            >
              <span className="material-symbols-outlined">arrow_back</span>
              Return to Homepage
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}

