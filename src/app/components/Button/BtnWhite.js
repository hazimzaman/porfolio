import React from "react";
import "./BtnWhite.css";
import Image from "next/image";

export default function BtnWhite({ text = "Arrow Button" }) {
  return (
    <div className="btn-white-wrapper">
      <div className="btn-white">{text}</div>
      <div className="btn-white__circle">
        {/* Left (initial) arrow */}
        <span className="btn-white__arrow btn-white__arrow--left">
          <Image src="/Arrow1.svg" alt="arrow" width={29} height={28} />
        </span>
        {/* Right (hover) arrow */}
        <span className="btn-white__arrow btn-white__arrow--right">
          <Image src="/Arrow1.svg" alt="arrow" width={29} height={28} />
        </span>
      </div>
    </div>
  );
  
}