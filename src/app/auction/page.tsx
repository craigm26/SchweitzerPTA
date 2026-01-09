'use client';

import Image from 'next/image';

export default function AuctionPage() {
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
            <h1 className="text-white text-4xl md:text-5xl font-black leading-tight tracking-[-0.033em]">
              9th Annual Adult-Only Dinner & Silent Auction
            </h1>
            <h2 className="text-gray-300 text-base md:text-lg font-normal max-w-2xl">
              March 14, 2026
            </h2>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 md:px-10 lg:px-20 py-8 flex justify-center">
        <div className="flex flex-col max-w-[1200px] w-full gap-8">
          {/* About Section */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="flex flex-col gap-6">
              <h2 className="text-[#181411] dark:text-white text-3xl font-bold leading-tight">
                About the Event
              </h2>
              <div className="flex flex-col gap-4 text-[#181411]/80 dark:text-gray-300">
                <p className="text-base leading-relaxed">
                  Albert Schweitzer Elementary School is proud to host our 9th Annual Adult-Only Dinner
                  & Silent Auction on March 14, 2026.
                </p>
                <p className="text-base leading-relaxed">
                  Each year, our auction raises essential funds that directly enhance student learning –
                  supporting classroom stipends, field trips, performing arts, campus improvements, and
                  technology upgrades.
                </p>
              </div>
            </div>
            <div className="rounded-xl overflow-hidden shadow-lg">
              <Image
                src="/auction-image.png"
                alt="9th Annual Adult-Only Dinner & Silent Auction"
                width={800}
                height={600}
                className="w-full h-auto object-cover"
                priority
              />
            </div>
          </section>

          {/* Impact Section */}
          <section className="bg-gradient-to-r from-primary/10 to-orange-500/10 rounded-xl p-8 md:p-12 border border-primary/20">
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary text-4xl">trending_up</span>
                <h3 className="text-[#181411] dark:text-white text-2xl font-bold">How Your Support Helps</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="flex flex-col gap-2">
                  <div className="w-12 h-12 rounded-lg bg-primary/20 text-primary flex items-center justify-center">
                    <span className="material-symbols-outlined text-2xl">class</span>
                  </div>
                  <h4 className="text-[#181411] dark:text-white font-bold">Classroom Stipends</h4>
                  <p className="text-[#181411]/70 dark:text-gray-300 text-sm">
                    Direct funding for teachers to enhance their classrooms
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="w-12 h-12 rounded-lg bg-primary/20 text-primary flex items-center justify-center">
                    <span className="material-symbols-outlined text-2xl">directions_bus</span>
                  </div>
                  <h4 className="text-[#181411] dark:text-white font-bold">Field Trips</h4>
                  <p className="text-[#181411]/70 dark:text-gray-300 text-sm">
                    Educational experiences beyond the classroom
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="w-12 h-12 rounded-lg bg-primary/20 text-primary flex items-center justify-center">
                    <span className="material-symbols-outlined text-2xl">theater_comedy</span>
                  </div>
                  <h4 className="text-[#181411] dark:text-white font-bold">Performing Arts</h4>
                  <p className="text-[#181411]/70 dark:text-gray-300 text-sm">
                    Supporting music, drama, and arts programs
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="w-12 h-12 rounded-lg bg-primary/20 text-primary flex items-center justify-center">
                    <span className="material-symbols-outlined text-2xl">computer</span>
                  </div>
                  <h4 className="text-[#181411] dark:text-white font-bold">Technology</h4>
                  <p className="text-[#181411]/70 dark:text-gray-300 text-sm">
                    Upgrading campus technology and equipment
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Donations Section */}
          <section className="flex flex-col gap-6">
            <h2 className="text-[#181411] dark:text-white text-3xl font-bold leading-tight">
              How You Can Help
            </h2>
            <div className="flex flex-col gap-4 text-[#181411]/80 dark:text-gray-300">
              <p className="text-base leading-relaxed">
                We kindly ask you to consider donating an item, experience, gift certificate, or
                direct contribution for this year&apos;s event. Your generosity strengthens our auction offerings and
                provides valuable visibility among families and community members who appreciate
                supporters of their local schools.
              </p>
            </div>
          </section>

          {/* Donation Types Grid */}
          <section className="flex flex-col gap-6">
            <h2 className="text-[#181411] dark:text-white text-2xl font-bold leading-tight">
              We Are Seeking
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-[#2a221a] rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <span className="material-symbols-outlined text-2xl">gavel</span>
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="text-[#181411] dark:text-white text-lg font-bold leading-tight">
                    Silent Auction Donations
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-normal">
                    Products, services, gift certificates, experiences
                  </p>
                </div>
              </div>
              <div className="bg-white dark:bg-[#2a221a] rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <span className="material-symbols-outlined text-2xl">shopping_basket</span>
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="text-[#181411] dark:text-white text-lg font-bold leading-tight">
                    Local-Themed Baskets
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-normal">
                    Restaurants, wellness, pets, family fun, etc.
                  </p>
                </div>
              </div>
              <div className="bg-white dark:bg-[#2a221a] rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <span className="material-symbols-outlined text-2xl">card_giftcard</span>
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="text-[#181411] dark:text-white text-lg font-bold leading-tight">
                    Gift Cards
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-normal">
                    From local businesses and popular retailers
                  </p>
                </div>
              </div>
              <div className="bg-white dark:bg-[#2a221a] rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <span className="material-symbols-outlined text-2xl">cake</span>
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="text-[#181411] dark:text-white text-lg font-bold leading-tight">
                    Dessert Table Donations
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-normal">
                    Homemade or store-bought desserts for the event
                  </p>
                </div>
              </div>
              <div className="bg-white dark:bg-[#2a221a] rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <span className="material-symbols-outlined text-2xl">local_bar</span>
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="text-[#181411] dark:text-white text-lg font-bold leading-tight">
                    Beverage Donations
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-normal">
                    Wine, craft beer, spirits, mocktail supplies – unopened and store-bought
                  </p>
                </div>
              </div>
              <div className="bg-white dark:bg-[#2a221a] rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <span className="material-symbols-outlined text-2xl">volunteer_activism</span>
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="text-[#181411] dark:text-white text-lg font-bold leading-tight">
                    Community Donations
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-normal">
                    Help offset food, décor, and entertainment costs
                  </p>
                </div>
              </div>
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
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}