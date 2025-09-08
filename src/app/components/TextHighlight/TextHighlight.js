"use client";

import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "../../hooks/useGSAP";

const TextHighlight = ({ children, color = "orange", delay = 0 }) => {
  const markRef = useRef(null);

  useGSAP((gsap) => {
    const timer = setTimeout(() => {
      const mark = markRef.current;
      if (!mark) return;

      const selectors = mark.querySelector(".highlight-selectors");
      const leftImage = mark.querySelector(".highlight-selector--left");
      const rightImage = mark.querySelector(".highlight-selector--right");

      if (!selectors || !leftImage || !rightImage) return;

      // Set initial states
      gsap.set(selectors, {
        width: "0%",
        opacity: 1,
      });
      gsap.set(leftImage, {
        scale: 1,
        transformOrigin: "center",
      });
      gsap.set(rightImage, {
        scale: 0,
        opacity: 0,
        transformOrigin: "center",
      });

      // Create animation timeline
      const tl = gsap.timeline({ delay: 0.1 });

      tl.to(rightImage, {
        scale: 1,
        opacity: 1,
        duration: 0.2,
        ease: "expo.out",
      }).to(
        selectors,
        {
          width: "109%",
          duration: 1.2,
          ease: "power3.out",
        },
        0.1
      );
    }, 100);

    return () => clearTimeout(timer);
  }, [delay, children]);

  return (
    <mark ref={markRef} className={`highlight-mark highlight-mark--${color}`}>
      <span className="highlight-selectors">
        <div className="highlight-svg-container">
          <Image
            src="/leftVector.svg"
            alt=""
            width={11}
            height={109}
            className="highlight-selector--left"
          />
          <Image
            src="/rightVector.svg"
            alt=""
            width={12}
            height={108}
            className="highlight-selector--right"
          />
        </div>
      </span>
      {children}
    </mark>
  );
};

export default TextHighlight;
