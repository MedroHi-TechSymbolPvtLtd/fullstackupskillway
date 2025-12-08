import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import config from '../../config/env';

const BlogSection = () => {
  const [blogPosts, setBlogPosts] = useState([]);
  const [mostViewedPosts, setMostViewedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [categories, setCategories] = useState(['All']);
  const [showAllBlogs, setShowAllBlogs] = useState(false);
  const [showAllMostViewed, setShowAllMostViewed] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
  const response = await fetch(`${config.apiBaseUrl}/cms/blogs`);
        const result = await response.json();
        
        if (result.success) {
          // Handle both array and single object responses
          const blogData = Array.isArray(result.data) ? result.data : [result.data];
          
          // Transform API data to match the component's expected format
          const transformedPosts = blogData.map(post => ({
            id: post.id,
            title: post.title,
            image: post.imageUrl,
            category: post.category || 'General', // Use category field from API
            date: new Date(post.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            }),
            readTime: post.readTime || '5 min read',
            views: post.views || 0
          }));
          setBlogPosts(transformedPosts);
          
          // Extract unique categories from API response
          const uniqueCategories = ['All', ...new Set(transformedPosts.map(post => post.category).filter(Boolean))];
          setCategories(uniqueCategories);
          
          // Get most viewed blogs (sorted by views, showing top blogs)
          const sortedByViews = [...transformedPosts].sort((a, b) => (b.views || 0) - (a.views || 0));
          // Store all most viewed posts
          setMostViewedPosts(sortedByViews);
        } else {
          setError('Failed to fetch blogs');
        }
      } catch (err) {
        setError('Error fetching blogs: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  // Filter blogs by selected category
  const filteredPosts = blogPosts.filter(post => {
    // If "All" is selected, show all blogs
    if (selectedCategory === 'All') {
      return true;
    }
    // Match exact category from API
    return post.category === selectedCategory;
  });

  if (loading) {
    return (
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center items-center min-h-64">
            <div className="text-gray-500">Loading blogs...</div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center items-center min-h-64">
            <div className="text-red-500">{error}</div>
          </div>
        </div>
      </section>
    );
  }

  const BlogCard = ({ post, showReadNow = false }) => (
    <div 
      className="w-full sm:w-[356px] h-auto rounded-[24px] bg-white shadow-[0_0_60px_0_#0000001A] overflow-hidden cursor-pointer group hover:shadow-[0_0_80px_0_#0000002A] transition-shadow duration-300"
      onClick={() => navigate(`/blog/${post.id}`)}
    >
      <div className="h-[280px] bg-gray-200 relative overflow-hidden">
        <img 
          src={post.image || 'https://via.placeholder.com/356x280'} 
          alt={post.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-6 min-h-[187px] flex flex-col justify-between">
        <div>
          <span className="inline-block bg-purple-100 text-purple-600 text-sm font-bold px-3 py-1 rounded-full mb-4">
            {post.category}
          </span>
          <h3 className="text-lg font-bold text-gray-900 mb-4 line-clamp-3 leading-tight group-hover:text-purple-600 transition-colors duration-300">
            {post.title}
          </h3>
        </div>
        <div>
          <div className="text-sm text-gray-500 mb-4">
            <span>{post.date}</span>
            <span className="mx-2">|</span>
            <span>{post.readTime}</span>
          </div>
          {showReadNow && (
            <button className="w-full border border-gray-900 text-gray-900 font-semibold px-6 py-2 rounded-full hover:bg-gray-100 transition-colors duration-300">
              Read Now
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Read our Blogs Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <span className="inline-block bg-purple-100 text-purple-600 text-sm font-semibold px-3 py-1 rounded-full mb-3">
              Latest insights
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900">
              Read our <span className="text-[#FF9500]">Blogs</span>
            </h2>
          </div>

          {/* Category Tabs - Navigation Header */}
          <div className="flex flex-wrap gap-4 mb-12">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => {
                  setSelectedCategory(category);
                  setShowAllBlogs(false); // Reset show all when category changes
                }}
                className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                  selectedCategory === category
                    ? 'bg-purple-100 text-purple-600'
                    : 'bg-white text-gray-700 border border-gray-300 hover:border-purple-300'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Blog Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {(showAllBlogs ? filteredPosts : filteredPosts.slice(0, 6)).map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>

          {filteredPosts.length > 6 && (
            <div className="text-center">
              <button 
                onClick={() => setShowAllBlogs(!showAllBlogs)}
                className="bg-[linear-gradient(90deg,#FDB11F_0%,#5D38DE_100%)] hover:opacity-90 text-white font-semibold px-8 py-3 rounded-full transition-opacity duration-300"
              >
                {showAllBlogs ? 'Show Less' : 'See all'}
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Most Viewed Blogs Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl sm:text-5xl font-bold mb-12 text-gray-900">
            Most Viewed <span className="text-[#FF9500]">Blogs</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {(showAllMostViewed ? mostViewedPosts : mostViewedPosts.slice(0, 3)).map((post) => (
              <BlogCard key={post.id} post={post} showReadNow={true} />
            ))}
          </div>

          {mostViewedPosts.length > 3 && (
            <div className="text-center">
              <button 
                onClick={() => setShowAllMostViewed(!showAllMostViewed)}
                className="bg-[linear-gradient(90deg,#FDB11F_0%,#5D38DE_100%)] hover:opacity-90 text-white font-semibold px-8 py-3 rounded-full transition-opacity duration-300"
              >
                {showAllMostViewed ? 'Show Less' : 'See all'}
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default BlogSection;