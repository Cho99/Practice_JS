var url = "https://www.instagram.com/_mangokhongphaixoainhe/";

const puppeteer = require('puppeteer');
const fs = require('fs');
const downloader = require('image-downloader');

function getLargeImageFromSrcSet(srcSet) {
	const splitedSrcs = srcSet.split(',');
	const imgSrc = splitedSrcs[splitedSrcs.length - 1].split(' ')[0];
	return imgSrc;
}

async function getImagesFromPage(url) {
	const browser = await puppeteer.launch();
	const page = await browser.newPage();
	await page.goto(url);

	const imageSrcSets = await page.evaluate(() => {
		const imgs = Array.from(document.querySelectorAll('article img'));
		const srcSetAttribute = imgs.map(i => i.getAttribute('srcset'));
		return srcSetAttribute;
	})
	const imgUrls = imageSrcSets.map(srcSet => getLargeImageFromSrcSet(srcSet));
	await browser.close();
	return imgUrls;
}

async function main(url) {
	const resultFoler = './result';
	if(!fs.existsSync(resultFoler)) {
		fs.mkdirSync(resultFoler);
	}

	const images = await getImagesFromPage(url);

	images.forEach((image) => {
			downloader({
			url: image,
			dest: resultFoler
		})
	})
}

main(url);