export default function Stats({ stats }) {
  // Default stats data if no props are passed
  const defaultStats = [
    {
      value: "170%",
      label: "Average Salary Hike"
    },
    {
      value: "15,000+",
      label: "Students Trained"
    },
    {
      value: "400+",
      label: "Hiring Partners"
    },
    {
      value: "4.8/5",
      label: "Student Rating"
    }
  ];

  // Use provided stats or fall back to default
  const statsData = stats || defaultStats;

  return (
    <div className="relative w-full mt-16 sm:mt-20">
      {/* 🔴 Curved Red Background Line */}
      <svg
        viewBox="0 0 1512 420"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute -top-10 sm:-top-20 md:-top-28 left-0 w-full h-auto pointer-events-none z-0"
      >
        <g filter="url(#filter0_d_1_129)">
          <path
            d="M-17.0809 302.401C56.9066 330.175 228.887 381.709 324.908 365.655C444.934 345.588 472.357 257.515 657.869 232.362C843.381 207.209 981.747 274.456 1123.15 168.593C1264.56 62.73 1332.93 -6.04478 1526.99 3.35707"
            stroke="#FE513F"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
        <defs>
          <filter
            id="filter0_d_1_129"
            x="-43.5816"
            y="0"
            width="1597.07"
            height="419.189"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feOffset dy="24" />
            <feGaussianBlur stdDeviation="12" />
            <feComposite in2="hardAlpha" operator="out" />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0.215686 0 0 0 0 0.203922 0 0 0 0 0.662745 0 0 0 0.3 0"
            />
            <feBlend
              mode="normal"
              in2="BackgroundImageFix"
              result="effect1_dropShadow_1_129"
            />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="effect1_dropShadow_1_129"
              result="shape"
            />
          </filter>
        </defs>
      </svg>

      {/* 🌟 Stats Row */}
      <div
        className="relative z-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 
                   gap-6 sm:gap-8 justify-items-center py-16 sm:py-20 px-6 sm:px-10"
      >
        {statsData.map((stat, idx) => (
            <div
              key={idx}
              className="w-full max-w-[220px] sm:max-w-[240px] lg:max-w-[260px] 
                         bg-white rounded-[16px] border border-[#f5dca3] 
                         shadow-[0_4px_20px_rgba(0,0,0,0.05)]
                         flex flex-col items-center justify-center text-center 
                         py-6 sm:py-8 px-4"
            >
              <p className="text-2xl sm:text-3xl font-semibold text-gray-900">
                {stat.value}
              </p>
              <p className="text-gray-700 text-sm sm:text-base mt-2">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  }