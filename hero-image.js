// Generates a responsive, progressively-loading hero image.
// Produces a webp/jpeg srcset via @11ty/eleventy-img, plus a tiny
// blurred base64 placeholder (inlined, no extra request) that shows
// immediately behind the <img> while the full image downloads, so
// there's no flash of alt text / blank space on slow connections.
import Image from "@11ty/eleventy-img";
import { Util } from "@11ty/eleventy-img";
import sharp from "sharp";

const WIDTHS = [640, 1280, 1920, 2480];
const PLACEHOLDER_WIDTH = 24;

async function heroImageShortcode(src, alt, className = "") {
	const normalizedSrc = Util.normalizeImageSource(
		{
			input: this.eleventy.directories.input,
			inputPath: this.page.inputPath,
		},
		src,
	);

	const options = {
		formats: ["webp", "jpeg"],
		widths: WIDTHS,
		urlPath: "/img/",
		outputDir: this.eleventy.directories.output + "/img/",
		sharpJpegOptions: { progressive: true, quality: 80 },
	};

	const metadata = await Image(normalizedSrc, options);

	const placeholderBuffer = await sharp(normalizedSrc)
		.resize(PLACEHOLDER_WIDTH)
		.jpeg({ quality: 40 })
		.toBuffer();
	const placeholderUri = `data:image/jpeg;base64,${placeholderBuffer.toString("base64")}`;

	const largestJpeg = metadata.jpeg[metadata.jpeg.length - 1];
	const webpSrcset = metadata.webp.map((e) => `${e.url} ${e.width}w`).join(", ");
	const jpegSrcset = metadata.jpeg.map((e) => `${e.url} ${e.width}w`).join(", ");

	return `
		<picture>
			<source type="image/webp" srcset="${webpSrcset}" sizes="100vw">
			<img
				src="${largestJpeg.url}"
				srcset="${jpegSrcset}"
				sizes="100vw"
				width="${largestJpeg.width}"
				height="${largestJpeg.height}"
				alt="${alt}"
				class="${className}"
				style="background-image:url('${placeholderUri}');background-size:cover;background-position:right center;"
				fetchpriority="high"
				decoding="async"
				eleventy:ignore
			/>
		</picture>
	`.replace(/(\r\n|\n|\r)/gm, "");
}

export { heroImageShortcode };
