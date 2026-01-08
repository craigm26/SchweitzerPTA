import Link from 'next/link';

export default async function NewsArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  await params;
  
  const communityDonors = [
    { name: 'Main Street Pizza', description: 'Providing lunch for volunteers' },
    { name: 'First National Bank', description: 'Matching donation partner' },
    { name: 'Schweitzer Realty Group', description: 'Community support' },
  ];

  const moreNews = [
    {
      category: 'Academics',
      title: 'Book Fair Next Week: What You Need to Know',
      date: 'Oct 20, 2023',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDl-hTl5tGPQ6HIfL0gBVdYqPZD1aChLEhMQ4SV',
    },
    {
      category: 'Staff',
      title: 'Meet Our New Science Teacher',
      date: 'Oct 15, 2023',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD0_t7hJk9YmLUq3XWE8EoNK5rWE4hFGQ9Md7s',
    },
    {
      category: 'PTA',
      title: 'Upcoming PTA Meeting Agenda',
      date: 'Oct 12, 2023',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC_g5rT8kL2MN3xYWZ7tUvQ6hJk9aRbCdE4Of5',
    },
  ];

  return (
    <div className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Main Content */}
        <main className="lg:col-span-8 flex flex-col gap-6">
          {/* Breadcrumb */}
          <nav className="flex items-center text-sm font-medium text-[#897561] dark:text-gray-400">
            <Link className="hover:text-primary transition-colors" href="/news">
              News
            </Link>
            <span className="mx-2">/</span>
            <span className="text-[#181411] dark:text-white truncate">Annual Fun Run Details</span>
          </nav>

          {/* Article Header */}
          <div className="flex flex-col gap-4 border-b border-[#e6e0db] dark:border-gray-700 pb-6">
            <div className="flex flex-wrap justify-between items-start gap-4">
              <h1 className="text-3xl md:text-4xl font-black text-[#181411] dark:text-white leading-tight tracking-tight max-w-3xl">
                Annual Fun Run Raises Record Funds for New Playground!
              </h1>
              <button className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded bg-[#f4f2f0] dark:bg-gray-800 text-[#181411] dark:text-white text-xs font-bold border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <span className="material-symbols-outlined text-sm">edit</span>
                <span>Edit Article</span>
              </button>
            </div>
            <div className="flex items-center gap-3 text-sm text-[#897561] dark:text-gray-400">
              <div className="flex items-center gap-2">
                <div
                  className="size-8 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden bg-cover bg-center"
                  style={{
                    backgroundImage:
                      'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAJct1--e76jwCiXgbnu9uhZqIij-GZ313SwwZFgZQMeoA9utiEXLbhX8_gCaKN5Vx5CDGt_WGbPyG4h7hB534g7f3T_QcTaqwzb0YWJMokAQHQAAZLZrOBZVoeG040QykrqbQv70GMyyvWd8SQKWEzbQggCY63Z2U_2UQ26ISFTi4HMZ77KCBXAmraEzr-gMd2wrkjLHusHky0WfNSU2XX9PDpZJ-qp1EpBPuXrpxccy-BzScdwe_13KMc00RJGSUsa9Q3Aso0XXSF")',
                  }}
                ></div>
                <span className="font-semibold text-[#181411] dark:text-gray-200">Jane Doe</span>
              </div>
              <span className="w-1 h-1 rounded-full bg-gray-400"></span>
              <span>October 24, 2023</span>
              <span className="w-1 h-1 rounded-full bg-gray-400"></span>
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-base">schedule</span> 4 min read
              </span>
            </div>
          </div>

          {/* Featured Image */}
          <div className="w-full rounded-xl overflow-hidden shadow-sm aspect-video bg-gray-100 relative group">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage:
                  'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCDnE5RLuIGqiGijfFLXYDcl3C9kkcfut-3-YjhJRIEr_mCM5_cvixWTCY3hCIyopswFamvK_YwWgK2kTruPAaTfwebyYbZPS7nBUrrlETf2unXvn_oI95KWGr3LwFhAO3NX9HDZBfBcfN4SSDWw1jfpbfBRGpvLjglOkf9ZdA2Q_t9jcuSR-Q72a4nMZmjGXL7muB-wJl2RWT624G4p4k0SyYPPvDNQhD9rZAPXHfj9dAd8FFN7kqkV65noJs1gB9X-gq6kOkPAsxk")',
              }}
            ></div>
          </div>

          {/* Article Content */}
          <article className="prose prose-lg dark:prose-invert max-w-none text-[#181411] dark:text-[#e2e2e2] leading-relaxed">
            <p className="mb-4">
              The annual Schweitzer Elementary Fun Run was a massive success this year, breaking all previous
              fundraising records. Students, parents, and teachers gathered on the track to show their school spirit
              and support the PTA&apos;s initiatives for the upcoming school year. The energy was electric as the mascot,
              Stripes the Tiger, led the warm-up exercises.
            </p>
            <p className="mb-4">
              &quot;I&apos;ve never seen such enthusiasm from the community,&quot; said Principal Skinner. &quot;Every lap run today
              translates directly into new books for the library and updated equipment for the playground. We are
              incredibly grateful.&quot;
            </p>
            <h2 className="text-2xl font-bold text-[#181411] dark:text-white mt-8 mb-4">Community Impact</h2>
            <p className="mb-4">
              Thanks to the generous pledges from family and friends, we surpassed our goal of $15,000, reaching a grand
              total of <strong>$18,450</strong>. These funds are already earmarked for several key projects:
            </p>
            <ul className="list-disc pl-5 mb-6 space-y-2 marker:text-primary">
              <li>New swing set installation</li>
              <li>Library technology upgrade</li>
              <li>Teacher appreciation grants</li>
              <li>After-school art program supplies</li>
            </ul>
            <blockquote className="border-l-4 border-primary pl-4 py-2 my-6 bg-primary/5 dark:bg-primary/10 italic text-[#5c4d41] dark:text-gray-300 rounded-r-lg">
              &quot;The Fun Run isn&apos;t just about money; it&apos;s about teaching our kids the value of fitness and community
              support.&quot; - Sarah Jenkins, PTA President
            </blockquote>
            <p>
              We want to extend a special thank you to the local businesses who supported water stations and provided
              snacks for the runners. Without your logistical support, this event would not have been possible.
            </p>
          </article>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mt-4 pt-6 border-t border-[#e6e0db] dark:border-gray-700">
            <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-sm font-medium rounded-full text-gray-600 dark:text-gray-300">
              #FunRun
            </span>
            <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-sm font-medium rounded-full text-gray-600 dark:text-gray-300">
              #Fundraising
            </span>
            <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-sm font-medium rounded-full text-gray-600 dark:text-gray-300">
              #Community
            </span>
          </div>
        </main>

        {/* Sidebar */}
        <aside className="lg:col-span-4 space-y-6">
          {/* Become a Donor CTA */}
          <div className="bg-primary rounded-xl p-5 text-white">
            <h4 className="font-bold text-lg mb-2">Become a Donor</h4>
            <p className="text-white/80 text-sm mb-4">
              Support Schweitzer Elementary and help our Wildcats roar!
            </p>
            <Link
              href="/donors"
              className="block w-full bg-white text-primary py-2 px-4 rounded-lg font-bold text-sm text-center hover:bg-gray-100 transition-colors"
            >
              How to Give
            </Link>
          </div>

          {/* Community Donors */}
          <div className="bg-white dark:bg-[#2a221a] rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-primary">volunteer_activism</span>
              <h4 className="font-bold text-[#181411] dark:text-white">Community Donors</h4>
            </div>
            <div className="flex flex-col gap-4">
              {communityDonors.map((donor, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gray-50 dark:bg-gray-800 flex items-center justify-center shrink-0 border border-gray-100 dark:border-gray-700">
                    <span className="material-symbols-outlined text-gray-400 text-lg">volunteer_activism</span>
                  </div>
                  <div>
                    <p className="font-medium text-[#181411] dark:text-white text-sm">{donor.name}</p>
                    <p className="text-gray-500 dark:text-gray-400 text-xs">{donor.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <Link
              href="/donors"
              className="block mt-4 text-center text-primary text-sm font-bold hover:underline"
            >
              View All Donors →
            </Link>
          </div>
        </aside>
      </div>

      {/* More News Section */}
      <section className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-[#181411] dark:text-white mb-6">More News</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {moreNews.map((article, index) => (
            <Link
              key={index}
              href={`/news/${index + 1}`}
              className="group flex flex-col bg-white dark:bg-[#2a221a] rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow"
            >
              <div
                className="w-full aspect-video bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                style={{
                  backgroundImage: `url("${article.image}")`,
                  backgroundColor: '#e5e5e5',
                }}
              ></div>
              <div className="p-4 flex flex-col gap-2">
                <span className="text-primary text-xs font-bold uppercase">{article.category}</span>
                <h4 className="text-[#181411] dark:text-white font-bold group-hover:text-primary transition-colors">
                  {article.title}
                </h4>
                <span className="text-gray-500 dark:text-gray-400 text-sm">{article.date}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}