"use client";

import { useRef, useState } from "react";
import { useIsomorphicLayoutEffect } from "./useIsomorphicLayoutEffect";

export const useGSAP = (callback, dependencies = []) => {
  const [isClient, setIsClient] = useState(false);
  const contextRef = useRef(null);

  // Set client flag after hydration
  useIsomorphicLayoutEffect(() => {
    setIsClient(true);
  }, []);

  useIsomorphicLayoutEffect(() => {
    if (!isClient || typeof window === "undefined") return;

    const initAnimation = async () => {
      try {
        const { initGSAP } = await import("../utils/gsapManager");
        const { gsap, ScrollTrigger } = await initGSAP();
        
        if (!gsap) return;

        // Create GSAP context for proper cleanup
        contextRef.current = gsap.context(() => {
          callback(gsap, ScrollTrigger);
        });

      } catch (error) {
        console.error("GSAP initialization failed:", error);
      }
    };

    initAnimation();

    // Cleanup function
    return () => {
      if (contextRef.current) {
        contextRef.current.revert();
        contextRef.current = null;
      }
    };
  }, [isClient, ...dependencies]);

  return { isClient };
};