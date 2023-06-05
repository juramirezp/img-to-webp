const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const path = require("path");
const { convertImage } = require("../imageConverter");
const { shell } = require("electron");

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
	app.quit();
}

const createWindow = () => {
	// Create the browser window.
	const mainWindow = new BrowserWindow({
		width: 1200,
		height: 900,
		webPreferences: {
			nodeIntegration: true,
			contextIsolation: false,
			enableRemoteModule: true,
		},
	});

	// and load the index.html of the app.
	mainWindow.loadFile(path.join(__dirname, "index.html"));

	// Open the DevTools.
	// mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
	if (process.platform !== "darwin") {
		app.quit();
	}
});

app.on("activate", () => {
	// On OS X it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	if (BrowserWindow.getAllWindows().length === 0) {
		createWindow();
	}
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

ipcMain.on("convert", (event, imagePath, destinyFilesPath, qualityForConvertion) => {
	let fileName = imagePath.split("/");
	fileName = fileName[fileName.length - 1];
	fileName = fileName.split(".")[0];

	convertImage(imagePath, fileName, destinyFilesPath, qualityForConvertion)
		.then((convertedImagePath) => {
			// shell.showItemInFolder(convertedImagePath);
			event.reply("conversion-completed", convertedImagePath);
		})
		.catch((err) => {
			event.reply("error", err);
		});
});

ipcMain.on("openFolder", (event, destinyFilesPath) => {
	shell
		.openPath(destinyFilesPath)
		.then((result) => {
			event.reply("folder-opened", result);
		})
		.catch((err) => {
			event.reply("error", err);
		});
});

ipcMain.on("openFileInFolder", (event, filePath) => {
	shell.showItemInFolder(filePath);
	// .then((result) => {
	// 	event.reply("file-opened", result);
	// })
	// .catch((err) => {
	// 	event.reply("error", err);
	// });
});

ipcMain.on("selectFolder", (event) => {
	dialog
		.showOpenDialog({
			properties: ["openDirectory"],
		})
		.then((result) => {
			event.reply("folder-selected", result);
		})
		.catch((err) => {
			event.reply("error", err);
		});
});
