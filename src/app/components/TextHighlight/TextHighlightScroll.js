"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

// Register ScrollTrigger plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const TextHighlightScroll = ({
  children,
  color = "orange",
  delay = 0,
  width = "104%",
  opacity = 0.6,
}) => {
  const markRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      const mark = markRef.current;
      if (!mark) {
        console.log("Mark ref not found");
        return;
      }

      const selectors = mark.querySelector(".highlight-selectors");
      const leftImage = mark.querySelector(".highlight-selector--left");
      const rightImage = mark.querySelector(".highlight-selector--right");

      if (!selectors || !leftImage || !rightImage) {
        console.log("Elements not found:", {
          selectors,
          leftImage,
          rightImage,
        });
        return;
      }

      console.log(`Setting up scroll trigger for "${children}"`);

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
          start: "top 80%", // Animation starts when element is 80% from top of viewport
          end: "bottom 20%",
          toggleActions: "play none none reverse", // play on enter, reverse on leave
          markers: false, // Set to true for debugging
          // Using default window scroller
        },
      });

      // Add delay to the timeline
      if (delay > 0) {
        tl.to({}, { duration: delay });
      }

      // 1. Right SVG appears immediately when scroll trigger fires
      tl.to(rightImage, {
        scale: 1,
        opacity: 1,
        duration: 0.2,
        ease: "expo.out",
      })
        // 2. Background expands at the same time
        .to(
          selectors,
          {
            width: width,
            duration: 1.2,
            ease: "power3.out",
          },
          delay + 0.1
        ); // Start almost immediately with right SVG

      // Cleanup function
      return () => {
        ScrollTrigger.getAll().forEach((trigger) => {
          if (trigger.trigger === mark) {
            trigger.kill();
          }
        });
      };
    }, 100);

    return () => {
      clearTimeout(timer);
    };
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
