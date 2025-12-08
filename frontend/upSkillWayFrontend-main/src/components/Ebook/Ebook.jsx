import React, { useState, useEffect } from 'react';
import { Star, ChevronRight, BookOpen, Loader2 } from 'lucide-react';
import config from '../../config/env';

const EBooksSection = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState(null);
  const [showAllEbooks, setShowAllEbooks] = useState(false);

  // Default fallback books for when API returns empty data
  const fallbackBooks = [
    {
      title: "Digital Marketing Made Easy",
      author: "Dr. Colin Munro",
      icon: "📚",
      rating: "4.7",
      pages: "220 pages",
      coverImageUrl: "https://via.placeholder.com/300x400/5D38DE/FFFFFF?text=Digital+Marketing",
      pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
    },
    {
      title: "Mastering AI & Machine Learning",
      author: "Dr. Colin Munro",
      icon: "🤖",
      rating: "4.7",
      pages: "220 pages",
      coverImageUrl: "https://via.placeholder.com/300x400/FDB11F/FFFFFF?text=AI+%26+ML",
      pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
    },
    {
      title: "Data Analytics for Beginners",
      author: "Dr. Colin Munro",
      icon: "💻",
      rating: "4.7",
      pages: "220 pages",
      coverImageUrl: "https://via.placeholder.com/300x400/5D38DE/FFFFFF?text=Data+Analytics",
      pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
    },
    {
      title: "UI/UX Design Fundamentals",
      author: "Dr. Colin Munro",
      icon: "🎨",
      rating: "4.7",
      pages: "220 pages",
      coverImageUrl: "https://via.placeholder.com/300x400/FDB11F/FFFFFF?text=UI%2FUX+Design",
      pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
    }
  ];

  useEffect(() => {
    fetchBooks();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchBooks = async () => {
    try {
      setLoading(true);
      setError(null);
      
  const response = await fetch(`${config.apiBaseUrl}/cms/ebooks`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.success) {
        // If API returns empty data, use fallback books
        if (result.data && result.data.length > 0) {
          setBooks(result.data);
        } else {
          setBooks(fallbackBooks);
        }
        setPagination(result.pagination);
      } else {
        throw new Error(result.message || 'Failed to fetch books');
      }
    } catch (err) {
      console.error('Error fetching books:', err);
      setError(err.message);
      // Use fallback books on error
      setBooks(fallbackBooks);
    } finally {
      setLoading(false);
    }
  };

  const handleSeeAll = () => {
    setShowAllEbooks(!showAllEbooks);
  };

  const handleEbookClick = (book) => {
    console.log('Ebook clicked:', book.title, 'PDF URL:', book.pdfUrl);
    
    // Check for pdfUrl first, then fallback to ebookUrl for backward compatibility
    const pdfUrl = book.pdfUrl || book.ebookUrl;
    
    if (pdfUrl && pdfUrl !== '#' && pdfUrl.trim() !== '') {
      try {
        window.open(pdfUrl, '_blank', 'noopener,noreferrer');
        console.log('Successfully opened PDF in new tab:', pdfUrl);
      } catch (error) {
        console.error('Error opening PDF:', error);
        alert('Unable to open PDF. Please try again.');
      }
    } else {
      console.log('No valid PDF URL available for:', book.title);
      alert('This ebook PDF is not available for reading yet.');
    }
  };

  if (loading) {
    return (
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-purple-600 mr-3" />
            <span className="text-gray-600">Loading eBooks...</span>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8 sm:py-12 md:py-16 lg:py-20 bg-white mt-0 sm:mt-0 md:mt-0 lg:-mt-50 mb-0 sm:mb-0 md:mb-0 lg:-mb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-6 sm:mb-8 md:mb-12 lg:mb-16">
          <div className="inline-block bg-purple-100 text-purple-600 px-3 py-1 rounded-full text-xs sm:text-sm font-semibold mb-2 sm:mb-3 md:mb-4">
            ebooks
          </div>
          <h2 id="discover-ebooks" className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-2 sm:mb-3 md:mb-4 lg:mb-6">
            Discover Our <span className="text-orange-400">eBooks</span>
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed px-4 sm:px-0">
            Explore Fresh Arrivals in Our eBook Library and Keep Learning with the Newest Insights.
          </p>
          {error && (
            <div className="mt-3 sm:mt-4 p-3 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded-lg">
              <p className="text-xs sm:text-sm">
                Unable to load from API: {error}. Showing sample books instead.
              </p>
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8 mb-8 sm:mb-12 md:mb-16 max-w-6xl mx-auto">
          {(showAllEbooks ? books : books.slice(0, 4)).map((book, index) => (
            <div 
              key={book.id || index} 
              onClick={() => handleEbookClick(book)}
              className="bg-white border-2 border-blue-200 rounded-lg p-4 sm:p-5 md:p-6 shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer group transform hover:scale-102 w-full"
              style={{
                minHeight: '140px'
              }}
            >
              <div className="flex items-center space-x-3 sm:space-x-4">
                {/* Left Side - Icon/Image */}
                <div className="flex-shrink-0">
                  {book.coverImageUrl ? (
                    <img 
                      src={book.coverImageUrl} 
                      alt={`${book.title} cover`}
                      className="w-12 h-16 sm:w-14 sm:h-18 md:w-16 md:h-20 object-cover rounded-lg shadow-sm group-hover:shadow-md transition-shadow duration-300"
                      onError={(e) => {
                        // Fallback to icon if image fails to load
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  
                  {/* Fallback Icon */}
                  <div 
                    className="w-12 h-16 sm:w-14 sm:h-18 md:w-16 md:h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white shadow-sm group-hover:shadow-md transition-shadow duration-300"
                    style={{ display: book.coverImageUrl ? 'none' : 'flex' }}
                  >
                    <div className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-blue-500 rounded-sm flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-sm"></div>
                    </div>
                  </div>
                </div>
                
                {/* Right Side - Content */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-900 text-base sm:text-lg md:text-xl mb-1 leading-tight group-hover:text-blue-600 transition-colors duration-200" style={{
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {book.title}
                  </h3>
                  <p className="text-gray-500 text-xs sm:text-sm mb-2 sm:mb-3">
                    {book.author}
                  </p>
                  <div className="flex items-center space-x-3 sm:space-x-4 text-xs sm:text-sm text-gray-600">
                    <div className="flex items-center">
                      <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 fill-current mr-1" />
                      <span className="font-medium">{book.rating}</span>
                    </div>
                    <span className="text-xs sm:text-sm">{book.pages}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {books.length > 4 && (
          <div className="text-center">
            <button 
              onClick={handleSeeAll}
              className="bg-purple-600 text-white px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4 rounded-full font-semibold text-xs sm:text-sm md:text-base hover:bg-purple-700 transition-all duration-200 inline-flex items-center hover:scale-105 transform"
            >
              {showAllEbooks ? 'Show Less' : 'See all'}
              <ChevronRight className={`w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2 transition-transform duration-200 ${showAllEbooks ? 'rotate-90' : ''}`} />
            </button>
            {pagination && pagination.total > 0 && (
              <p className="mt-2 sm:mt-3 text-xs sm:text-sm text-gray-500">
                Showing {showAllEbooks ? books.length : Math.min(4, books.length)} of {pagination.total} eBooks
              </p>
            )}
          </div>
        )}
        
        {/* Bottom Accent Line */}
        <div className="mt-8 sm:mt-12 md:mt-16">
          <div className="w-full h-0.5 sm:h-1 bg-orange-400 rounded-full"></div>
        </div>
      </div>
    </section>
  );
};

export default EBooksSection;