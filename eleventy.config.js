import { eleventyImageTransformPlugin } from '@11ty/eleventy-img';
import { galleryShortcode, galleryImageShortcode } from './gallery.js';
import { heroImageShortcode } from './hero-image.js';

export default async function(eleventyConfig) {
	eleventyConfig.addPlugin(eleventyImageTransformPlugin);
	// Gallery
    eleventyConfig.addPairedShortcode("gallery", galleryShortcode);
	eleventyConfig.addShortcode("galleryImg", galleryImageShortcode);
	eleventyConfig.addShortcode("heroImg", heroImageShortcode);
	eleventyConfig.addPassthroughCopy("src/css");
	eleventyConfig.addPassthroughCopy("src/img");
	eleventyConfig.addPassthroughCopy("src/fonts");
	eleventyConfig.addPassthroughCopy({
		"./node_modules/photoswipe/dist/photoswipe-lightbox.esm.min.js":
			"/js/photoswipe/photoswipe-lightbox.esm.min.js",
		"./node_modules/photoswipe/dist/photoswipe.esm.min.js":
			"/js/photoswipe/photoswipe.esm.min.js",
		"./node_modules/photoswipe/dist/photoswipe.css":
		  "/css/photoswipe/photoswipe.css",
	});
};

export const config = {
    dir: {
        input: "src"
    },
    liveReload: true,
}