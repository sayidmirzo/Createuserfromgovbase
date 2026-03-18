import svgPaths from "./svg-f7tiefcb1o";

function Icon() {
  return (
    <div className="absolute left-[12px] size-[12px] top-[8px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g clipPath="url(#clip0_71_1026)" id="Icon">
          <path d={svgPaths.pecd8080} id="Vector" stroke="url(#paint0_linear_71_1026)" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M10 1.5V3.5" id="Vector_2" stroke="url(#paint1_linear_71_1026)" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M11 2.5H9" id="Vector_3" stroke="url(#paint2_linear_71_1026)" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M2 8.5V9.5" id="Vector_4" stroke="url(#paint3_linear_71_1026)" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M2.5 9H1.5" id="Vector_5" stroke="url(#paint4_linear_71_1026)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
        <defs>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_71_1026" x1="3.1423" x2="10.1958" y1="6.26621" y2="11.804">
            <stop stopColor="#2D74FF" />
            <stop offset="1" stopColor="#AA22FF" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint1_linear_71_1026" x1="10.2141" x2="11.202" y1="2.55324" y2="2.94103">
            <stop stopColor="#2D74FF" />
            <stop offset="1" stopColor="#AA22FF" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint2_linear_71_1026" x1="9.4283" x2="10.0862" y1="3.02662" y2="4.05975">
            <stop stopColor="#2D74FF" />
            <stop offset="1" stopColor="#AA22FF" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint3_linear_71_1026" x1="2.21415" x2="2.91948" y1="9.02662" y2="9.58038">
            <stop stopColor="#2D74FF" />
            <stop offset="1" stopColor="#AA22FF" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint4_linear_71_1026" x1="1.71415" x2="2.41948" y1="9.52662" y2="10.0804">
            <stop stopColor="#2D74FF" />
            <stop offset="1" stopColor="#AA22FF" />
          </linearGradient>
          <clipPath id="clip0_71_1026">
            <rect fill="white" height="12" width="12" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

export default function Text() {
  return (
    <div className="border border-[#2d74ff] border-solid relative rounded-[8px] size-full" data-name="Text" style={{ backgroundImage: "linear-gradient(90.3073deg, rgba(45, 116, 255, 0.12) 0%, rgba(170, 34, 255, 0.12) 100.88%)" }}>
      <Icon />
      <p className="absolute bg-clip-text font-['Inter:Medium',sans-serif] font-medium leading-[16px] left-[30px] not-italic text-[12px] text-[transparent] top-[6px] whitespace-nowrap" style={{ backgroundImage: "linear-gradient(164.402deg, rgb(45, 116, 255) 35.158%, rgb(170, 34, 255) 99.024%)" }}>
        Фотография
      </p>
    </div>
  );
}