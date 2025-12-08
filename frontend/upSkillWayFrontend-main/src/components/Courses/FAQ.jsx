import React, { useState, useEffect } from 'react';
import config from '../../config/env';

const FAQ = ({ 
  faqs: propFaqs,
  apiUrl = `${config.apiBaseUrl}/cms/faqs`,
  title = "",
  className = "",
  gridCols = "md:grid-cols-2"
}) => {
  // State for FAQs
  const [faqs, setFaqs] = useState(propFaqs || []);
  const [faqsLoading, setFaqsLoading] = useState(!propFaqs);
  const [faqsError, setFaqsError] = useState(null);
  
  // State for FAQ expansion
  const [expandedFaq, setExpandedFaq] = useState(null);

  // Fetch FAQs from API only if not provided as props
  useEffect(() => {
    if (propFaqs) {
      setFaqs(propFaqs);
      setFaqsLoading(false);
      return;
    }

    const fetchFaqs = async () => {
      try {
        setFaqsLoading(true);
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (data.success) {
          setFaqs(data.data);
        } else {
          setFaqsError("Failed to fetch FAQs");
        }
      } catch (err) {
        setFaqsError("Error fetching FAQs: " + err.message);
        console.error("Error fetching FAQs:", err);
      } finally {
        setFaqsLoading(false);
      }
    };

    fetchFaqs();
  }, [apiUrl, propFaqs]);

  const handleRetry = () => {
    setFaqsError(null);
    setFaqsLoading(true);
    // Trigger re-fetch by updating the dependency
    window.location.reload();
  };

  return (
    <section className={`py-20 bg-white ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-center mb-16">
          {title}
        </h2>

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
          ) : faqsError ? (
            // Error state
            <div className="col-span-2 text-center py-8">
              <div className="text-red-500 mb-4">
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
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
                <p className="text-lg font-semibold">Failed to load FAQs</p>
                <p className="text-sm text-gray-600">{faqsError}</p>
              </div>
              <button
                onClick={handleRetry}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                Try Again
              </button>
            </div>
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
            // Display FAQs from API
            faqs.map((faq, index) => (
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
      </div>
        <div className="text-center p-16" >
        <button className=" text-white text-[20px] bg-[#FCB11F] w-[220px] h-[56px] p-4 rounded-tl-[40px] rounded-tr-[5px] rounded-br-[40px] rounded-bl-[5px] " >View More
           <svg className="w-[40px] h-[40px] -mt-10 ml-35  bg-[#FCB11F] text-white " fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 17L17 7M17 7H7M17 7V17" />
                </svg> 
        </button>
       
      </div>
    </section>
  );
};

export default FAQ;