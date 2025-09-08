"use client";

let gsapInstance = null;
let ScrollTriggerInstance = null;
let isInitialized = false;

// Check if we're on the client side
const isClient = typeof window !== "undefined";

// Single GSAP initialization for the entire app
export const initGSAP = async () => {
  // Only initialize on client side
  if (!isClient) {
    console.log("GSAP Manager: Server-side, skipping initialization");
    return { gsap: null, ScrollTrigger: null };
  }

  if (isInitialized) return { gsap: gsapInstance, ScrollTrigger: ScrollTriggerInstance };

  try {
    const { gsap } = await import("gsap");
    const { ScrollTrigger } = await import("gsap/ScrollTrigger");
    
    gsap.registerPlugin(ScrollTrigger);
    
    // GSAP performance optimizations
    gsap.ticker.lagSmoothing(0);
    gsap.config({
      force3D: true,
      nullTargetWarn: false,
      autoSleep: 60,
    });

    // ScrollTrigger performance optimizations
    ScrollTrigger.config({
      autoRefreshEvents: "visibilitychange,DOMContentLoaded,load",
      ignoreMobileResize: true,
    });

    // Store instances
    gsapInstance = gsap;
    ScrollTriggerInstance = ScrollTrigger;
    isInitialized = true;

    console.log("GSAP Manager: Initialized successfully");

    return { gsap, ScrollTrigger };
  } catch (error) {
    console.error("GSAP Manager: Failed to initialize", error);
    return null;
  }
};

// Approach Section Animation
export const initApproachAnimation = (cardsWrapperRef, cardsInnerRef) => {
  if (!gsapInstance || !ScrollTriggerInstance) {
    console.error("GSAP Manager: Not initialized");
    return null;
  }

  if (!cardsWrapperRef.current || !cardsInnerRef.current) {
    console.log("GSAP Manager: Approach refs not ready");
    return null;
  }

  const wrapper = cardsWrapperRef.current;
  const inner = cardsInnerRef.current;
  
  console.log("GSAP Manager: Initializing Approach animation");

  // Set wrapper to 100vh
  wrapper.style.height = "100vh";
  gsapInstance.set(inner, { y: 0 });

  // Calculate initial heights
  let maxTranslate = inner.offsetHeight - wrapper.offsetHeight;

  const triggers = [];

  // Main scroll trigger
  const trigger1 = ScrollTriggerInstance.create({
    trigger: wrapper,
    start: "top top",
    end: `+=${maxTranslate}`, // End when inner content is fully scrolled
    pin: true,
    scrub: 1,
    anticipatePin: 1,
    refreshPriority: -1,
    onUpdate: (self) => {
      // Calculate dynamic translation, ensuring it doesn't exceed maxTranslate
      const progress = self.progress;
      const translateY = -Math.min(maxTranslate * progress, maxTranslate);

      // Update translation
      gsapInstance.to(inner, {
        y: translateY,
        overwrite: "auto",
        ease: "none",
        duration: 0.1,
      });
    },
    onRefresh: (self) => {
      // Recalculate maxTranslate on refresh
      maxTranslate = inner.offsetHeight - wrapper.offsetHeight;
      // Update end value dynamically
      self.end = `+=${maxTranslate}`;
      self.refresh();
    },
  });

  triggers.push(trigger1);

  return {
    cleanup: () => {
      triggers.forEach(trigger => trigger.kill());
      console.log("GSAP Manager: Approach animation cleaned up");
    }
  };
};

// Text Highlight Animation
export const initTextHighlightAnimation = (markRef, options = {}) => {
  if (!gsapInstance || !ScrollTriggerInstance) {
    console.error("GSAP Manager: Not initialized");
    return null;
  }

  const { color = "orange", opacity = 0.3, delay = 0, width = "100%" } = options;
  
  // Implementation for text highlight animation
  // This would be moved from TextHighlightScroll component
  
  return {
    cleanup: () => {
      // Cleanup logic
    }
  };
};

// Global cleanup function
export const cleanupAllGSAP = () => {
  if (ScrollTriggerInstance) {
    ScrollTriggerInstance.getAll().forEach(trigger => trigger.kill());
    ScrollTriggerInstance.clearScrollMemory();
    ScrollTriggerInstance.refresh();
  }
  if (gsapInstance) {
    gsapInstance.globalTimeline.clear();
    gsapInstance.set("*", { clearProps: "all" });
  }
  console.log("GSAP Manager: All animations cleaned up");
};

// Refresh all ScrollTriggers
export const refreshScrollTriggers = () => {
  if (ScrollTriggerInstance) {
    ScrollTriggerInstance.refresh();
  }
};

// Utility function for creating scroll-triggered animations
export const createScrollAnimation = (config) => {
  if (!gsapInstance || !ScrollTriggerInstance) {
    console.error("GSAP Manager: Not initialized");
    return null;
  }

  const {
    trigger,
    timeline,
    scrollTriggerConfig = {},
    onComplete,
    onCleanup
  } = config;

  const tl = timeline || gsapInstance.timeline();
  
  const scrollTrigger = ScrollTriggerInstance.create({
    trigger,
    ...scrollTriggerConfig,
    animation: tl,
    onComplete: onComplete,
  });

  return {
    timeline: tl,
    scrollTrigger,
    cleanup: () => {
      scrollTrigger.kill();
      if (onCleanup) onCleanup();
    }
  };
};