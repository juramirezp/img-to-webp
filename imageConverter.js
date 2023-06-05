const sharp = require("sharp");

const convertImage = (filePath, fileName, destinyFilesPath, qualityForConvertion) => {
	let finalFilePath = `${destinyFilesPath}/${fileName}-${Date.now()}-${Math.floor(Math.random() * 100)}.webp`;
	return (
		sharp(filePath)
			// .resize(1000)
			.webp({ quality: qualityForConvertion })
			.toFile(finalFilePath)
			.then((info) => {
				const { size } = info;
				const finalPath = finalFilePath;
				return { filePath, fileName, size, finalPath };
			})
	);
};

module.exports = {
	convertImage,
};
