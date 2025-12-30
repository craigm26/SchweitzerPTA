const Footer = () => {
  return (
    <footer className="bg-background-dark text-white border-t border-primary/30 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="size-8 rounded-full bg-primary flex items-center justify-center text-white">
                <span className="material-symbols-outlined text-xl">pets</span>
              </div>
              <h3 className="text-xl font-bold">Schweitzer Elementary PTA</h3>
            </div>
            <p className="text-gray-400 max-w-sm mb-6">
              Dedicated to promoting the welfare of children and youth in home, school, community, and place of worship.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors">
                <span className="sr-only">Facebook</span>
                <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"></path></svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors">
                <span className="sr-only">Twitter</span>
                <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.84 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"></path></svg>
              </a>
            </div>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-white">Quick Links</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-primary transition-colors">About the PTA</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Membership</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Volunteer Opportunities</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">School Calendar</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-white">Contact Us</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="flex items-start gap-2">
                <span className="material-symbols-outlined text-primary text-lg">location_on</span>
                <span>1234 School Lane<br />Springfield, IL 62704</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-lg">mail</span>
                <span>pta@schweitzerelem.edu</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-xs text-gray-500">
          © 2023 Schweitzer Elementary PTA. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
