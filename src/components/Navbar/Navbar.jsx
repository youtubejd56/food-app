import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';

const Navbar = () => {
  const { cart, location, setLocation, setIsCartOpen, setCurrentPage, token, setToken, currentOrderId } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [locationDropdownOpen, setLocationDropdownOpen] = useState(false);
  const [detectingLocation, setDetectingLocation] = useState(false);
  const [locationSearch, setLocationSearch] = useState('');
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setLocationDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLocationSelect = (loc) => {
    setLocation(loc);
    setLocationDropdownOpen(false);
    setLocationSearch('');
  };

  const handleDetectLocation = () => {
    setDetectingLocation(true);
    
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      setDetectingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        // In a real app, we would now call Google Maps API to get the City name from these coords
        // For now, we will display the detected Coordinates to show the "Real" logic
        handleLocationSelect(`GPS: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
        setDetectingLocation(false);
      },
      (error) => {
        console.error("Error detecting location:", error);
        alert("Unable to retrieve your location. Please select manually.");
        setDetectingLocation(false);
      }
    );
  };

  const popularLocations = ['Mumbai, Maharashtra', 'Delhi, NCR', 'Bengaluru, Karnataka', 'Hyderabad, Telangana', 'Chennai, Tamil Nadu', 'Kochi, Kerala', 'Thiruvananthapuram, Kerala', 'Kozhikode, Kerala', 'Pune, Maharashtra', 'Kolkata, West Bengal', 'Ahmedabad, Gujarat', 'Jaipur, Rajasthan'];
  const filteredLocations = popularLocations.filter(l => l.toLowerCase().includes(locationSearch.toLowerCase()));

  const navLinks = [
    { label: 'Home', action: () => setCurrentPage('home') },
    ...(currentOrderId ? [{ label: 'Track Order', action: () => setCurrentPage('track-order') }] : []),
    { label: 'Help', action: () => setCurrentPage('help') },
  ];


  return (
    <>
      <nav className="sticky top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">

          {/* ── Left: Logo + Location ── */}
          <div className="flex items-center gap-6">
            {/* Logo */}
            <button 
              onClick={() => setCurrentPage('home')}
              className="flex items-center gap-1.5 group"
            >
              <span className="w-7 h-7 bg-orange-500 rounded-lg flex items-center justify-center text-white text-xs font-bold">
                G
              </span>
              <span className="text-base font-semibold text-gray-900 tracking-tight group-hover:text-orange-500 transition-colors">
                GoodDash
              </span>
            </button>

            {/* Divider */}
            <div className="hidden md:block w-px h-5 bg-gray-200" />

            {/* Location picker */}
            <div className="relative hidden md:block" ref={dropdownRef}>
              <button 
                onClick={() => setLocationDropdownOpen(!locationDropdownOpen)}
                className="flex items-center gap-1.5 group"
              >
                {/* Pin icon */}
                <svg className="w-3.5 h-3.5 text-orange-500 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                </svg>
                <span className="text-sm font-medium text-gray-800 border-b border-dashed border-orange-400 pb-px group-hover:border-orange-500 transition-colors truncate max-w-[150px]">
                  {location}
                </span>
                <svg className={`w-3 h-3 text-gray-400 transition-transform duration-200 ${locationDropdownOpen ? 'rotate-180' : ''} group-hover:text-orange-500`} viewBox="0 0 24 24" fill="currentColor">
                  <path d="M7 10l5 5 5-5z" />
                </svg>
              </button>

              {/* Location Dropdown Modal */}
              {locationDropdownOpen && (
                <div className="absolute top-full left-0 mt-3 w-[360px] bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50 transform origin-top transition-all">
                  <div className="p-4 border-b border-gray-100 bg-gray-50/50">
                    <div className="relative">
                      <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                      </svg>
                      <input
                        type="text"
                        placeholder="Search for your city..."
                        className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all shadow-sm"
                        value={locationSearch}
                        onChange={(e) => setLocationSearch(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="max-h-[320px] overflow-y-auto overscroll-contain">
                    <button 
                      onClick={handleDetectLocation}
                      disabled={detectingLocation}
                      className="w-full flex items-center gap-3 px-5 py-4 border-b border-gray-50 hover:bg-orange-50/50 transition-colors text-left group"
                    >
                      <svg className={`w-5 h-5 text-orange-500 ${detectingLocation ? 'animate-spin' : 'group-hover:scale-110 transition-transform'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                      <div>
                        <span className="block text-sm font-semibold text-orange-500">
                          {detectingLocation ? 'Detecting your location...' : 'Detect current location'}
                        </span>
                        <span className="block text-xs text-gray-500 mt-0.5">Using GPS</span>
                      </div>
                    </button>

                    <div className="px-5 py-3">
                      <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Popular Cities</span>
                    </div>

                    <div className="pb-2">
                      {filteredLocations.length > 0 ? (
                        filteredLocations.map((loc) => (
                          <button
                            key={loc}
                            onClick={() => handleLocationSelect(loc)}
                            className="w-full flex items-center gap-3 px-5 py-2.5 hover:bg-gray-50 transition-colors text-left"
                          >
                            <svg className="w-4 h-4 text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span className="text-sm font-medium text-gray-700">{loc}</span>
                          </button>
                        ))
                      ) : (
                        <div className="px-5 py-4 text-center text-sm text-gray-500">
                          No cities found for "{locationSearch}"
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ── Right: Links + Cart ── */}
          <div className="flex items-center gap-1">
            {/* Desktop nav links */}
            <div className="hidden lg:flex items-center gap-2 mr-4">
              {navLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={link.action}
                  className="px-4 py-2 text-sm font-semibold text-gray-500 hover:text-orange-500 hover:bg-orange-50 rounded-xl transition-all duration-200"
                >
                  {link.label}
                </button>
              ))}
            </div>
              {token ? (
                <>
                  <button
                    onClick={() => setCurrentPage('profile')}
                    className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-900 flex items-center gap-2 group transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold group-hover:bg-orange-500 group-hover:text-white transition-all">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                    </div>
                    Profile
                  </button>
                  <button
                    onClick={() => setToken(null)}
                    className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-red-500 transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setCurrentPage('login')}
                    className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => setCurrentPage('register')}
                    className="px-4 py-2 text-sm font-medium text-orange-500 hover:text-orange-600 font-bold transition-colors"
                  >
                    Register
                  </button>
                </>
              )}
            </div>

            {/* Divider */}
            <div className="hidden lg:block w-px h-5 bg-gray-200 mx-2" />

            {/* Cart button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2 bg-orange-500 hover:bg-orange-600 active:scale-95 text-white text-sm font-medium px-4 py-2 rounded-xl transition-all duration-150"
            >
              {/* Cart icon */}
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 01-8 0" />
              </svg>
              Cart
              {/* Badge */}
              {cart.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-white text-orange-500 text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-orange-500">
                  {cart.length}
                </span>
              )}
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden ml-1 p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>

        {/* ── Mobile dropdown menu ── */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-100 bg-white px-4 py-3 space-y-1">
            {/* Mobile location */}
            <button className="flex items-center gap-2 w-full px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-colors">
              <svg className="w-4 h-4 text-orange-500" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
              </svg>
              <span className="text-sm font-medium text-gray-700">{location}</span>
              <svg className="w-3.5 h-3.5 text-gray-400 ml-auto" viewBox="0 0 24 24" fill="currentColor">
                <path d="M7 10l5 5 5-5z" />
              </svg>
            </button>

            <div className="h-px bg-gray-100 my-1" />

            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => {
                  link.action();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-bold text-gray-600 hover:bg-gray-50 hover:text-orange-500 transition-colors text-left"
              >
                {link.label}
              </button>
            ))}

            <div className="h-px bg-gray-100 my-1" />

            {!token && (
              <>
                <button
                  onClick={() => {
                    setCurrentPage('login');
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors text-left"
                >
                  Login
                </button>
                <button
                  onClick={() => {
                    setCurrentPage('register');
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-orange-600 hover:bg-gray-50 transition-colors text-left"
                >
                  Register
                </button>
              </>
            )}
            {token && (
              <button
                onClick={() => {
                  setCurrentPage('profile');
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors text-left"
              >
                Profile
              </button>
            )}
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;