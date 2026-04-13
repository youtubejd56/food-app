import React from 'react';
import { useApp } from '../../context/AppContext';

const Footer = () => {
  const { setCurrentPage } = useApp();

  return (
    <footer className="bg-gray-100 py-16 px-4 md:px-10 border-t border-border-light">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <span className="text-3xl">🍲</span>
              <span className="font-heading text-xl font-bold text-brand-orange uppercase tracking-tight">FoodDash</span>
            </div>
            <p className="text-text-muted text-sm leading-relaxed">
              Serving premium flavors directly to your doorstep. The best restaurants in your city, delivered in minutes.
            </p>
          </div>

          {/* Company */}
          <div className="space-y-6">
            <h4 className="font-bold text-lg">Company</h4>
            <ul className="space-y-3 text-text-muted text-sm">
              <li onClick={() => setCurrentPage('home')} className="hover:text-brand-orange cursor-pointer transition-colors">About Us</li>
              <li className="hover:text-brand-orange cursor-pointer transition-colors">Team</li>
              <li className="hover:text-brand-orange cursor-pointer transition-colors">Careers</li>
              <li className="hover:text-brand-orange cursor-pointer transition-colors">Blog</li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-6">
            <h4 className="font-bold text-lg">Contact Us</h4>
            <ul className="space-y-3 text-text-muted text-sm">
              <li onClick={() => setCurrentPage('help')} className="hover:text-brand-orange cursor-pointer transition-colors">Help & Support</li>
              <li className="hover:text-brand-orange cursor-pointer transition-colors">Partner with us</li>
              <li className="hover:text-brand-orange cursor-pointer transition-colors">Ride with us</li>
            </ul>
          </div>

          Apps
          {/* <div className="space-y-6">
            <h4 className="font-bold text-lg">Download Our App</h4>
            <div className="flex flex-col gap-4">
              <button className="bg-black text-white px-6 py-2.5 rounded-lg flex items-center gap-2 hover:opacity-80 transition-opacity">
                <span className="text-2xl">🍎</span>
                <span className="text-left leading-none">
                  <span className="text-[10px] block font-light">Download on the</span>
                  <span className="text-sm font-bold">App Store</span>
                </span>
              </button>
              <button className="bg-black text-white px-6 py-2.5 rounded-lg flex items-center gap-2 hover:opacity-80 transition-opacity">
                <span className="text-2xl">🤖</span>
                <span className="text-left leading-none">
                  <span className="text-[10px] block font-light">Get it on</span>
                  <span className="text-sm font-bold">Google Play</span>
                </span>
              </button>
            </div>
          </div> */}
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-gray-200 flex flex-col md:flex-row-reverse justify-between items-center gap-6">
          <div className="flex gap-6 text-2xl grayscale hover:grayscale-0 transition-all cursor-pointer">
            <span>📱</span> <span>📸</span> <span>🐦</span> <span>🔗</span>
          </div>
          <p className="text-text-muted text-xs">
            © 2026 GoodDash Pvt. Ltd. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
