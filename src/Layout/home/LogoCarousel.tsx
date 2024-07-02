import React, { useEffect, useRef } from "react";
import Image from "next/image";

type LogoCarouselProps = {
  logos: string[];
};

const LogoCarousel: React.FC<LogoCarouselProps> = ({ logos }) => {
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    let start: number | null = null;
    let animationFrameId: number;

    const animate = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = timestamp - start;
      const speed = 0.1;
      const offset = progress * speed;

      if (carousel) {
        carousel.style.transform = `translateX(-${offset}px)`;

        const firstLogo = carousel.querySelector("div");
        if (firstLogo && offset >= firstLogo.clientWidth) {
          carousel.appendChild(firstLogo);
          start = timestamp;
          carousel.style.transform = "translateX(0)";
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrameId);
  }, [logos]);

  return (
    <div className="overflow-hidden" style={{ width: "100%" }}>
      <div
        className="flex"
        ref={carouselRef}
        style={{ display: "flex", whiteSpace: "nowrap" }}
      >
        {logos.map((logo, index) => (
          <div key={index} className="px-4 py-16 ss:py-24 md:pt-10 md:pb-0 md:px-6 flex-shrink-0">
            <Image
              src={logo}
              alt={`Logo ${index}`}
              width={100}
              height={100}
              className="w-[120px] h-auto"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default LogoCarousel;
