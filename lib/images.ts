/**
 * Image registry. Local copies live in /public/images (saved from Pexels,
 * credits in public/images/image-credits.md). Large hero and band imagery
 * is served full resolution straight from the Pexels CDN, which is why
 * next.config.ts whitelists images.pexels.com in images.remotePatterns.
 */

function pexels(id: number, width: number): string {
  return `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${width}`;
}

export const IMAGES = {
  heroSorting: {
    local: "/images/hero-sorting-dar-es-salaam.jpg",
    remote: pexels(38117883, 1920),
    alt: "A man sorting plastic bottles into recycling bins on a street in Dar es Salaam",
  },
  portraitMaasaiManNairobi: {
    local: "/images/portrait-maasai-man-nairobi.jpg",
    remote: pexels(4314678, 600),
    alt: "Portrait of a Maasai man in traditional attire in Nairobi",
  },
  portraitMaasaiManRural: {
    local: "/images/portrait-maasai-man-rural-kenya.jpg",
    remote: pexels(12125842, 600),
    alt: "Close up portrait of a Maasai man in traditional attire in rural Kenya",
  },
  portraitElderlyWoman: {
    local: "/images/portrait-elderly-woman-beads.jpg",
    remote: pexels(24374974, 600),
    alt: "Portrait of an elderly East African woman in traditional beads and headdress, smiling",
  },
  portraitMaasaiWoman: {
    local: "/images/portrait-maasai-woman-narok.jpg",
    remote: pexels(6299632, 600),
    alt: "A joyful Maasai woman wearing traditional beadwork in Narok, Kenya",
  },
  portraitUrbanMan: {
    local: "/images/portrait-urban-man-kenya.jpg",
    remote: pexels(4177652, 600),
    alt: "A young Kenyan man in a bucket hat and jacket among green foliage",
  },
  nairobiAerial: {
    remote: pexels(28977077, 1920),
    alt: "Aerial view of Nairobi cityscape in Kenya",
  },
  nairobiSkyline: {
    remote: pexels(29891537, 1920),
    alt: "Vibrant aerial shot of the Nairobi skyline with modern skyscrapers",
  },
  nairobiGreenCity: {
    remote: pexels(4242550, 1920),
    alt: "Nairobi skyline with trees and the Kenyatta International Conference Centre",
  },
  recyclingBins: {
    remote: pexels(34406294, 1200),
    alt: "Four colour coded recycling bins for paper, plastic, metal and glass",
  },
} as const;
