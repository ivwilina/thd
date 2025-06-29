import React, { useState, useEffect } from 'react';

const ImageWithFallback = ({
  src,
  fallbackSrc,
  alt,
  className,
  style,
  ...props
}) => {
  const [imageSrc, setImageSrc] = useState(src);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setImageSrc(src);
    setIsLoading(true);
    setHasError(false);
  }, [src]);

  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
    if (imageSrc !== fallbackSrc) {
      setImageSrc(fallbackSrc);
    }
  };

  return (
    <div 
      className={`image-container ${className || ''}`}
      style={style}
    >
      {isLoading && (
        <div className="image-loading">
          Đang tải...
        </div>
      )}
      
      <img
        src={imageSrc}
        alt={alt}
        onLoad={handleLoad}
        onError={handleError}
        style={{
          opacity: isLoading ? 0 : 1
        }}
        {...props}
      />
      
      {hasError && imageSrc === fallbackSrc && (
        <div className="image-error">
          Không thể tải ảnh
        </div>
      )}
    </div>
  );
};

export default ImageWithFallback;
