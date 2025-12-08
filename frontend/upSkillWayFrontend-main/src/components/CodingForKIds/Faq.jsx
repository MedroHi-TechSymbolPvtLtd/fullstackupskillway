import { useState } from 'react';

const FAQ = ({ 
  faqs: propFaqs = [],
  title = "Frequently Asked Questions",
  className = "",
  gridCols = "md:grid-cols-2"
}) => {
  // Use FAQs from props
  const faqs = propFaqs;
  const faqsLoading = false;
  
  // State for FAQ expansion
  const [expandedFaq, setExpandedFaq] = useState(null);
  
  // State for showing all FAQs
  const [showAll, setShowAll] = useState(false);

  return (
    <section className={`py-10 bg-white ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 sm:mb-8 ml-0 lg:-ml-20">
          {title.split(" ").map((word, index) =>
            word === "Asked" ? (
              <span key={index} className="text-amber-500">
                {word}{" "}
              </span>
            ) : (
              <span key={index}>{word} </span>
            )
          )}
        </h1>

        <div className={`grid grid-cols-1 ${gridCols} gap-8`}>
          {faqsLoading ? (
            // Loading skeleton
            Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-6 animate-pulse"
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-gray-300 rounded-full mr-3"></div>
                    <div className="h-4 bg-gray-300 rounded w-64"></div>
                  </div>
                  <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                </div>
              </div>
            ))
          ) : faqs.length === 0 ? (
            // No FAQs state
            <div className="col-span-2 text-center py-8">
              <div className="text-gray-500">
                <svg
                  className="w-12 h-12 mx-auto mb-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
                <p className="text-lg font-semibold">No FAQs available</p>
                <p className="text-sm">
                  Check back later for frequently asked questions!
                </p>
              </div>
            </div>
          ) : (
            // Display FAQs from API (show only 6 initially)
            (showAll ? faqs : faqs.slice(0, 6)).map((faq, index) => (
              <div
                key={faq.id}
                className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold flex items-center">
                    <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mr-3 font-bold text-sm">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="flex-1">{faq.question}</span>
                  </h3>
                  <button
                    className={`p-2 rounded-full transition-colors ${
                      expandedFaq === faq.id
                        ? "text-red-500 hover:bg-red-50"
                        : "text-blue-500 hover:bg-blue-50"
                    }`}
                    onClick={() =>
                      setExpandedFaq(expandedFaq === faq.id ? null : faq.id)
                    }
                  >
                    <span className="text-xl font-bold">
                      {expandedFaq === faq.id ? "×" : "+"}
                    </span>
                  </button>
                </div>
                {expandedFaq === faq.id && (
                  <div className="mt-4 pl-11 text-gray-600">
                    <p>{faq.answer}</p>
                    {faq.category && (
                      <div className="mt-2">
                        <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                          {faq.category}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
        
        {/* View More Button - Only show if there are more than 6 FAQs */}
        {!faqsLoading && faqs.length > 6 && (
          <div className="text-center p-16">
            <button 
              onClick={() => setShowAll(!showAll)}
              className="text-white text-[20px] bg-[#FCB11F] w-[220px] h-[56px] p-4 rounded-tl-[40px] rounded-tr-[5px] rounded-br-[40px] rounded-bl-[5px] hover:bg-[#FF9500] transition-colors relative"
            >
              {showAll ? 'View Less' : 'View More'}
              <svg className="w-[40px] h-[40px] absolute -top-2 right-4 bg-[#FCB11F] text-white rounded-full p-2 mt-5" fill="none" stroke="currentColor" viewBox="0 0 24 24 ">
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={1} 
                  d={showAll ? "M19 9l-7 7-7-7" : "M7 17L17 7M17 7H7M17 7V17"} 
                />
              </svg>
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default FAQ;