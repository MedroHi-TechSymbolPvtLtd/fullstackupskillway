import React, { useState, useRef, useEffect } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import logo from '../assets/Images/logo (2).png';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // Desktop dropdown states
  const [isServicesDropdownOpen, setIsServicesDropdownOpen] = useState(false);
  const [isDiscoverDropdownOpen, setIsDiscoverDropdownOpen] = useState(false);
  // Mobile dropdown states (independent from desktop)
  const [isMobileServicesOpen, setIsMobileServicesOpen] = useState(false);
  const [isMobileDiscoverOpen, setIsMobileDiscoverOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    // Reset mobile dropdowns when closing menu
    if (isMenuOpen) {
      setIsMobileServicesOpen(false);
      setIsMobileDiscoverOpen(false);
    }
  };

  const navItems = [
    { name: 'Our Courses', href: '/courses' },
    { name: 'Our Services', href: '/corporate', hasDropdown: true, dropdownType: 'services' },
    { name: 'Discover', href: '/about', hasDropdown: true, dropdownType: 'discover' }
  ];

  const servicesItems = [
    { name: 'Coding for kids', href: '/coding-for-kids' },
    { name: 'College Training', href: '/college-training' },
    { name: 'Corporate Training', href: '/corporate' },
    { name: 'Study Abroad', href: '/study' }
  ];

  const discoverItems = [
    { name: 'Refer and Earn', href: '/refer-and-earn' },
    { name: 'Blog', href: '/blog' },
    { name: 'Ebook', href: '/ebook' },
    { name: 'About', href: '/about' }
  ];

  const servicesDropdownRef = useRef(null);
  const discoverDropdownRef = useRef(null);

  const navigate = useNavigate();

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (servicesDropdownRef.current && !servicesDropdownRef.current.contains(event.target)) {
        setIsServicesDropdownOpen(false);
      }
      if (discoverDropdownRef.current && !discoverDropdownRef.current.contains(event.target)) {
        setIsDiscoverDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav className="bg-transparent absolute top-0 left-0 w-full z-[9999] lg:-mt-1 lg:-ml-20" style={{ position: 'absolute', zIndex: 9999 }}>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20 md:h-24 relative">
          {/* Logo */}
      <div className="flex items-center">
  <Link to="/" className="block">
    <img
      src={logo}
      alt="Upskillway Logo"
      className="
        w-32 h-auto mt-0
        sm:w-[350px] sm:h-40 sm:mt-[-15px]
        md:w-[400px] md:h-44 md:mt-[-17px]
        lg:w-[309px] lg:h-48 lg:mt-[-19px]
        object-contain
      "
    />
  </Link>
</div>


          {/* Desktop Navigation */}
          <div className="hidden lg:block">
            <div className="rounded-lg px-6 py-2 flex items-center space-x-8 shadow-sm">
              {navItems.map((item) => {
                if (item.hasDropdown) {
                  const isOpen = item.dropdownType === 'services' ? isServicesDropdownOpen : isDiscoverDropdownOpen;
                  const dropdownItems = item.dropdownType === 'services' ? servicesItems : discoverItems;
                  const setIsOpen = item.dropdownType === 'services' ? setIsServicesDropdownOpen : setIsDiscoverDropdownOpen;
                  const dropdownRef = item.dropdownType === 'services' ? servicesDropdownRef : discoverDropdownRef;

                  return (
                    <div key={item.name} className="relative" ref={dropdownRef}>
                      <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="text-gray-800 hover:text-gray-600 text-sm font-medium transition-colors duration-200 flex items-center space-x-1"
                      >
                        <span>{item.name}</span>
                        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                      </button>

                      {/* Dropdown Menu */}
                      {isOpen && (
                        <div className="absolute top-full left-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                          <div className="py-2">
                            {dropdownItems.map((dropdownItem) => (
                              <Link
                                key={dropdownItem.name}
                                to={dropdownItem.href}
                                onClick={() => setIsOpen(false)}
                                className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-50 transition-colors duration-200"
                              >
                                {dropdownItem.name}
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                }

                return item.href.startsWith("/") ? (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="text-gray-800 hover:text-gray-600 text-sm font-medium transition-colors duration-200"
                  >
                    {item.name}
                  </Link>
                ) : (
                  <button
                    key={item.name}
                    href={item.href}
                    className="text-gray-800 hover:text-gray-600 text-sm font-medium transition-colors duration-200"
                  >
                    {item.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Register Button */}
          <div className="hidden lg:block">
            <button
              onClick={() => navigate("/contact")}
              className="bg-transparent text-black px-4 xl:px-6 py-1.5 xl:py-2 rounded-full text-xs xl:text-sm font-medium hover:bg-gray-400 hover:border-b-black transition-colors duration-200 flex items-center space-x-1 xl:space-x-2"
            >
              <span>Contact Us</span>
              <div className="w-4 h-4 xl:w-5 xl:h-5 bg-orange-500 rounded-full flex items-center justify-center">
                <svg
                  className="w-2.5 h-2.5 xl:w-3 xl:h-3 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center w-12 h-12 p-2 rounded-lg text-gray-900 hover:text-orange-500 transition-colors duration-200 bg-white shadow-lg border-2 border-gray-300 hover:border-orange-500 relative z-[10000]"
              aria-label="Toggle menu"
              type="button"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" strokeWidth={2.5} />
              ) : (
                <Menu className="h-6 w-6" strokeWidth={2.5} />
              )}
            </button>
          </div>
        </div>

{/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <>
            {/* Backdrop overlay */}
            <div 
              className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-[9998]"
              onClick={() => {
                setIsMenuOpen(false);
                setIsMobileServicesOpen(false);
                setIsMobileDiscoverOpen(false);
              }}
            />
            
            {/* Menu content */}
            <div className="lg:hidden fixed left-0 right-0 top-16 sm:top-20 md:top-24 mx-4 z-[9999]">
              <div 
                className="px-4 pt-4 pb-4 space-y-2 bg-white rounded-lg shadow-2xl border-2 border-gray-300 max-h-[calc(100vh-6rem)] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                {navItems.map((item) => {
                  if (item.hasDropdown) {
                    // Use mobile-specific dropdown states
                    const isOpen = item.dropdownType === 'services' ? isMobileServicesOpen : isMobileDiscoverOpen;
                    const dropdownItems = item.dropdownType === 'services' ? servicesItems : discoverItems;
                    const setIsOpen = item.dropdownType === 'services' ? setIsMobileServicesOpen : setIsMobileDiscoverOpen;

                    return (
                      <div key={item.name} className="border-b border-gray-100 last:border-0 pb-2">
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setIsOpen(!isOpen);
                          }}
                          className="w-full text-left text-gray-800 hover:text-orange-500 px-3 py-2.5 text-base font-medium transition-colors duration-200 flex items-center justify-between rounded-md hover:bg-gray-50 active:bg-gray-100"
                          type="button"
                        >
                          <span className="flex-1">{item.name}</span>
                          <ChevronDown 
                            className={`w-5 h-5 transition-transform duration-200 flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`}
                            strokeWidth={2}
                          />
                        </button>
                        {isOpen && (
                          <div className="pl-4 mt-1 space-y-1 bg-gray-50 rounded-md py-2">
                            {dropdownItems.map((dropdownItem) => (
                              <Link
                                key={dropdownItem.name}
                                to={dropdownItem.href}
                                onClick={() => {
                                  setIsMenuOpen(false);
                                  setIsMobileServicesOpen(false);
                                  setIsMobileDiscoverOpen(false);
                                }}
                                className="block text-gray-600 hover:text-orange-500 hover:bg-orange-50 px-3 py-2 text-sm font-normal transition-colors duration-200 rounded-md"
                              >
                                {dropdownItem.name}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  }

                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => {
                        setIsMenuOpen(false);
                        setIsMobileServicesOpen(false);
                        setIsMobileDiscoverOpen(false);
                      }}
                      className="text-gray-800 hover:text-orange-500 hover:bg-gray-50 block px-3 py-2.5 text-base font-medium transition-colors duration-200 rounded-md border-b border-gray-100 last:border-0"
                    >
                      {item.name}
                    </Link>
                  );
                })}

                {/* Mobile Contact Button */}
                <div className="pt-3 border-t border-gray-100">
                  <button
                    onClick={() => {
                      navigate("/contact");
                      setIsMenuOpen(false);
                      setIsMobileServicesOpen(false);
                      setIsMobileDiscoverOpen(false);
                    }}
                    className="w-full bg-orange-500 text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-orange-600 transition-colors duration-200 flex items-center justify-center space-x-2 shadow-md"
                  >
                    <span>Contact Us</span>
                    <div className="w-5 h-5 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
