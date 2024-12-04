import { carouselImage, currentIndex, images } from "./BentoArea.astro.1.mts";

export function changeImage() {
  carouselImage.style.backgroundImage = 'url("${images[currentIndex]}")';
  currentIndex = (currentIndex + 1) % images.length;
}
