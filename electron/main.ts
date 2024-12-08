import { app, BrowserWindow, desktopCapturer, ipcMain } from "electron";

import { fileURLToPath } from "node:url";
import path from "node:path";
import { Webcam } from "lucide-react";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.mjs
// │
process.env.APP_ROOT = path.join(__dirname, "..");

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
export const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
export const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
export const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
  ? path.join(process.env.APP_ROOT, "public")
  : RENDERER_DIST;

let win: BrowserWindow | null;
let studio: BrowserWindow | null;
let floatingWebcam: BrowserWindow | null;

function createWindow() {
  win = new BrowserWindow({
    width: 500,
    height: 500,
    minWidth: 300,
    minHeight: 300,
    frame: true,
    transparent: false,
    alwaysOnTop: true,
    focusable: true,
    movable: true,
    icon: path.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    webPreferences: {
      preload: path.join(__dirname, "preload.mjs"),
      nodeIntegration: false,
      contextIsolation: true,
      devTools: true,
    },
  });

  studio = new BrowserWindow({
    width: 300,
    height: 500,
    minWidth: 300,
    minHeight: 300,
    frame: true,
    transparent: false,
    alwaysOnTop: true,
    focusable: true,
    movable: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.mjs"),
      nodeIntegration: false,
      contextIsolation: true,
      devTools: true,
    },
  });

  floatingWebcam = new BrowserWindow({
    width: 500,
    height: 400,
    minWidth: 300,
    minHeight: 300,
    frame: false,
    transparent: false,
    alwaysOnTop: true,
    focusable: true,
    movable: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.mjs"),
      nodeIntegration: false,
      contextIsolation: true,
      devTools: true,
    },
  });

  // Test active push message to Renderer-process.
  win.webContents.on("did-finish-load", () => {
    win?.webContents.send("main-process-message", new Date().toLocaleString());
  });

  studio.webContents.on("did-finish-load", () => {
    studio?.webContents.send(
      "main-process-message",
      new Date().toLocaleString()
    );
  });

  win.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
  win.setAlwaysOnTop(true, "screen-saver", 1);
  studio.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
  studio.setAlwaysOnTop(true, "screen-saver", 1);

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
    studio.loadURL(`${import.meta.env.VITE_APP_URL}/studio.html`);
    floatingWebcam.loadURL(`${import.meta.env.VITE_APP_URL}/webcam.html`);
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(path.join(RENDERER_DIST, "index.html"));
    studio.loadFile(path.join(RENDERER_DIST, "studio.html"));
    floatingWebcam.loadFile(path.join(RENDERER_DIST, "webcam.html"));
  }
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
    win = null;
  }
});

ipcMain.on("closeApp", () => {
  if (process.platform !== "darwin") {
    app.quit();
    (win = null), (studio = null);
    floatingWebcam = null;
  }
});

ipcMain.handle("get-sources", async () => {
  const data = await desktopCapturer.getSources({
    thumbnailSize: { height: 100, width: 100 },
    types: ["screen", "window"],
    fetchWindowIcons: true,
  });
  console.log("🔴Displays", data);
  return data;
});

ipcMain.on("media-sources", async (event, payload) => {
  console.log(event, "media-resourced called");
  studio.webContents.send("profile-received", payload);
});

ipcMain.on("resize-studio", (event, payload) => {
  console.log("event");

  if (payload?.shrink) {
    studio?.setSize(400, 100);
  }
  if (!payload?.shrink) {
    studio?.setSize(400, 250);
  }
});

ipcMain.on("hide-plugin", (event, payload) => {
  console.log(event);

  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.whenReady().then(createWindow);
