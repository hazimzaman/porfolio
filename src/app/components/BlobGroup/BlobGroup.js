"use client";

import { useEffect, useRef } from "react";

const BlobGroup = ({
  top = "10%",
  left = null,
  right = null,
  bottom = null,
  width = "300px",
  height = "300px",
  color = "#ff751b",
  opacity = 0.6,
  blurAmount = 20,
  zIndex = 1,
  blobCount = 6,
  animationSpeed = 0.02,
}) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const blobsRef = useRef([]);
  const timeRef = useRef(0);

  // Initialize blob positions and properties
  const initializeBlobs = (canvasWidth, canvasHeight) => {
    const blobs = [];
    const centerX = canvasWidth / 2;
    const centerY = canvasHeight / 2;
    const maxRadius = Math.min(canvasWidth, canvasHeight) * 0.4;

    for (let i = 0; i < blobCount; i++) {
      const angle = (i / blobCount) * Math.PI * 2;
      const distance = Math.random() * maxRadius * 0.5;
      const size = (Math.random() * 0.5 + 0.3) * maxRadius;

      blobs.push({
        x: centerX + Math.cos(angle) * distance,
        y: centerY + Math.sin(angle) * distance,
        baseX: centerX + Math.cos(angle) * distance,
        baseY: centerY + Math.sin(angle) * distance,
        size: size,
        baseSize: size,
        speed: Math.random() * 0.02 + 0.01,
        phase: Math.random() * Math.PI * 2,
        moveRadius: Math.random() * 30 + 10,
      });
    }

    blobsRef.current = blobs;
  };

  // Convert hex color to rgba
  const hexToRgba = (hex, alpha) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  // Render blobs with blur effect
  const renderBlobs = (canvas, ctx) => {
    const { width: canvasWidth, height: canvasHeight } = canvas;

    // Clear canvas
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // Set blur filter
    ctx.filter = `blur(${blurAmount}px)`;

    // Update and draw each blob
    blobsRef.current.forEach((blob, index) => {
      // Animate blob position
      const time = timeRef.current + blob.phase;
      blob.x = blob.baseX + Math.cos(time * blob.speed) * blob.moveRadius;
      blob.y = blob.baseY + Math.sin(time * blob.speed * 0.7) * blob.moveRadius;

      // Animate blob size
      blob.size =
        blob.baseSize + Math.sin(time * blob.speed * 2) * (blob.baseSize * 0.2);

      // Create radial gradient for each blob
      const gradient = ctx.createRadialGradient(
        blob.x,
        blob.y,
        0,
        blob.x,
        blob.y,
        blob.size
      );

      // Vary opacity for depth
      const blobOpacity = opacity * (0.6 + Math.sin(time * blob.speed) * 0.4);

      gradient.addColorStop(0, hexToRgba(color, blobOpacity));
      gradient.addColorStop(0.7, hexToRgba(color, blobOpacity * 0.5));
      gradient.addColorStop(1, hexToRgba(color, 0));

      // Draw blob
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(blob.x, blob.y, blob.size, 0, Math.PI * 2);
      ctx.fill();
    });

    // Reset filter
    ctx.filter = "none";
  };

  // Animation loop
  const animate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    timeRef.current += animationSpeed;

    renderBlobs(canvas, ctx);
    animationRef.current = requestAnimationFrame(animate);
  };

  // Setup canvas
  const setupCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const container = canvas.parentElement;
    const rect = container.getBoundingClientRect();

    // Set canvas size
    canvas.width = rect.width;
    canvas.height = rect.height;

    // Initialize blobs
    initializeBlobs(rect.width, rect.height);

    // Start animation
    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  };

  // Handle resize
  const handleResize = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const container = canvas.parentElement;
    const rect = container.getBoundingClientRect();

    canvas.width = rect.width;
    canvas.height = rect.height;

    initializeBlobs(rect.width, rect.height);
  };

  useEffect(() => {
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
  }, [color, opacity, blurAmount, blobCount, handleResize, setupCanvas]);

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
        className="blob-group"
        style={{
          width: "100%",
          height: "100%",
          display: "block",
        }}
      />
    </div>
  );
};

export default BlobGroup;
