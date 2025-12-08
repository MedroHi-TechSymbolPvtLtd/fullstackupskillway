import React, { useState, useRef, useEffect } from "react";

const ShareMenu = ({ className = "" }) => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const btnRef = useRef(null);
  const url = window.location.href;
  const title = document.title;

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        !btnRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    };
    const handleEscape = (e) => e.key === "Escape" && setOpen(false);

    document.addEventListener("click", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("click", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const shareOn = (platform) => {
    const u = encodeURIComponent(url);
    const t = encodeURIComponent(title);
    let link = "";

    switch (platform) {
      case "x":
        link = `https://twitter.com/intent/tweet?url=${u}&text=${t}`;
        break;
      case "whatsapp":
        link = `https://api.whatsapp.com/send?text=${t}%20${u}`;
        break;
      case "facebook":
        link = `https://www.facebook.com/sharer/sharer.php?u=${u}`;
        break;
      case "linkedin":
        link = `https://www.linkedin.com/shareArticle?mini=true&url=${u}&title=${t}`;
        break;
      case "telegram":
        link = `https://t.me/share/url?url=${u}&text=${t}`;
        break;
      default:
        return;
    }

    window.open(link, "_blank", "noopener,noreferrer");
  };

  const copyLink = () => {
    navigator.clipboard.writeText(url);
    alert("Link copied!");
  };

  return (
    <div className={`relative inline-block ${className}`}>
      <button
        ref={btnRef}
        onClick={() => setOpen(!open)}
        className="inline-flex items-center gap-2 rounded-full  px-6 py-4 text-sm font-medium text-gray-900 z-9999"
      >
      </button>

      {/* Popover */}
      <div
        ref={menuRef}
        className={`z-9999 -mt-20 w-72 origin-top-right rounded-2xl border border-gray-200 bg-white p-3 shadow-xl transition-all ${
          open ? "scale-100 opacity-100" : "scale-90 opacity-0 pointer-events-none"
        }`}
      >
        <div className="px-2 pb-2 text-sm text-gray-600">Share this page</div>

        <div className="grid grid-cols-5 gap-2">
          {["x", "whatsapp", "facebook", "linkedin", "telegram"].map((platform) => (
            <button
              key={platform}
              onClick={() => shareOn(platform)}
              className="group rounded-xl border border-gray-200 p-3 hover:bg-gray-100"
            >
              <span className="block">{platform.charAt(0).toUpperCase()}</span>
            </button>
          ))}
        </div>

        <div className="mt-3 flex items-center justify-between rounded-xl bg-gray-100 p-2">
          <span className="truncate text-xs text-gray-600">{url}</span>
          <button
            onClick={copyLink}
            className="rounded-lg bg-gray-200 px-3 py-1 text-xs hover:bg-gray-300"
          >
            Copy
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareMenu;