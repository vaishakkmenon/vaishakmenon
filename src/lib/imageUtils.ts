import React from 'react';

/**
 * Handles image loading errors by hiding the image and logging the error.
 * Useful for certification badges, resume previews, and other images that may fail to load.
 *
 * @param e - The synthetic event from the image's onError handler
 *
 * @example
 * <Image
 *   src="/path/to/image.png"
 *   alt="Description"
 *   onError={handleImageError}
 * />
 */
export function handleImageError(e: React.SyntheticEvent<HTMLImageElement>): void {
  console.error(`Failed to load image: ${e.currentTarget.src}`);
  e.currentTarget.style.display = 'none';
}

/**
 * Creates an image error handler that replaces the failed image with a fallback.
 * Useful when you want to show a placeholder instead of hiding the image.
 *
 * @param fallbackSrc - Path to the fallback image
 * @returns Event handler function
 *
 * @example
 * <Image
 *   src="/path/to/image.png"
 *   alt="Description"
 *   onError={handleImageErrorWithFallback('/placeholder.png')}
 * />
 */
export function handleImageErrorWithFallback(
  fallbackSrc: string
): (e: React.SyntheticEvent<HTMLImageElement>) => void {
  return (e: React.SyntheticEvent<HTMLImageElement>) => {
    console.error(`Failed to load image: ${e.currentTarget.src}, using fallback`);
    e.currentTarget.src = fallbackSrc;
  };
}
