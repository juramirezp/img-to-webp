const { ipcRenderer } = require("electron");

const imageInput = document.getElementById("files");
const convertBtn = document.getElementById("convert-btn");
const openFolderBtn = document.getElementById("openFolder");
const selectFolderBtn = document.getElementById("selectFolder");

convertBtn.addEventListener("click", () => {
	for (let i = 0; i < imageInput.files.length; i++) {
		console.log(imageInput.files[i]);
		let imagePath = imageInput.files[i].path;
		ipcRenderer.send("convert", imagePath, destinyFilesPath, qualityForConvertion);
	}
});

ipcRenderer.on("conversion-completed", (event, convertedImagePath) => {
	// Realizar acciones con la imagen convertida, como mostrarla en la interfaz de usuario.
	console.log("Imagen convertida:", convertedImagePath);
	imagesList.forEach((img) => {
		if (img.path.includes(convertedImagePath.fileName)) {
			img.statusConverter = "complete";
			img.finalSize = convertedImagePath.size;
			img.finalPath = convertedImagePath.finalPath;
			console.log(convertedImagePath.finalPath);
		}
	});
	renderImages();
});

ipcRenderer.on("error", (event, errorMessage) => {
	// Manejar el error de conversión, como mostrar un mensaje de error al usuario.
	console.error("Error de conversión:", errorMessage);
	showErrors(errorMessage);
});

selectFolderBtn.addEventListener("click", () => {
	ipcRenderer.send("selectFolder");
});
ipcRenderer.on("folder-selected", (event, folderPath) => {
	setDestinyFilesPath(folderPath.filePaths[0]);
});

openFolderBtn.addEventListener("click", () => {
	ipcRenderer.send("openFolder", destinyFilesPath);
});
ipcRenderer.on("folder-opened", (event, result) => {
	console.log("abierta");
});

ipcRenderer.on("file-opened", (event, data) => {
	console.log(data);
});
