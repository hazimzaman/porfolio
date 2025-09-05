"use client";

import Image from "next/image";

const BlobComposition = ({
  imageSrc = "/leg.svg",
  imageAlt = "decorative illustration",
  imageWidth = 460,
  imageHeight = 777,
  className = "",
}) => {
  return (
    <div className={`blob-container ${className}`}>
      <div className="blob-composition">
      <Image
          src={imageSrc}
          className="blob-composition__image"
          alt={imageAlt}
          width={imageWidth}
          height={imageHeight}
        />
        <div className="blob-shape--primary"></div>
        <div className="blob-shape--secondary"></div>
        <div className="blob-shape--tertiary"></div>
        <div className="blob-shape--quaternary"></div>

       

        <div className="blob-shape--overlay"></div>
      </div>
    </div>
  );
};

export default BlobComposition;
