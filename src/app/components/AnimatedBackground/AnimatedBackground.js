"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import "./AnimatedBackground.css";

const MIN_BOX_SIZE = 80; // Increased from 40 to make boxes bigger

const AnimatedBackground = () => {
  const backgroundRef = useRef(null);
  const gridConfigRef = useRef({
    columns: 0,
    rows: 0,
    totalBoxes: 0,
  });
  const [boxes, setBoxes] = useState([]);

  useEffect(() => {
    // Calculate optimal grid size based on screen dimensions
    const calculateGridSize = () => {
      const background = backgroundRef.current;
      if (!background) return;

      // Use getBoundingClientRect to get actual element dimensions like the HTML version
      const rect = background.getBoundingClientRect();
      
      // Ensure the element has proper dimensions before proceeding
      if (rect.width < 100 || rect.height < 100) {
        console.log("Element too small, retrying...", rect.width, rect.height);
        setTimeout(calculateGridSize, 100);
        return;
      }
      
      const columns = Math.floor(rect.width / MIN_BOX_SIZE);
      const rows = Math.floor(rect.height / MIN_BOX_SIZE);

      gridConfigRef.current = {
        columns: Math.max(columns, 1),
        rows: Math.max(rows, 1),
        totalBoxes: Math.max(columns, 1) * Math.max(rows, 1),
      };

      background.style.gridTemplateColumns = `repeat(${gridConfigRef.current.columns}, 1fr)`;
      background.style.gridTemplateRows = `repeat(${gridConfigRef.current.rows}, 1fr)`;
    };

    // Create grid dynamically
    const createGrid = () => {
      const background = backgroundRef.current;
      if (!background) return;

      calculateGridSize();
      
      // Create boxes array for React state
      const newBoxes = [];
      for (let i = 0; i < gridConfigRef.current.totalBoxes; i++) {
        newBoxes.push({ id: i, index: i });
      }
      
      setBoxes(newBoxes);

      console.log(
        `Grid created: ${gridConfigRef.current.columns}x${gridConfigRef.current.rows} = ${
          gridConfigRef.current.totalBoxes
        } boxes (min ${MIN_BOX_SIZE}px each)`
      );
    };

    // Animation function
    const highlightBox = (element) => {
      gsap.to(element, {
        backgroundColor: "rgba(255, 140, 0, 1)",
        scale: 1.05,
        duration: 0,
        overwrite: true,
      });

      gsap.to(element, {
        backgroundColor: "rgba(28, 28, 28, 0)",
        scale: 1,
        duration: 2.5,
        ease: "power2.out",
      });
    };

    // Calculate which box should be highlighted based on mouse position
    const getBoxAtPosition = (mouseX, mouseY) => {
      const background = backgroundRef.current;
      if (!background) return null;

      const rect = background.getBoundingClientRect();
      const boxWidth = rect.width / gridConfigRef.current.columns;
      const boxHeight = rect.height / gridConfigRef.current.rows;

      const column = Math.floor((mouseX - rect.left) / boxWidth);
      const row = Math.floor((mouseY - rect.top) / boxHeight);

      const index = row * gridConfigRef.current.columns + column;
      
      if (index >= 0 && index < gridConfigRef.current.totalBoxes) {
        return background.children[index];
      }
      
      return null;
    };

    // Add event listeners for document-level mouse tracking
    const addEventListeners = () => {
      let lastHighlightedBox = null;

      const handleMouseMove = (e) => {
        const box = getBoxAtPosition(e.clientX, e.clientY);
        
        if (box && box !== lastHighlightedBox) {
          if (lastHighlightedBox) {
            // Reset previous box
            gsap.to(lastHighlightedBox, {
              backgroundColor: "rgba(28, 28, 28, 0)",
              scale: 1,
              duration: 1.2,
            });
          }
          
          highlightBox(box);
          lastHighlightedBox = box;
        } else if (!box && lastHighlightedBox) {
          // Mouse is outside grid, reset
          gsap.to(lastHighlightedBox, {
            backgroundColor: "rgba(28, 28, 28, 0)",
            scale: 1,
            duration: 1.2,
          });
          lastHighlightedBox = null;
        }
      };

      document.addEventListener("mousemove", handleMouseMove);

      // Cleanup function
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
      };
    };

    // Initialize
    const init = () => {
      createGrid();
      return addEventListeners();
    };

    const timer = setTimeout(() => {
      const cleanup = init();
      
      let resizeTimeout;
      const handleResize = () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
          cleanup();
          const newCleanup = init();
          return newCleanup;
        }, 250);
      };

      window.addEventListener("resize", handleResize);

      return () => {
        clearTimeout(timer);
        clearTimeout(resizeTimeout);
        window.removeEventListener("resize", handleResize);
        cleanup();
      };
    }, 300); // Increased from 100ms to 300ms to ensure proper rendering
  }, []);

  return (
    <div ref={backgroundRef} className="animated-background">
      {boxes.map((box) => (
        <div key={box.id} className="background__box" data-index={box.index} />
      ))}
    </div>
  );
};

export default AnimatedBackground;
