import Image from 'next/image';
import Button from '@/components/Button';
import Card from '@/components/Card';

export default function Home() {
  return (
    <div className="layout-container flex flex-col w-full mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8 py-6 gap-8">
      <section className="w-full">
        <div className="@container">
          <div className="flex flex-col-reverse gap-6 py-4 lg:py-10 @[864px]:flex-row @[864px]:items-center">
            <div className="flex flex-col gap-6 @[480px]:min-w-[400px] @[480px]:gap-8 flex-1">
              <div className="flex flex-col gap-4 text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary w-fit">
                  <span className="material-symbols-outlined text-sm">school</span>
                  <span className="text-xs font-bold uppercase tracking-wide">Wildcat Pride</span>
                </div>
                <h1 className="text-[#181411] dark:text-white text-4xl font-black leading-tight tracking-[-0.033em] @[480px]:text-5xl lg:text-6xl">
                  Welcome to the <span className="text-primary">Wildcat's Den</span>
                </h1>
                <h2 className="text-[#181411]/80 dark:text-gray-300 text-base font-normal leading-relaxed max-w-xl">
                  Supporting every child, every day. Join the Schweitzer Elementary PTA to make a tangible difference in our classrooms and community.
                </h2>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="large">Join the PTA</Button>
                <Button size="large" variant="secondary">
                  View Calendar
                </Button>
              </div>
            </div>
            <div className="w-full flex-1 aspect-[4/3] rounded-xl overflow-hidden shadow-2xl bg-gray-200 dark:bg-gray-800 relative group">
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{
                  backgroundImage:
                    'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAapI-GMZA_9rxkQISpwd3j2o0gWezGfJE-sl2cpM3HadqCSZ05h4xDdHlGl_II7d3x4U6RWHMUSZgzLoB4fdF0adeDrbAGGhibYL12SPB0xhA0tGlzizThO8UCkXdSD7Tr1i0P1Fi_-ZUcTKEddfSh_2aqmBpnoyO2s60TSygJccD_Aslm2L6XaurJrgMnEVzogsPE2L4uCuOI88akRwDWy0hZPoc3uyyUm6Ll5pSnfCLw59jUhehXF0iwiZtl51ScmEAJuR38rsE5")',
                }}
              ></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              <div className="absolute bottom-6 left-6 text-white font-bold text-xl drop-shadow-md flex items-center gap-2">
                <span className="material-symbols-outlined">campaign</span> Go Wildcats!
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
        <a
          className="flex flex-col items-center justify-center gap-3 p-6 bg-white dark:bg-[#2a221a] rounded-xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all border border-gray-100 dark:border-gray-800 group"
          href="#"
        >
          <div className="size-12 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
            <span className="material-symbols-outlined">restaurant_menu</span>
          </div>
          <span className="font-bold text-sm text-center">Lunch Menus</span>
        </a>
        <a
          className="flex flex-col items-center justify-center gap-3 p-6 bg-white dark:bg-[#2a221a] rounded-xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all border border-gray-100 dark:border-gray-800 group"
          href="#"
        >
          <div className="size-12 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 flex items-center justify-center group-hover:bg-green-600 group-hover:text-white transition-colors">
            <span className="material-symbols-outlined">calendar_month</span>
          </div>
          <span className="font-bold text-sm text-center">School Calendar</span>
        </a>
        <a
          className="flex flex-col items-center justify-center gap-3 p-6 bg-white dark:bg-[#2a221a] rounded-xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all border border-gray-100 dark:border-gray-800 group"
          href="#"
        >
          <div className="size-12 rounded-full bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
            <span className="material-symbols-outlined">checkroom</span>
          </div>
          <span className="font-bold text-sm text-center">Spirit Wear</span>
        </a>
        <a
          className="flex flex-col items-center justify-center gap-3 p-6 bg-white dark:bg-[#2a221a] rounded-xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all border border-gray-100 dark:border-gray-800 group"
          href="#"
        >
          <div className="size-12 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-colors">
            <span className="material-symbols-outlined">volunteer_activism</span>
          </div>
          <span className="font-bold text-sm text-center">Volunteer</span>
        </a>
      </section>
      <section className="flex flex-col gap-6 pt-8">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-3">
            <div className="h-8 w-1 bg-primary rounded-full"></div>
            <h2 className="text-[#181411] dark:text-white text-2xl font-bold leading-tight tracking-tight">
              The Wildcat Roar
            </h2>
          </div>
          <a className="text-primary text-sm font-bold hover:underline flex items-center gap-1" href="#">
            View All News <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </a>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <div
              className="w-full aspect-video bg-cover bg-center"
              style={{
                backgroundImage:
                  'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAxunL38NzGZJWpfzzWWOGtg1muNBsY8JWSR1fUNIDPauoUmt-GkNtb3g5F4CfDnuIzdKJ45H7roYWRZhz6NvO_hkvoe2RJ99zsajE7p_0UY6be8mjxSdbA8EIkTguduTrxjKasqPZmUQYbD_gltIIseo9xYbwPs7JMeTgo-3Az3e9y6uzK6CFU4P_tIlaq89GgHKcXbVz088YeyWKNP5XGURtZk9C-xyN2IoJnEsVVyv7cwSa5mcAszku2XJYLfBu6xVEO6s9dT2SW")',
              }}
            >
              <div className="m-3 px-3 py-1 bg-white/90 dark:bg-black/80 backdrop-blur-sm rounded-lg w-fit text-xs font-bold uppercase tracking-wider text-[#181411] dark:text-white shadow-sm">
                Upcoming Event
              </div>
            </div>
            <div className="flex flex-col p-5 gap-3 flex-1">
              <div className="text-xs font-medium text-gray-500 dark:text-gray-400 flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">event</span> Oct 24, 2023
              </div>
              <h3 className="text-[#181411] dark:text-white text-lg font-bold leading-tight">
                Fall Festival Tickets Now Available
              </h3>
              <p className="text-[#181411]/70 dark:text-gray-300 text-sm leading-normal line-clamp-3">
                Purchase your tickets early for a discount! Fun, games, and food for the whole family await at our
                biggest fundraiser of the year.
              </p>
              <div className="mt-auto pt-2">
                <button className="text-primary font-bold text-sm hover:underline">Read More</button>
              </div>
            </div>
          </Card>
          <Card>
            <div
              className="w-full aspect-video bg-cover bg-center"
              style={{
                backgroundImage:
                  'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDiZAWt7kYaGkFmHmUtLf_GzHCL_-g9ig4pbMrpGKJkcRbRqclXxRJ6J8Bz6PsmAdApCp5ZGRLl-lwY9AbGMXCqfnWHPJC6jviWg5rzZ5j1PTg8043eWONWw5XZK3GEt8NI4c6ZdwNw0fT_6sksa4ldGgF5mSI5FEHbSXGCSO6OakjRuvfdG6DxvPsT1ZrXzEpbVM3aMqAmi-MHQ4vHZe8AYpULWSAPoINwwLWFFwCRLmU0sSb-7PuLNQe38Nfdpg3WI1a_tjcEHYsS")',
              }}
            >
              <div className="m-3 px-3 py-1 bg-white/90 dark:bg-black/80 backdrop-blur-sm rounded-lg w-fit text-xs font-bold uppercase tracking-wider text-[#181411] dark:text-white shadow-sm">
                Update
              </div>
            </div>
            <div className="flex flex-col p-5 gap-3 flex-1">
              <div className="text-xs font-medium text-gray-500 dark:text-gray-400 flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">schedule</span> 2 days ago
              </div>
              <h3 className="text-[#181411] dark:text-white text-lg font-bold leading-tight">
                October PTA Meeting Minutes
              </h3>
              <p className="text-[#181411]/70 dark:text-gray-300 text-sm leading-normal line-clamp-3">
                Missed the meeting? Catch up on the budget approval, new playground plans, and volunteer opportunities
                for the winter season.
              </p>
              <div className="mt-auto pt-2">
                <button className="text-primary font-bold text-sm hover:underline">Download PDF</button>
              </div>
            </div>
          </Card>
          <Card>
            <div
              className="w-full aspect-video bg-cover bg-center"
              style={{
                backgroundImage:
                  'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAAOl4-Q4-oW13XGRrcUIe8A3vcQVDT0LBf6UpEMJyH52ZoGCYx5TGnmLZ8B2627mBxw8143IoaOWSashc9J1n_7dbnuCK4LNxM30sIJNSMUHPm--7Qq7IgIUYv3jxBY6n7Duq0o7ThQoY4j5rSI5wasDPoR0JAmQIVMos-hVHgm9utStdIqDRT1TABHcwwct8ENDPCz2nBVwTK970C3INQ9P5UloDA0aA903iRYYrDohPnpt2u_uqzrQCPpr9b3Kow8h8XH951uJPc")',
              }}
            >
              <div className="m-3 px-3 py-1 bg-white/90 dark:bg-black/80 backdrop-blur-sm rounded-lg w-fit text-xs font-bold uppercase tracking-wider text-[#181411] dark:text-white shadow-sm">
                Program
              </div>
            </div>
            <div className="flex flex-col p-5 gap-3 flex-1">
              <div className="text-xs font-medium text-gray-500 dark:text-gray-400 flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">campaign</span> Ongoing
              </div>
              <h3 className="text-[#181411] dark:text-white text-lg font-bold leading-tight">
                Book Fair Volunteers Needed
              </h3>
              <p className="text-[#181411]/70 dark:text-gray-300 text-sm leading-normal line-clamp-3">
                We need help setting up and running the Scholastic Book Fair next week. Sign up for a 1-hour slot!
              </p>
              <div className="mt-auto pt-2">
                <button className="text-primary font-bold text-sm hover:underline">Sign Up Now</button>
              </div>
            </div>
          </Card>
        </div>
      </section>
      <section className="mt-8 mb-12">
        <div className="rounded-2xl bg-[#181411] dark:bg-[#000] p-8 md:p-12 text-center relative overflow-hidden">
          <div
            className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(#f27f0d 1px, transparent 1px)',
              backgroundSize: '20px 20px',
            }}
          ></div>
          <div className="relative z-10 flex flex-col items-center gap-8">
            <div className="flex flex-col gap-2">
              <div className="inline-flex mx-auto items-center gap-2 px-3 py-1 rounded-full bg-primary/20 text-primary border border-primary/20 w-fit mb-2">
                <span className="material-symbols-outlined text-sm">favorite</span>
                <span className="text-xs font-bold uppercase tracking-wide">Community Support</span>
              </div>
              <h2 className="text-white text-3xl font-bold leading-tight tracking-tight">
                Thank You to Our Platinum Sponsors
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Our local business partners help make our programs possible. Please support them!
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-4xl mx-auto">
              <div className="bg-white rounded-xl p-6 flex items-center justify-center h-24 hover:scale-105 transition-transform cursor-pointer shadow-lg">
                <div
                  className="w-full h-full bg-contain bg-center bg-no-repeat opacity-80 hover:opacity-100 transition-opacity"
                  style={{
                    backgroundImage:
                      'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAKkoYodxRo1zWsoc9q4X-QL-dTUxhxacyIXPrrNKdCEjpYcofnVsg4GDjOQYIsZSTZL-rPFB2pK-wAat64KfCULAoaXl90zfI5CT71eIJhQ9a6fN7HRibRwsX1IyEakL6Y9FVBgJM9YVmdc6S2veB89vo59wHT3F7v8sGFAPfYG8RXkZXqZHrZWpd8-9DENQ3a0Xh0lGpjFmcXaWq9ZZtyb1dNJHQh19M7GOC5wupSc3Ji6iX61HiKE8QyDdLhmka4v_Vg_FH1LIWs")',
                  }}
                ></div>
              </div>
              <div className="bg-white rounded-xl p-6 flex items-center justify-center h-24 hover:scale-105 transition-transform cursor-pointer shadow-lg">
                <div
                  className="w-full h-full bg-contain bg-center bg-no-repeat opacity-80 hover:opacity-100 transition-opacity"
                  style={{
                    backgroundImage:
                      'url("https://lh3.googleusercontent.com/aida-public/AB6AXuA23SzNwPKGkePWOburiYEFSvO7m3NZsIiyS8s7WY9PXQ2Pwb6AvdgIOTMOpyhnnZ_PQ2MRvNYoBt32sCNlNCblKh2EGUOGyQ6vnhp_zL-IHg3yB_l9ia3ONZA2ByDYDG0NHgfYulxm684dyifqQYe62A4sQrqDxz6xgPakdg9iwchDYK6uV5tefZAuSMWhiVBSK0TzuNyehgokbfFrikopMbvlYYGLD_tzLUKQQdUcGAKyef2NlIqdCtLTryIqaWHmC142nYHwCOOb")',
                  }}
                ></div>
              </div>
              <div className="bg-white rounded-xl p-6 flex items-center justify-center h-24 hover:scale-105 transition-transform cursor-pointer shadow-lg">
                <div
                  className="w-full h-full bg-contain bg-center bg-no-repeat opacity-80 hover:opacity-100 transition-opacity"
                  style={{
                    backgroundImage:
                      'url("https://lh3.googleusercontent.com/aida-public/AB6AXuC92aE4C2chjMzl7_3xNLJ-7N4BMSTrkjYZM5GfO6qxB5HPJrJymZ28Fz5WQVAcZV5FUDqsxgC9LLa8cstrPigJ8_mjmrInPJtG-pkmf0bAGGKVHBGe4artqw4KTpL-KTGn2fLPQ8_nGhl2WHyXxRqdGtSh8Vlx6n3oNlZ2BguW2FgZtZfnrGqyXxOBUE4x98oMm8iUfVEf1aX-Gh3CH1z-Bb38PrByhypBlvdXhXYGq33Kc6_hMfaJCw7WEmeOLLUKYJtpwDcSoPSc")',
                  }}
                ></div>
              </div>
              <div className="bg-white rounded-xl p-6 flex items-center justify-center h-24 hover:scale-105 transition-transform cursor-pointer shadow-lg">
                <div
                  className="w-full h-full bg-contain bg-center bg-no-repeat opacity-80 hover:opacity-100 transition-opacity"
                  style={{
                    backgroundImage:
                      'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAN6aBYn9udLoOa6iamCF4QMZTygMXIzut807BsZ6gNjuaD27RvyBTlHzXEVSuHpBoO_sWL63nn4fIGuBB0956EVZoBtY4UMawDoR1bUvSLY3BpY4bLRCRFReOHBbSPBMqkiYRXxSqemVDAFehkquK2zxooJ5PYYqEWCGO54P_UZYcWn1kHRgxbqnJx8NHG3ibXl0Ns5wkf9c0jHT1f3mvG_LEz4Rg92dhlKfsZfr_YrfYDuqaZSIRb8X41en9_otM5o7ZacAte-T3Y")',
                  }}
                ></div>
              </div>
            </div>
            <button className="mt-4 text-white/80 hover:text-white underline text-sm">Become a Sponsor</button>
          </div>
        </div>
      </section>
    </div>
  );
}
