"use client";

const BlurredEllipse = ({
  width = "969.96px",
  height = "969.96px",
  background = "#000000",
  blur = "119.466px",
  top = null,
  right = null,
  bottom = null,
  left = null,
  zIndex = 0,
}) => {
  // Position styles
  const positionStyles = {
    position: "absolute",
    width,
    height,
    background,
    filter: `blur(${blur})`,
    borderRadius: "50%", // Makes it elliptical/circular
    zIndex,
    pointerEvents: "none", // Doesn't interfere with other elements
  };

  // Add positioning based on props
  if (top !== null) positionStyles.top = top;
  if (right !== null) positionStyles.right = right;
  if (bottom !== null) positionStyles.bottom = bottom;
  if (left !== null) positionStyles.left = left;

  return <div className="blurred-ellipse" style={positionStyles} />;
};

export default BlurredEllipse;
