import { useEffect, useState } from "react";

export default function ImageCarousel({ images, interval = 4000, alt = "" }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, interval);
    return () => clearInterval(id);
  }, [images.length, interval]);

  return (
    <div className="w-full h-full flex items-center justify-center">
      <img
        src={images[current]}
        alt={alt}
        className="max-w-[80%] max-h-[80%] object-contain"
        draggable={false}
      />
    </div>
  );
}
