import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, Clock, User, Tag, Share2 } from "lucide-react";
import config from '../config/env';

const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blogPost, setBlogPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    Name: "",
    email: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");

  useEffect(() => {
    const fetchBlogPost = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${config.apiBaseUrl}/cms/blogs/${id}`);
        const result = await response.json();

        if (result.success) {
          setBlogPost(result.data);
        } else {
          setError("Blog post not found");
        }
      } catch (err) {
        setError("Error fetching blog post: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBlogPost();
    }
  }, [id]);

  const handleBackClick = () => {
    navigate("/blog");
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: blogPost?.title,
        text: blogPost?.excerpt || blogPost?.content?.substring(0, 100),
        url: window.location.href,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.Name.trim() || !formData.email.trim()) {
      setSubmitMessage("Please fill in both name and email fields.");
      return;
    }

    if (!formData.email.includes("@")) {
      setSubmitMessage("Please enter a valid email address.");
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage("");

    try {
  const response = await fetch(`${config.apiBaseUrl}/leads`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.Name,
          email: formData.email,
          phone: "",
          requirement: "Blog subscription - Create account at Upskillway",
          source: "blog_detail_page",
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setSubmitMessage(
          "Thank you! Your information has been submitted successfully."
        );
        setFormData({ Name: "", email: "" });
      } else {
        console.error("API Error:", result);
        setSubmitMessage(
          result.message || "Something went wrong. Please try again."
        );
      }
    } catch (error) {
      console.error("Submit error:", error);
      setSubmitMessage(
        "Network error. Please check your connection and try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex justify-center items-center min-h-64">
            <div className="text-gray-500">Loading blog post...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !blogPost) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Blog Post Not Found
            </h1>
            <p className="text-gray-600 mb-8">{error}</p>
            <button
              onClick={handleBackClick}
              className="bg-[#FCB11F] text-white px-6 py-3 rounded-full hover:bg-orange-500 transition-colors duration-300"
            >
              Back to Blogs
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={handleBackClick}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors duration-300"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Blogs
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-auto mx-auto px-4 sm:px-6 md:px-12 lg:px-20 py-6 sm:py-8">
        {/* Article Header */}
        <header className="mb-6 sm:mb-8">
          {/* Category Tag */}
          {blogPost.tags && blogPost.tags.length > 0 && (
            <div className="mb-3 sm:mb-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs sm:text-sm font-medium bg-purple-100 text-purple-600">
                <Tag className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                {blogPost.tags[0]}
              </span>
            </div>
          )}

          {/* Title */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-5 md:mb-6 leading-tight">
            {blogPost.title}
          </h1>

          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 md:gap-6 text-xs sm:text-sm text-gray-600 mb-6 sm:mb-8">
            <div className="flex items-center">
              <User className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              <span>{blogPost.author || "Upskillway Team"}</span>
            </div>
            <div className="flex items-center">
              <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              <span className="text-xs sm:text-sm">
                {new Date(blogPost.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
            <div className="flex items-center">
              <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              <span>{blogPost.readTime || "5 min read"}</span>
            </div>
            <button
              onClick={handleShare}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-300"
            >
              <Share2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              Share
            </button>
          </div>
        </header>

        {/* Featured Image */}
        {blogPost.imageUrl && (
          <div className="mb-6 sm:mb-8">
            <img
              src={blogPost.imageUrl}
              alt={blogPost.title}
              className="w-full h-48 sm:h-64 md:h-80 lg:h-96 object-cover rounded-lg sm:rounded-xl shadow-lg"
            />
          </div>
        )}

        {/* Article Content */}
        <article className="prose prose-sm sm:prose-base lg:prose-lg max-w-none">
          {/* Excerpt */}
          {blogPost.excerpt && (
            <div className="border-l-4 border-[#FCB11F] p-4 sm:p-5 md:p-6 mb-6 sm:mb-8 rounded-r-lg">
              <p className="text-base sm:text-lg text-gray-700 italic font-medium">
                {blogPost.excerpt}
              </p>
            </div>
          )}

          {/* Main Content */}
          <div className="text-gray-800 leading-relaxed">
            {blogPost.content ? (
              <div
                className="whitespace-pre-wrap"
                dangerouslySetInnerHTML={{ __html: blogPost.content }}
              />
            ) : (
              <div className="space-y-6">
                <p className="text-lg leading-relaxed">
                  Welcome to our comprehensive guide on this important topic. In
                  this article, we'll explore the key concepts and provide you
                  with actionable insights.
                </p>

                <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
                  Why This Topic Matters
                </h2>

                <p className="text-lg leading-relaxed">
                  Understanding this subject is crucial for your professional
                  development. It provides the foundation for making informed
                  decisions and achieving your goals.
                </p>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 my-8">
                  <h3 className="text-xl font-semibold text-blue-900 mb-3">
                    Key Takeaway
                  </h3>
                  <p className="text-blue-800">
                    The most important aspect to remember is that continuous
                    learning and practical application are essential for success
                    in any field.
                  </p>
                </div>

                <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
                  Practical Applications
                </h2>

                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-[#FCB11F] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span className="text-lg">
                      Apply the concepts in real-world scenarios
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-[#FCB11F] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span className="text-lg">
                      Seek feedback and iterate on your approach
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-[#FCB11F] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span className="text-lg">
                      Stay updated with the latest trends and developments
                    </span>
                  </li>
                </ul>

                <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
                  Conclusion
                </h2>

                <p className="text-lg leading-relaxed">
                  We hope this article has provided you with valuable insights
                  and practical knowledge. Remember that learning is a
                  continuous journey, and every step you take brings you closer
                  to your goals.
                </p>
              </div>
            )}
          </div>
        </article>

        {/* Tags */}
        {blogPost.tags && blogPost.tags.length > 0 && (
          <div className="mt-8 sm:mt-10 md:mt-12 pt-6 sm:pt-8 border-t border-gray-200">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {blogPost.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-2 sm:px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs sm:text-sm hover:bg-gray-200 transition-colors duration-300"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Blog Inside Image with Form */}
        <div className="mt-8 sm:mt-10 md:mt-12 w-full">
          <div className="main-container w-full min-h-[400px] sm:min-h-[500px] lg:min-h-[562px] relative mx-auto my-0 flex justify-center px-4 sm:px-6 lg:px-8">
            <div className="hidden lg:block w-[550px] h-[647px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-11-12/dtd0y2OJQX.png)] bg-cover bg-no-repeat relative z-[18] mt-[-85px] mr-200 mb-0" />
            <div className="w-full min-h-[400px] sm:min-h-[500px] lg:min-h-[562px] bg-[#131313] rounded-[16px] sm:rounded-[20px] lg:rounded-[24px] absolute top-0 left-1/2 transform -translate-x-1/2 overflow-hidden">
              <div className="w-[600px] h-[407.253px] absolute top-[-120.457px] left-[-107.874px] z-[17]">
                <div className="w-[249.509px] h-[330.538px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-11-12/PzDbm4fJyM.png)] bg-cover bg-no-repeat absolute top-0 left-0 z-[14]" />
                <div className="w-[107.978px] h-[324.942px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-11-12/3uiFHK6yH9.png)] bg-cover bg-no-repeat absolute top-[38.455px] left-[405.874px] z-[17]" />
                <div className="w-[251.756px] h-[329.797px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-11-12/cJ4LMMfD1D.png)] bg-cover bg-no-repeat absolute top-[77.456px] left-[220.874px] z-[16]" />
              </div>
              <div className="w-full sm:w-[600px] lg:w-[706.539px] h-auto lg:h-[668.625px] absolute top-0 sm:top-[-40px] lg:top-[-85.001px] left-1/2 sm:left-auto sm:right-4 lg:left-[600px] transform -translate-x-1/2 sm:translate-x-0 z-[15] px-4 sm:px-0">
                <form
                  onSubmit={handleSubmit}
                  className="flex w-full sm:w-[400px] lg:w-[450px] flex-col gap-[12px] sm:gap-[14px] lg:gap-[16px] items-start flex-nowrap relative z-[4] mt-[180px] sm:mt-[250px] lg:mt-[359.001px] mr-0 mb-0 ml-0"
                >
                  <div className="flex pt-[12px] sm:pt-[14px] lg:pt-[16px] pr-[20px] sm:pr-[28px] lg:pr-[32px] pb-[12px] sm:pb-[14px] lg:pb-[16px] pl-[14px] sm:pl-[16px] lg:pl-[18px] gap-[8px] sm:gap-[10px] items-center self-stretch shrink-0 flex-nowrap rounded-[60px] sm:rounded-[70px] lg:rounded-[80px] border-solid border border-[rgba(255,255,255,0.4)] relative overflow-hidden z-[5]">
                    <User className="w-[16px] h-[16px] sm:w-[18px] sm:h-[18px] lg:w-[20px] lg:h-[20px] shrink-0 text-white opacity-60" />
                    <input
                      type="text"
                      name="Name"
                      value={formData.Name}
                      onChange={handleInputChange}
                      placeholder="Your Name"
                      className="flex-1 min-w-0 font-['Plus_Jakarta_Sans'] text-[14px] sm:text-[16px] lg:text-[18px] font-medium leading-[1.3] text-white bg-transparent border-none outline-none placeholder-[rgba(255,255,255,0.6)] py-1"
                      required
                      autoComplete="name"
                    />
                  </div>
                  <div className="flex pt-[12px] sm:pt-[14px] lg:pt-[16px] pr-[20px] sm:pr-[28px] lg:pr-[32px] pb-[12px] sm:pb-[14px] lg:pb-[16px] pl-[14px] sm:pl-[16px] lg:pl-[18px] gap-[8px] sm:gap-[10px] items-center self-stretch shrink-0 flex-nowrap rounded-[60px] sm:rounded-[70px] lg:rounded-[80px] border-solid border border-[rgba(255,255,255,0.4)] relative overflow-hidden z-[8]">
                    <div className="w-[16px] h-[16px] sm:w-[18px] sm:h-[18px] lg:w-[20px] lg:h-[20px] shrink-0 bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-11-12/Odptpm92Jr.png)] bg-[length:100%_100%] bg-no-repeat relative z-[9]" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Email address"
                      className="flex-1 min-w-0 font-['Plus_Jakarta_Sans'] text-[14px] sm:text-[16px] lg:text-[18px] font-medium leading-[1.3] text-white bg-transparent border-none outline-none placeholder-[rgba(255,255,255,0.6)] py-1"
                      required
                      autoComplete="email"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`flex w-[120px] sm:w-[140px] lg:w-[150px] pt-[12px] sm:pt-[14px] lg:pt-[16px] pr-[24px] sm:pr-[28px] lg:pr-[32px] pb-[12px] sm:pb-[14px] lg:pb-[16px] pl-[24px] sm:pl-[28px] lg:pl-[32px] gap-[10px] justify-center items-center flex-nowrap rounded-[60px] sm:rounded-[70px] lg:rounded-[80px] relative overflow-hidden z-[11] mt-[16px] sm:mt-[20px] lg:mt-[26px] mr-0 mb-0 ml-0 transition-all duration-300 ${
                      isSubmitting
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-[#fff] hover:bg-gray-100"
                    }`}
                  >
                    <span className="font-['Plus_Jakarta_Sans'] text-[14px] sm:text-[16px] lg:text-[18px] font-bold leading-[1.3] text-[#131313] relative text-left whitespace-nowrap">
                      {isSubmitting ? "Submitting..." : "Submit"}
                    </span>
                  </button>
                </form>

                {/* Submit Message */}
                {submitMessage && (
                  <div
                    className={`absolute top-[380px] sm:top-[420px] lg:top-[480px] left-0 w-full sm:w-[400px] lg:w-[450px] p-2 sm:p-3 rounded-lg text-xs sm:text-sm font-medium z-20 ${
                      submitMessage.includes("successfully")
                        ? "bg-green-100 text-green-800 border border-green-200"
                        : "bg-red-100 text-red-800 border border-red-200"
                    }`}
                  >
                    {submitMessage}
                  </div>
                )}

                <div className="hidden lg:block w-[323px] h-[101.624px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-11-12/fMjDw2hTub.png)] bg-cover bg-no-repeat relative z-[13] mt-px mr-0 mb-0 ml-[316px]" />
                <div className="hidden lg:block w-[330.538px] h-[249.509px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-11-12/DCdCFo0ysL.png)] bg-cover bg-no-repeat absolute top-0 left-[376px] z-[15]" />
                <div className="flex w-full sm:w-[400px] lg:w-[477px] h-auto lg:h-[182px] flex-col gap-[12px] sm:gap-[14px] lg:gap-[16px] items-start flex-nowrap absolute top-[40px] sm:top-[80px] lg:top-[165.001px] left-0 z-[1] px-4 sm:px-0">
                  <div className="self-stretch shrink-0 font-['Plus_Jakarta_Sans'] text-[24px] sm:text-[32px] md:text-[40px] lg:text-[48px] font-semibold leading-[1.3] sm:leading-[1.26] relative text-left z-[2]">
                    <span className="font-['Plus_Jakarta_Sans'] text-[24px] sm:text-[32px] md:text-[40px] lg:text-[48px] font-semibold leading-[1.3] sm:leading-[1.26] text-[#fff] relative text-left">
                      Create your account <br />
                      at{" "}
                    </span>
                    <span className="font-['Plus_Jakarta_Sans'] text-[24px] sm:text-[32px] md:text-[40px] lg:text-[48px] font-semibold leading-[1.3] sm:leading-[1.26] text-[#ffb600] relative text-left">
                      Upskillway
                    </span>
                  </div>
                  <div className="self-stretch shrink-0 font-['Plus_Jakarta_Sans'] text-[14px] sm:text-[16px] lg:text-[18px] font-normal leading-[1.4] sm:leading-[1.3] relative text-left z-[3]">
                    <span className="font-['Plus_Jakarta_Sans'] text-[14px] sm:text-[16px] lg:text-[18px] font-normal leading-[1.4] sm:leading-[1.3] text-[#fff] relative text-left">
                      Join
                    </span>
                    <span className="font-['Plus_Jakarta_Sans'] text-[14px] sm:text-[16px] lg:text-[18px] font-normal leading-[1.4] sm:leading-[1.3] relative text-left">
                      {" "}
                    </span>
                    <span className="font-['Plus_Jakarta_Sans'] text-[14px] sm:text-[16px] lg:text-[18px] font-bold leading-[1.4] sm:leading-[1.3] text-[#fff] relative text-left">
                      Upskillway
                    </span>
                    <span className="font-['Plus_Jakarta_Sans'] text-[14px] sm:text-[16px] lg:text-[18px] font-bold leading-[1.4] sm:leading-[1.3] relative text-left">
                      {" "}
                    </span>
                    <span className="font-['Plus_Jakarta_Sans'] text-[14px] sm:text-[16px] lg:text-[18px] font-normal leading-[1.4] sm:leading-[1.3] text-[#fff] relative text-left">
                      to access courses, expert guidance, and more!
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;
