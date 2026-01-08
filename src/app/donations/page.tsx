'use client';

import Link from 'next/link';

export default function DonationsPage() {
  const donationTypes = [
    {
      title: 'Silent Auction Donations',
      description: 'Products, services, gift certificates, experiences',
      icon: 'gavel',
    },
    {
      title: 'Local-Themed Baskets',
      description: 'Restaurants, wellness, pets, family fun, etc.',
      icon: 'shopping_basket',
    },
    {
      title: 'Gift Cards',
      description: 'From local businesses and popular retailers',
      icon: 'card_giftcard',
    },
    {
      title: 'Dessert Table Donations',
      description: 'Homemade or store-bought desserts for the event',
      icon: 'cake',
    },
    {
      title: 'Beverage Donations',
      description: 'Wine, craft beer, spirits, mocktail supplies – unopened and store-bought',
      icon: 'local_bar',
    },
    {
      title: 'Event Sponsorships',
      description: 'Help offset food, décor, and entertainment costs',
      icon: 'sponsor',
    },
  ];

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
              <span className="material-symbols-outlined text-sm">favorite</span> Support Our School
            </div>
            <h1 className="text-white text-4xl md:text-5xl font-black leading-tight tracking-[-0.033em]">
              Donations
            </h1>
            <h2 className="text-gray-300 text-base md:text-lg font-normal max-w-2xl">
              Your contribution makes a meaningful difference and showcases your commitment to local education.
            </h2>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 md:px-10 lg:px-20 py-8 flex justify-center">
        <div className="flex flex-col max-w-[1200px] w-full gap-8">
          {/* Introduction Section */}
          <section className="flex flex-col gap-6">
            <h2 className="text-[#181411] dark:text-white text-3xl font-bold leading-tight">
              How You Can Help
            </h2>
            <div className="flex flex-col gap-4 text-[#181411]/80 dark:text-gray-300">
              <p className="text-base leading-relaxed">
                We kindly ask you to consider donating an item, experience, gift certificate, or
                sponsorship for this year&apos;s event. Your generosity strengthens our auction offerings and
                provides valuable visibility among families and community members who appreciate
                businesses that support their local schools.
              </p>
            </div>
          </section>

          {/* Donation Types Grid */}
          <section className="flex flex-col gap-6">
            <h2 className="text-[#181411] dark:text-white text-2xl font-bold leading-tight">
              We Are Seeking
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {donationTypes.map((type, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-[#2a221a] rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col gap-4"
                >
                  <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                    <span className="material-symbols-outlined text-2xl">{type.icon}</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <h3 className="text-[#181411] dark:text-white text-lg font-bold leading-tight">
                      {type.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm leading-normal">
                      {type.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Tax Information */}
          <section className="bg-gradient-to-r from-primary/10 to-orange-500/10 rounded-xl p-8 border border-primary/20">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary text-3xl">receipt</span>
                <h3 className="text-[#181411] dark:text-white text-xl font-bold">Tax Deduction Information</h3>
              </div>
              <p className="text-[#181411]/80 dark:text-gray-300">
                As a nonprofit organization, all contributions are tax-deductible.
              </p>
              <div className="bg-white dark:bg-[#181411] rounded-lg p-4 border border-primary/20">
                <p className="text-[#181411] dark:text-white font-bold">
                  Tax ID #94-6174418
                </p>
              </div>
            </div>
          </section>

          {/* Mailing Information */}
          <section className="bg-white dark:bg-[#2a221a] rounded-xl p-8 shadow-sm border border-gray-100 dark:border-gray-800">
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary text-3xl">mail</span>
                <h3 className="text-[#181411] dark:text-white text-xl font-bold">Donation Mailing Information</h3>
              </div>
              <div className="flex flex-col gap-2 text-[#181411]/80 dark:text-gray-300">
                <p className="font-semibold text-[#181411] dark:text-white">Albert Schweitzer Elementary School PTA</p>
                <p>Attn: Andrea Ellery, PTA</p>
                <p>4350 Glenridge Drive</p>
                <p>Carmichael, CA 95608</p>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="rounded-xl bg-gradient-to-r from-primary to-orange-500 p-8 md:p-12 text-center">
            <div className="flex flex-col items-center gap-6 max-w-2xl mx-auto">
              <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-white text-3xl">volunteer_activism</span>
              </div>
              <h2 className="text-white text-3xl font-bold">Ready to Donate?</h2>
              <p className="text-white/90 text-lg">
                Have questions or want to discuss your donation? We&apos;d love to hear from you!
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="mailto:AlbertSchweitzerPTA@gmail.com"
                  className="bg-[#181411] hover:bg-black text-white font-bold py-3 px-6 rounded-lg transition-colors"
                >
                  Contact Us
                </a>
                <Link
                  href="/auction"
                  className="bg-white hover:bg-gray-100 text-primary font-bold py-3 px-6 rounded-lg transition-colors border-2 border-white"
                >
                  Learn About the Auction
                </Link>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

