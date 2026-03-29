// Centralized image configuration
// Add new images to this array whenever you add new image files to /public folder

export const carouselImages = [
  '1.jpg',
  '2.jpg',
  '3.jpg',
  '4.jpg',
  '5.jpg',
  '6.jpg',
  '7.jpg',
  '8.jpg',
  '9.jpg',
  '10.jpg',
  '1.5.jpg',
  '2.5.jpg',
  '3.5.jpg',
  '4.3.jpg',
  '1.2.jpg',
];

export function getRandomImage(): string {
  return carouselImages[Math.floor(Math.random() * carouselImages.length)];
}

export function getImageByIndex(index: number): string {
  return carouselImages[index % carouselImages.length];
}

export function getTotalImages(): number {
  return carouselImages.length;
}
