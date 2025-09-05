"use client";

import { useEffect, useRef } from "react";

const AnimatedBlock = ({
  top = "10%",
  left = null,
  right = null,
  bottom = null,
  width = "100%",
  height = "100%",
  blockSize = 40,
  color = "#ff751b",
  borderColor = null,
  opacity = 0.5,
  zIndex = 1,
}) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const isInitializedRef = useRef(false);

  // Grid configuration
  const gridRef = useRef({
    columns: 0,
    rows: 0,
    boxWidth: 0,
    boxHeight: 0,
  });

  // Box states for animation
  const boxStatesRef = useRef([]);
  const hoveredBoxRef = useRef(-1);

  useEffect(() => {
    // Initialize grid based on canvas size with square boxes
    const initializeGrid = () => {
      const canvas = canvasRef.current;
      if (!canvas) return false;

      const rect = canvas.getBoundingClientRect();
      if (rect.width < blockSize || rect.height < blockSize) return false;

      const columns = Math.floor(rect.width / blockSize);
      const rows = Math.floor(rect.height / blockSize);

      // Ensure boxes are always square by using the blockSize
      gridRef.current = {
        columns,
        rows,
        boxWidth: blockSize,
        boxHeight: blockSize,
      };

      // Initialize box states
      const totalBoxes = columns * rows;
      boxStatesRef.current = Array(totalBoxes)
        .fill()
        .map(() => ({
          opacity: 0,
          scale: 1,
          targetOpacity: 0,
          targetScale: 1,
          borderOpacity: 1,
          targetBorderOpacity: 1,
        }));

      return true;
    };

    // Get box index from mouse coordinates
    const getBoxFromMouse = (mouseX, mouseY) => {
      const canvas = canvasRef.current;
      if (!canvas) return -1;

      const rect = canvas.getBoundingClientRect();
      const x = mouseX - rect.left;
      const y = mouseY - rect.top;

      if (x < 0 || y < 0 || x > rect.width || y > rect.height) {
        return -1;
      }

      const col = Math.min(
        Math.floor(x / gridRef.current.boxWidth),
        gridRef.current.columns - 1
      );
      const row = Math.min(
        Math.floor(y / gridRef.current.boxHeight),
        gridRef.current.rows - 1
      );
      const index = row * gridRef.current.columns + col;

      return index < boxStatesRef.current.length ? index : -1;
    };

    // Update box animation
    const updateBox = (index, highlight) => {
      if (index < 0 || index >= boxStatesRef.current.length) return;

      const box = boxStatesRef.current[index];
      box.targetOpacity = highlight ? 1 : 0;
      box.targetScale = highlight ? 1.1 : 1;
      // Reverse logic for border: hide border on hover
      box.targetBorderOpacity = highlight ? 0 : 1;
    };

    // Smooth animation interpolation
    const updateAnimations = () => {
      boxStatesRef.current.forEach((box) => {
        const speed = 0.15;
        box.opacity += (box.targetOpacity - box.opacity) * speed;
        box.scale += (box.targetScale - box.scale) * speed;
        box.borderOpacity +=
          (box.targetBorderOpacity - box.borderOpacity) * speed;
      });
    };

    // Convert hex to rgba
    const hexToRgba = (hex, alpha) => {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    };

    // Lighten a hex color by mixing with white
    const lightenColor = (hex, amount) => {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);

      const newR = Math.round(r + (255 - r) * amount);
      const newG = Math.round(g + (255 - g) * amount);
      const newB = Math.round(b + (255 - b) * amount);

      return `#${newR.toString(16).padStart(2, "0")}${newG
        .toString(16)
        .padStart(2, "0")}${newB.toString(16).padStart(2, "0")}`;
    };

    // Render the grid
    const render = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      const { columns, rows, boxWidth, boxHeight } = gridRef.current;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw grid
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < columns; col++) {
          const index = row * columns + col;
          const box = boxStatesRef.current[index];
          if (!box) continue;

          const x = col * boxWidth;
          const y = row * boxHeight;

          // Draw default grid border
          ctx.strokeStyle = "rgba(60, 60, 60, 0.4)";
          ctx.lineWidth = 0.5;
          ctx.strokeRect(x, y, boxWidth, boxHeight);

          // Draw colored border - all four sides (initially visible, fades on hover)
          if (borderColor && box.borderOpacity > 0.01) {
            // Use normal primary color with full opacity
            ctx.strokeStyle = hexToRgba(borderColor, box.borderOpacity * 1);
            ctx.lineWidth = 0.2;

            // Draw top border
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x + boxWidth, y);
            ctx.stroke();

            // Draw right border
            ctx.beginPath();
            ctx.moveTo(x + boxWidth, y);
            ctx.lineTo(x + boxWidth, y + boxHeight);
            ctx.stroke();

            // Draw bottom border
            ctx.beginPath();
            ctx.moveTo(x + boxWidth, y + boxHeight);
            ctx.lineTo(x, y + boxHeight);
            ctx.stroke();

            // Draw left border
            ctx.beginPath();
            ctx.moveTo(x, y + boxHeight);
            ctx.lineTo(x, y);
            ctx.stroke();
          }

          // Draw highlight fill if active (on hover)
          if (box.opacity > 0.01) {
            const centerX = x + boxWidth / 2;
            const centerY = y + boxHeight / 2;
            const scaledW = boxWidth * box.scale;
            const scaledH = boxHeight * box.scale;

            // Fill
            ctx.fillStyle = hexToRgba(color, box.opacity * opacity);
            ctx.fillRect(
              centerX - scaledW / 2,
              centerY - scaledH / 2,
              scaledW,
              scaledH
            );
          }
        }
      }
    };

    // Animation loop
    const animate = () => {
      updateAnimations();
      render();
      animationRef.current = requestAnimationFrame(animate);
    };

    // Mouse move handler
    const handleMouseMove = (e) => {
      const boxIndex = getBoxFromMouse(e.clientX, e.clientY);

      if (boxIndex !== hoveredBoxRef.current) {
        // Reset previous box
        if (hoveredBoxRef.current >= 0) {
          updateBox(hoveredBoxRef.current, false);
        }

        // Highlight new box
        if (boxIndex >= 0) {
          updateBox(boxIndex, true);
        }

        hoveredBoxRef.current = boxIndex;
      }
    };

    // Setup canvas
    const setupCanvas = () => {
      const canvas = canvasRef.current;
      if (!canvas || isInitializedRef.current) return;

      // Wait for container to have proper dimensions
      const container = canvas.parentElement;
      const rect = container.getBoundingClientRect();

      // Ensure container has dimensions
      if (rect.width < 10 || rect.height < 10) {
        setTimeout(setupCanvas, 100);
        return;
      }

      // Set canvas internal resolution to match container size
      canvas.width = rect.width;
      canvas.height = rect.height;

      if (!initializeGrid()) {
        setTimeout(setupCanvas, 100);
        return;
      }

      isInitializedRef.current = true;

      // Start animation
      animate();

      // Add mouse listener
      document.addEventListener("mousemove", handleMouseMove);

      return () => {
        isInitializedRef.current = false;
        document.removeEventListener("mousemove", handleMouseMove);
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      };
    };

    // Handle resize
    const handleResize = () => {
      if (!isInitializedRef.current) return;

      const canvas = canvasRef.current;
      if (!canvas) return;

      const container = canvas.parentElement;
      const rect = container.getBoundingClientRect();

      // Only resize if container has valid dimensions
      if (rect.width < 10 || rect.height < 10) return;

      canvas.width = rect.width;
      canvas.height = rect.height;

      initializeGrid();
    };

    const timer = setTimeout(() => {
      const cleanup = setupCanvas();

      let resizeTimeout;
      const resizeHandler = () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(handleResize, 200);
      };

      window.addEventListener("resize", resizeHandler);

      return () => {
        clearTimeout(resizeTimeout);
        window.removeEventListener("resize", resizeHandler);
        if (cleanup) cleanup();
      };
    }, 100);

    return () => clearTimeout(timer);
  }, [blockSize, color, borderColor, width, height, opacity]);

  // Position styles
  const positionStyles = {
    position: "absolute",
    width,
    height,
    zIndex,
    pointerEvents: "none",
  };

  if (top !== null) positionStyles.top = top;
  if (bottom !== null) positionStyles.bottom = bottom;
  if (left !== null) positionStyles.left = left;
  if (right !== null) positionStyles.right = right;

  return (
    <div style={positionStyles}>
      <canvas
        ref={canvasRef}
        className="pixel-blob"
        style={{
          width: "100%",
          height: "100%",
          display: "block",
          position: "relative",
          zIndex: "inherit",
        }}
      />
    </div>
  );
};

export default AnimatedBlock;
