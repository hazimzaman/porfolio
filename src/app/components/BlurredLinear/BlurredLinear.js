"use client";

const BlurredLinear = ({
  width = "969.96px",
  height = "969.96px",
  gradient = "linear-gradient(45deg, #000000, #333333)",
  blur = "119.466px",
  top = null,
  right = null,
  bottom = null,
  left = null,
  zIndex = 0,
  direction = "45deg", // Default gradient direction
  colorStart = "#000000", // Start color
  colorEnd = "#333333", // End color
}) => {
  // Build gradient from individual colors if provided, otherwise use gradient prop
  const backgroundGradient = gradient.includes("linear-gradient")
    ? gradient
    : `linear-gradient(${direction}, ${colorStart}, ${colorEnd})`;

  // Position styles
  const positionStyles = {
    position: "absolute",
    width,
    height,
    background: backgroundGradient,
    filter: `blur(${blur})`,
    zIndex,
    pointerEvents: "none", // Doesn't interfere with other elements
  };

  // Add positioning based on props
  if (top !== null) positionStyles.top = top;
  if (right !== null) positionStyles.right = right;
  if (bottom !== null) positionStyles.bottom = bottom;
  if (left !== null) positionStyles.left = left;

  return <div className="blurred-linear" style={positionStyles} />;
};

export default BlurredLinear;
