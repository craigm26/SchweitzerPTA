'use client';

import Link from 'next/link';

export default function ResourcesPage() {
  const resources = [
    {
      title: 'Albert Schweitzer PTA Bylaws',
      description: 'View our official PTA bylaws and governance documents',
      href: '#',
      icon: 'description',
      category: 'Documents',
    },
    {
      title: 'Teacher Reimbursement Form',
      description: 'Submit reimbursement requests for classroom expenses',
      href: '#',
      icon: 'receipt_long',
      category: 'Forms',
    },
    {
      title: 'General Reimbursement Form',
      description: 'Submit general reimbursement requests for PTA-related expenses',
      href: '#',
      icon: 'description',
      category: 'Forms',
    },
    {
      title: 'PTA Instagram',
      description: 'Follow us on Instagram for the latest updates and photos',
      href: 'https://www.instagram.com/schweitzer_elementary?igsh=NTc4MTIwNjQ2YQ==',
      icon: 'photo_camera',
      category: 'Social Media',
      external: true,
    },
    {
      title: 'PTA Facebook',
      description: 'Connect with us on Facebook for news and community updates',
      href: 'https://www.facebook.com/schweitzer.elementary?mibextid=wwXIfr',
      icon: 'share',
      category: 'Social Media',
      external: true,
    },
    {
      title: 'San Juan School District Volunteer Fingerprinting',
      description: 'Complete required fingerprinting for school volunteers',
      href: 'https://www.sanjuan.edu/connect/volunteer',
      icon: 'fingerprint',
      category: 'Volunteer',
      external: true,
    },
  ];

  const categories = ['All', 'Documents', 'Forms', 'Social Media', 'Volunteer'];

  return (
    <main className="layout-container flex h-full grow flex-col pb-20">
      {/* Hero Section */}
      <div className="w-full bg-[#181411]">
        <div className="relative w-full h-[320px] flex items-center justify-center overflow-hidden">
          <div
            className="absolute inset-0 bg-center bg-cover opacity-40 mix-blend-overlay"
            style={{
              backgroundImage:
                'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDe6jw42NH7O6HBK4-_pDgetxwbKwV4vkea4ZUWqNCs5GTreR5TneieFr-c-uwq6-FlXAybVI_T9Dl5_2n1GREGYCuVNkF5dBWrhs37Sd7cZvgea7YLD8y7wyqFwcRuVLTHWiuNmT5cB5Ge9d3Okuys58iW_ifv7uxNGzxJRNjbfGv56j6yiD3FTrEkymsy-hC3jltB2ZHsVuMX6TJG3Yril76y4wq5nwnvI9820utJK1HM3-Hv4KddLzchnVvhCL0FskaRtoU5q-dQ")',
            }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#181411] via-transparent to-transparent"></div>
          <div className="relative z-10 flex flex-col items-center gap-4 text-center px-4 max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 border border-primary/30 text-primary text-xs font-bold uppercase tracking-wider mb-2">
              <span className="material-symbols-outlined text-sm">folder</span> Resources
            </div>
            <h1 className="text-white text-4xl md:text-5xl font-black leading-tight tracking-[-0.033em]">
              Resources & Links
            </h1>
            <h2 className="text-gray-300 text-base md:text-lg font-normal max-w-2xl">
              Find forms, documents, and important links to help you stay connected with the Albert Schweitzer PTA.
            </h2>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 md:px-10 lg:px-20 py-8 flex justify-center">
        <div className="flex flex-col max-w-[1200px] w-full gap-8">
          {/* Resources Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.map((resource, index) => {
              const LinkComponent = resource.external ? 'a' : Link;
              const linkProps = resource.external
                ? {
                    href: resource.href,
                    target: '_blank',
                    rel: 'noopener noreferrer',
                  }
                : { href: resource.href };

              return (
                <LinkComponent
                  key={index}
                  {...linkProps}
                  className="bg-white dark:bg-[#2a221a] rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-md hover:-translate-y-1 transition-all flex flex-col gap-4 group"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                      <span className="material-symbols-outlined text-2xl">{resource.icon}</span>
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded">
                      {resource.category}
                    </span>
                  </div>
                  <div className="flex flex-col gap-2 flex-1">
                    <h3 className="text-[#181411] dark:text-white text-lg font-bold leading-tight">
                      {resource.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm leading-normal">
                      {resource.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-primary font-bold text-sm group-hover:gap-3 transition-all">
                    {resource.external ? 'Visit Link' : 'View Resource'}
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </div>
                </LinkComponent>
              );
            })}
          </div>

          {/* Additional Info Section */}
          <div className="bg-gradient-to-r from-primary/10 to-orange-500/10 rounded-xl p-8 border border-primary/20">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary text-3xl">info</span>
                <h3 className="text-[#181411] dark:text-white text-xl font-bold">Need Help?</h3>
              </div>
              <p className="text-[#181411]/80 dark:text-gray-300">
                If you can&apos;t find what you&apos;re looking for or need assistance with any of these resources,
                please contact us at{' '}
                <a
                  href="mailto:AlbertSchweitzerPTA@gmail.com"
                  className="text-primary font-bold hover:underline"
                >
                  AlbertSchweitzerPTA@gmail.com
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

