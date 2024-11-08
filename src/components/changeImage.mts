import { carouselImage, images, currentIndex } from "./BentoArea.astro.0.mts";

export function changeImage() {
carouselImage.style.backgroundImage = `url('${images[currentIndex]}')`;
currentIndex = (currentIndex + 1) % images.length;
}
