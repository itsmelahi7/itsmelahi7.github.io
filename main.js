const { app, BrowserWindow, ipcMain } = require("electron");
const { selectAndCopyImage } = require("./imageUtils");

function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true, // Enable Node.js integration
        },
    });

    win.loadFile("index.html");
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
});

// Handle the event from the renderer process and call the function
ipcMain.on("select-and-copy-image", () => {
    selectAndCopyImage();
});
