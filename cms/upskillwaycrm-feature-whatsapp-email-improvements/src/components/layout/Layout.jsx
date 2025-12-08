import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';

const Layout = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const userData = localStorage.getItem('user');

    if (!isLoggedIn || isLoggedIn !== 'true') {
      navigate('/login', { replace: true });
      return;
    }

    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, [navigate]);

  return (
    <div className={`app-container ${theme}`}>
      <header className="app-header">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="logo">
            <h1 className="text-xl font-bold">UPskillway CMS</h1>
          </div>
          <div className="user-info">
            {user && (
              <span className="text-sm">
                Welcome, {user.name || user.email}
              </span>
            )}
          </div>
        </div>
      </header>

      <div className="app-content flex">
        <aside className="sidebar w-64 bg-gray-100 min-h-screen p-4">
          <nav>
            <ul className="space-y-2">
              <li>
                <a href="/dashboard" className="block p-2 hover:bg-gray-200 rounded">
                  Dashboard
                </a>
              </li>
              <li>
                <div className="p-2 font-medium">Content</div>
                <ul className="pl-4 space-y-1">
                  <li>
                    <a href="/content/blogs" className="block p-2 hover:bg-gray-200 rounded">
                      Blogs
                    </a>
                  </li>
                  <li>
                    <a href="/content/videos" className="block p-2 hover:bg-gray-200 rounded">
                      Videos
                    </a>
                  </li>
                  <li>
                    <a href="/content/courses" className="block p-2 hover:bg-gray-200 rounded">
                      Courses
                    </a>
                  </li>
                  <li>
                    <a href="/content/ebooks" className="block p-2 hover:bg-gray-200 rounded">
                      Ebooks
                    </a>
                  </li>
                  <li>
                    <a href="/content/faqs" className="block p-2 hover:bg-gray-200 rounded">
                      FAQs
                    </a>
                  </li>
                  <li>
                    <a href="/content/testimonials" className="block p-2 hover:bg-gray-200 rounded">
                      Testimonials
                    </a>
                  </li>
                </ul>
              </li>
              <li>
                <a href="/users" className="block p-2 hover:bg-gray-200 rounded">
                  Users
                </a>
              </li>
              <li>
                <a href="/leads" className="block p-2 hover:bg-gray-200 rounded">
                  Leads
                </a>
              </li>
              <li>
                <a href="/settings" className="block p-2 hover:bg-gray-200 rounded">
                  Settings
                </a>
              </li>
            </ul>
          </nav>
        </aside>

        <main className="flex-grow p-6">
          <Outlet />
        </main>
      </div>

      <footer className="app-footer bg-gray-100 p-4 text-center text-sm text-gray-600">
        <div className="container mx-auto">
          &copy; {new Date().getFullYear()} UPskillway CMS. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Layout;