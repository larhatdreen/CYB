import React from 'react';
import './ImageOverlay.css';

const ImageOverlay = ({ overlayImageSrc, maskImageSrc }) => {
  return (
    <div className="image-container">
      <div
        className="overlay-image"
        style={{
          backgroundImage: `url(${overlayImageSrc})`,
          maskImage: `url(${maskImageSrc})`,
          WebkitMaskImage: `url(${maskImageSrc})`,
        }}
      ></div>
    </div>
  );
};

export default ImageOverlay;