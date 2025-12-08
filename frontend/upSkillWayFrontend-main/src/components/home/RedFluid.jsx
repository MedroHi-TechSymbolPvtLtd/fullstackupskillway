import React from 'react';

const RedFluid = () => {
  const stats = [
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

  return (
    <section className="relative py-16 bg-white overflow-hidden">
      {/* Abstract Red Fluid Line - Exact Figma specs */}
       <div
        className="absolute z-0"
        style={{
          width: "100%",
          height: "400px",
          top: "0px",
          left: "0px",
          transform: "rotate(5.048deg)",
          opacity: 1,
        }}
      >
        <svg
          width="100%"
          height="100%"
          viewBox="0 -50 1600 450"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          className="overflow-visible"
        >
          {/* Organic fluid red line from bottom-left to top-right - Smooth flow with higher right side */}
          <path
            d="M-50 350 
             C 100 345, 200 330, 350 300
             C 500 270, 650 230, 800 180
             C 950 130, 1100 80, 1250 40
             C 1400 0, 1500 -20, 1650 -30"
            stroke="#FE513F"
            strokeWidth="5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              filter: "drop-shadow(0px 24px 24px rgba(254, 81, 63, 0.25))",
            }}
          />
        </svg>
      </div>

      {/* Stats Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 z-10">
        <div
          className="flex flex-wrap justify-center items-center"
          style={{
            width: "1140px",
            height: "96px",
            gap: "40px",
            margin: "0 auto",
          }}
        >
          {stats.map((stat, index) => (
            <div
              key={index}
              className="flex flex-col justify-center items-center transition-all hover:shadow-lg"
              style={{
                width: "255px",
                height: "96px",
                background: "#FDFDFD",
                border: "1px solid #FFE6A1",
                borderRadius: "6px",
                boxShadow: "0px 32px 64px -16px rgba(57, 59, 106, 0.06)",
                padding: "24px",
              }}
            >
              <div className="text-3xl font-bold text-gray-800 mb-2">
                {stat.value}
              </div>
              <div className="text-gray-600 font-bold text-base text-center">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RedFluid;