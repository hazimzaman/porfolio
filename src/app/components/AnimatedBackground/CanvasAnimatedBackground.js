"use client";

import { useEffect, useRef } from "react";

const CanvasAnimatedBackground = () => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const gridConfigRef = useRef({
    columns: 0,
    rows: 0,
    boxWidth: 0,
    boxHeight: 0,
    totalBoxes: 0,
  });

  // Store animation states for each box
  const boxStatesRef = useRef([]);
  const currentHoveredBoxRef = useRef(-1);

  const MIN_BOX_SIZE = 80;

  // Calculate grid dimensions
  const calculateGrid = (canvas) => {
    const rect = canvas.getBoundingClientRect();
    const columns = Math.floor(rect.width / MIN_BOX_SIZE);
    const rows = Math.floor(rect.height / MIN_BOX_SIZE);

    gridConfigRef.current = {
      columns: Math.max(columns, 1),
      rows: Math.max(rows, 1),
      boxWidth: rect.width / Math.max(columns, 1),
      boxHeight: rect.height / Math.max(rows, 1),
      totalBoxes: Math.max(columns, 1) * Math.max(rows, 1),
    };

    // Initialize box states
    boxStatesRef.current = Array(gridConfigRef.current.totalBoxes)
      .fill()
      .map(() => ({
        opacity: 0,
        scale: 1,
        animating: false,
        targetOpacity: 0,
        targetScale: 1,
      }));

    console.log(
      `Canvas Grid: ${columns}x${rows} = ${gridConfigRef.current.totalBoxes} boxes`
    );
  };

  // Get box index from mouse position
  const getBoxIndex = (mouseX, mouseY, canvas) => {
    const rect = canvas.getBoundingClientRect();
    const x = mouseX - rect.left;
    const y = mouseY - rect.top;

    if (x < 0 || y < 0 || x >= rect.width || y >= rect.height) {
      return -1;
    }

    const column = Math.floor(x / gridConfigRef.current.boxWidth);
    const row = Math.floor(y / gridConfigRef.current.boxHeight);
    const index = row * gridConfigRef.current.columns + column;

    return index < gridConfigRef.current.totalBoxes ? index : -1;
  };

  // Animate box highlight
  const animateBox = (index, highlight = true) => {
    if (index < 0 || index >= boxStatesRef.current.length) return;

    const box = boxStatesRef.current[index];
    box.animating = true;

    if (highlight) {
      box.targetOpacity = 1;
      box.targetScale = 1.05;
    } else {
      box.targetOpacity = 0;
      box.targetScale = 1;
    }
  };

  // Update animation states
  const updateAnimations = () => {
    boxStatesRef.current.forEach((box) => {
      if (box.animating) {
        // Smooth interpolation
        const lerpFactor = 0.15;
        box.opacity += (box.targetOpacity - box.opacity) * lerpFactor;
        box.scale += (box.targetScale - box.scale) * lerpFactor;

        // Stop animating when close enough
        if (
          Math.abs(box.opacity - box.targetOpacity) < 0.01 &&
          Math.abs(box.scale - box.targetScale) < 0.01
        ) {
          box.opacity = box.targetOpacity;
          box.scale = box.targetScale;
          box.animating = false;
        }
      }
    });
  };

  // Draw the grid
  const draw = (canvas, ctx) => {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const { columns, rows, boxWidth, boxHeight } = gridConfigRef.current;

    // Draw grid boxes
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < columns; col++) {
        const index = row * columns + col;
        const box = boxStatesRef.current[index];

        if (!box) continue;

        const x = col * boxWidth;
        const y = row * boxHeight;

        // Draw border (always visible)
        ctx.strokeStyle = "rgba(28, 28, 28, 1)";
        ctx.lineWidth = 0.5;
        ctx.strokeRect(x, y, boxWidth, boxHeight);

        // Draw highlight if box is active
        if (box.opacity > 0) {
          const centerX = x + boxWidth / 2;
          const centerY = y + boxHeight / 2;
          const scaledWidth = boxWidth * box.scale;
          const scaledHeight = boxHeight * box.scale;

          // Draw highlight background
          ctx.fillStyle = `rgba(255, 117, 27, ${box.opacity})`;
          ctx.fillRect(
            centerX - scaledWidth / 2,
            centerY - scaledHeight / 2,
            scaledWidth,
            scaledHeight
          );

          // Draw highlight border
          ctx.strokeStyle = `rgba(255, 117, 27, ${box.opacity * 0.6})`;
          ctx.lineWidth = 1;
          ctx.strokeRect(
            centerX - scaledWidth / 2,
            centerY - scaledHeight / 2,
            scaledWidth,
            scaledHeight
          );
        }
      }
    }
  };

  // Animation loop
  const animate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    updateAnimations();
    draw(canvas, ctx);

    animationRef.current = requestAnimationFrame(animate);
  };

  // Handle mouse movement
  const handleMouseMove = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const boxIndex = getBoxIndex(e.clientX, e.clientY, canvas);

    if (boxIndex !== currentHoveredBoxRef.current) {
      // Reset previous box
      if (currentHoveredBoxRef.current >= 0) {
        animateBox(currentHoveredBoxRef.current, false);
      }

      // Highlight new box
      if (boxIndex >= 0) {
        animateBox(boxIndex, true);
      }

      currentHoveredBoxRef.current = boxIndex;
    }
  };

  // Setup canvas and event listeners
  const setupCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set canvas size to match container
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    calculateGrid(canvas);

    // Add mouse event listener
    document.addEventListener("mousemove", handleMouseMove);

    // Start animation loop
    animate();

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  };

  // Handle resize
  const handleResize = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Update canvas size
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    calculateGrid(canvas);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      const cleanup = setupCanvas();

      let resizeTimeout;
      const resizeHandler = () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(handleResize, 250);
      };

      window.addEventListener("resize", resizeHandler);

      return () => {
        clearTimeout(timer);
        clearTimeout(resizeTimeout);
        window.removeEventListener("resize", resizeHandler);
        if (cleanup) cleanup();
      };
    }, 100);

    return () => clearTimeout(timer);
  }, [handleResize, setupCanvas]);

  return (
    <canvas
      ref={canvasRef}
      className="animated-background-canvas"
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 1,
        pointerEvents: "none", // Let mouse events pass through to content
      }}
    />
  );
};

export default CanvasAnimatedBackground;
