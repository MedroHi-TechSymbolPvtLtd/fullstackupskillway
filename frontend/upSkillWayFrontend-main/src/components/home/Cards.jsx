import { Star } from "lucide-react";

export default function Cards() {
  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 -mt-35">
        <div className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-12 lg:gap-24 relative z-10">
          {/* Guaranteed Job Placement - Left Card (STRAIGHT) */}
          <div className="bg-[#F7F7F7] backdrop-blur-sm w-[280px] h-[240px] rounded-2xl p-6 shadow-[0px 4px 24px 0px #0000000F] hover:shadow-xl transition-all relative">
            <div className="absolute -top-3 left-6">
              <div className="mt-8 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md border-2 border-gray-100">
                <Star className="w-5 h-5 text-gray-800 fill-gray-800" />
              </div>
            </div>
            <div className="mt-12">
              <h3 className="text-lg font-bold text-gray-800 mb-3">
                
                <br />
                Job Assistance
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
Placement support through 400+ hiring partners with resume & interview guidance.
              </p>
            </div>

            {/* Vector line to the right */}
            <div className="absolute -right-20 lg:-right-24 top-1/2 transform -translate-y-1/2 hidden md:block">
              <svg
                width="100"
                height="20"
                viewBox="0 0 100 20"
                className="overflow-visible"
              >
                <polygon
                  points="7,2 25,10 10,18"
                  fill="#F7F7F7"
                  className="drop-shadow-sm "
                />
                <line
                  x1="25"
                  y1="10"
                  x2="100"
                  y2="10"
                  stroke="#F7F7F7"
                  strokeWidth="4"
                  className="drop-shadow-sm"
                />
              </svg>
            </div>
          </div>

          {/* Industry Recognition - Center Card (TILTED & HIGHLIGHTED) */}
          <div className="bg-[#FFE6A1] w-[280px] h-[240px] rounded-2xl p-6 shadow-[0px 4px 24px 0px #0000000F] hover:shadow-2xl transition-all transform -rotate-[15deg] hover:-rotate-[12deg] relative z-20">
            <div className="absolute -top-3 left-6">
              <div className="mt-8 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md border-2 border-gray-100">
                <Star className="w-5 h-5 text-gray-800 fill-gray-800" />
              </div>
            </div>
            <div className="mt-20">
              <h3 className="text-lg font-bold text-gray-800 mb-3">
                Industry Recognition
              </h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                Earn globally recognized certifications valued by leading tech companies.
              </p>
            </div>

            {/* Vector line to the right */}
            <div className="absolute -right-20 lg:-right-24 top-1/2 transform -translate-y-1/2 hidden md:block">
              <svg
                width="100"
                height="20"
                viewBox="0 0 100 20"
                className="overflow-visible"
              >
                <polygon
                  points="0,2 37,10 0,18"
                  fill="#FFE6A1"
                  className="drop-shadow-sm"
                />
                <line
                  x1="37"
                  y1="10"
                  x2="115"
                  y2="10"
                  stroke="#FFE6A1"
                  strokeWidth="4"
                  className="drop-shadow-sm"
                />
              </svg>
            </div>
          </div>

          {/* Expert Mentorship - Right Card (STRAIGHT) */}
          <div className="bg-[#F7F7F7] backdrop-blur-sm w-[280px] h-[240px] rounded-2xl p-6 shadow-[0px 4px 24px 0px #0000000F] hover:shadow-xl transition-all relative transform -rotate-[-5deg] hover:-rotate-[-10deg] ">
            <div className="absolute -top-3 left-6">
              <div className="mt-8 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md border-2 border-gray-100">
                <Star className="w-5 h-5 text-gray-800 fill-gray-800" />
              </div>
            </div>
            <div className="mt-25">
              <h3 className="text-lg font-bold text-gray-800 mb-3 ">
                Expert Mentorship
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
              Get trained and guided by industry experts with proven experience.              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
