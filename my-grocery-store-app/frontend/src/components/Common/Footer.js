import React from 'react';

const Footer = () => (
  <footer className="bg-slate-800 text-white">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* About Section */}
        <div>
          <h3 className="font-bold text-lg mb-4">Team-18 Store</h3>
          <p className="text-slate-400 text-sm">
            Your one-stop shop for the freshest groceries, delivered with care right to your doorstep. Quality and convenience, guaranteed.
          </p>
        </div>

        {/* Quick Links Section */}
        <div>
          <h3 className="font-bold text-lg mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><button className="text-slate-400 hover:text-white underline">Home</button></li>
            <li><button className="text-slate-400 hover:text-white underline">About Us</button></li>
            <li><button className="text-slate-400 hover:text-white underline">Contact Us</button></li>
            <li><button className="text-slate-400 hover:text-white underline">FAQs</button></li>
          </ul>
        </div>

        {/* Contact Info Section */}
        <div>
          <h3 className="font-bold text-lg mb-4">Contact Us</h3>
          <ul className="space-y-2 text-sm text-slate-400">
            <li className="flex items-center space-x-2"><span>Email:</span> <a href="mailto:support@team18.store" className="hover:text-white">support@team18.store</a></li>
            <li className="flex items-center space-x-2"><span>Phone:</span> <span>+91 12345 67890</span></li>
            <li className="flex items-center space-x-2"><span>Address:</span> <span>123 Grocery Lane, Surat</span></li>
          </ul>
        </div>

        {/* Follow Us Section */}
        <div>
          <h3 className="font-bold text-lg mb-4">Follow Us</h3>
          <div className="flex space-x-4">
            <button className="text-slate-400 hover:text-white" aria-label="Facebook">
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" /></svg>
            </button>
            <a href="https://www.instagram.com/tirth6681/" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white" aria-label="Instagram">
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.024.06 1.378.06 3.808s-.012 2.784-.06 3.808c-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.024.048-1.378.06-3.808.06s-2.784-.012-3.808-.06c-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.048-1.024-.06-1.378-.06-3.808s.012-2.784.06-3.808c.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 016.08 2.525c.636-.247 1.363-.416 2.427-.465C9.53 2.013 9.884 2 12.315 2zM12 7a5 5 0 100 10 5 5 0 000-10zm0 8a3 3 0 110-6 3 3 0 010 6zm5.75-9.25a1.25 1.25 0 100-2.5 1.25 1.25 0 000 2.5z" clipRule="evenodd" /></svg>
            </a>
            <button className="text-slate-400 hover:text-white" aria-label="Twitter">
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </button>
          </div>
        </div>
      </div>
      <div className="mt-8 pt-8 border-t border-slate-700 text-center text-slate-500 text-sm">
        &copy; {new Date().getFullYear()} Team-18 Store. All Rights Reserved.
      </div>
    </div>
  </footer>
);

export default Footer;