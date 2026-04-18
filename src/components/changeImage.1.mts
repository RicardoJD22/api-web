import { carouselImage, images } from "./BentoArea.astro.mts";

let currentIndex = 0;

export function changeImage() {
  carouselImage.style.backgroundImage = `url("${images[currentIndex]}")`;
  currentIndex = (currentIndex + 1) % images.length;
}
