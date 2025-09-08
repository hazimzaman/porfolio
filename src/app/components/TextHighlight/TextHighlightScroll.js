"use client";

import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "../../hooks/useGSAP";

const TextHighlightScroll = ({
  children,
  color = "orange",
  delay = 0,
  width = "104%",
  opacity = 0.6,
}) => {
  const markRef = useRef(null);

  useGSAP((gsap, ScrollTrigger) => {
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

      // Create scroll-triggered timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: mark,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse",
          markers: false,
        },
      });

      // Add delay to the timeline
      if (delay > 0) {
        tl.to({}, { duration: delay });
      }

      // Animation sequence
      tl.to(rightImage, {
        scale: 1,
        opacity: 1,
        duration: 0.2,
        ease: "expo.out",
      }).to(
        selectors,
        {
          width: width,
          duration: 1.2,
          ease: "power3.out",
        },
        delay + 0.1
      );
    }, 100);

    return () => clearTimeout(timer);
  }, [delay, children, color, width, opacity]);

  return (
    <mark ref={markRef} className={`highlight-mark highlight-mark--${color}`}>
      <span
        className="highlight-selectors"
        style={{
          backgroundColor:
            color === "black"
              ? `rgba(0, 0, 0, ${opacity}) !important`
              : color === "orange"
              ? `rgba(245, 111, 21, ${opacity}) !important`
              : color === "blue"
              ? `rgba(24, 110, 223, ${opacity}) !important`
              : undefined,
        }}
      >
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

export default TextHighlightScroll;
