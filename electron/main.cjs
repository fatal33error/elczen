const { app, BrowserWindow, ipcMain, shell, dialog, Menu } = require('electron');
const path = require('path');
const fs = require('fs');
const http = require('http');
const { spawn } = require('child_process');

let mainWindow = null;
let mobileWindow = null;
let serverProcess = null;
const PORT = 4000;
const ROOT_DIR = path.resolve(__dirname, '..');
const SERVER_ROOT = app.isPackaged ? path.join(process.resourcesPath, 'app-runtime') : ROOT_DIR;
const NODE_BIN = app.isPackaged ? path.join(process.resourcesPath, 'node-bin', 'node.exe') : 'node';
const DATA_DIR = app.isPackaged
  ? path.join(app.getPath('userData'), 'data')
  : path.join(ROOT_DIR, 'data');

function openMobilePreviewWindow() {
  if (mobileWindow && !mobileWindow.isDestroyed()) {
    mobileWindow.show();
    mobileWindow.focus();
    return;
  }
  mobileWindow = new BrowserWindow({
    width: 440,
    height: 840,
    minWidth: 375,
    minHeight: 660,
    title: 'ELECTROZEN Mobile — Scanner, Prix & POS (Aperçu Android / Flutter)',
    icon: path.join(SERVER_ROOT, 'public', 'assets', 'electrozen-icon.png'),
    backgroundColor: '#f7f8fa',
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });
  mobileWindow.loadURL(`http://127.0.0.1:${PORT}/mobile`);
}

function checkServerReady(port) {
  return new Promise((resolve) => {
    const req = http.get(`http://127.0.0.1:${port}/api/network-info`, (res) => {
      res.resume();
      resolve(res.statusCode === 200);
    });
    req.on('error', () => resolve(false));
    req.setTimeout(600, () => {
      req.destroy();
      resolve(false);
    });
  });
}

async function ensureLocalServer() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  const destDb = path.join(DATA_DIR, 'electromanager.sqlite');
  if (!fs.existsSync(destDb)) {
    const seedDb = path.join(SERVER_ROOT, 'data', 'electromanager.sqlite');
    if (fs.existsSync(seedDb)) {
      try {
        fs.copyFileSync(seedDb, destDb);
      } catch (err) {
        console.error('Failed to copy seed database:', err);
      }
    }
  }

  const alreadyUp = await checkServerReady(PORT);
  if (alreadyUp) return true;

  const serverScript = path.join(SERVER_ROOT, 'server', 'index.ts');
  const cleanEnv = { ...process.env, ELECTROZEN_DATA_DIR: DATA_DIR };
  delete cleanEnv.NODE_OPTIONS;

  serverProcess = spawn(NODE_BIN, ['--use-system-ca', serverScript], {
    cwd: SERVER_ROOT,
    env: cleanEnv,
    shell: false,
    windowsHide: true,
    stdio: 'ignore',
  });

  for (let i = 0; i < 80; i++) {
    const ready = await checkServerReady(PORT);
    if (ready) return true;
    await new Promise((r) => setTimeout(r, 250));
  }
  return false;
}

function buildAppMenu() {
  const template = [
    {
      label: 'Fichier',
      submenu: [
        {
          label: 'Ouvrir le dossier Base de Données (SQLite)',
          click: () => {
            shell.openPath(DATA_DIR);
          },
        },
        {
          label: 'Ouvrir le Terminal Mobile ELECTROZEN (Aperçu Téléphone)',
          click: () => {
            openMobilePreviewWindow();
          },
        },
        { type: 'separator' },
        { role: 'quit', label: 'Quitter' },
      ],
    },
    {
      label: 'Affichage',
      submenu: [
        { role: 'reload', label: 'Actualiser (Ctrl+R)' },
        { role: 'togglefullscreen', label: 'Plein Écran (F11)' },
        { type: 'separator' },
        { role: 'resetZoom', label: 'Taille Réelle' },
        { role: 'zoomIn', label: 'Zoom +' },
        { role: 'zoomOut', label: 'Zoom -' },
        { type: 'separator' },
        { role: 'toggleDevTools', label: 'Outils de Développement' },
      ],
    },
  ];
  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

async function createWindow() {
  buildAppMenu();

  mainWindow = new BrowserWindow({
    width: 1460,
    height: 920,
    minWidth: 1120,
    minHeight: 720,
    title: 'ELECTROZEN — Gestion Commerciale & POS (Windows)',
    icon: path.join(SERVER_ROOT, 'public', 'assets', 'electrozen-icon.png'),
    backgroundColor: '#f7f8fa',
    show: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.cjs'),
    },
  });

  mainWindow.setAlwaysOnTop(true);
  mainWindow.show();
  mainWindow.focus();
  setTimeout(() => {
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.setAlwaysOnTop(false);
    }
  }, 1500);

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.includes('/mobile')) {
      openMobilePreviewWindow();
      return { action: 'deny' };
    }
    shell.openExternal(url);
    return { action: 'deny' };
  });

  await ensureLocalServer();
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.loadURL(`http://127.0.0.1:${PORT}`);
  }
}

ipcMain.handle('electron:print', async () => {
  if (!mainWindow) return { success: false };
  mainWindow.webContents.print({ silent: false, printBackground: true });
  return { success: true };
});

ipcMain.handle('electron:open-data-folder', async () => {
  await shell.openPath(DATA_DIR);
  return { success: true, path: DATA_DIR };
});

ipcMain.handle('electron:backup-db', async () => {
  const srcPath = path.join(DATA_DIR, 'electromanager.sqlite');
  const defaultName = `electrozen-${new Date().toISOString().slice(0, 10)}.sqlite`;
  const { canceled, filePath } = await dialog.showSaveDialog(mainWindow, {
    title: 'Sauvegarder la base de données SQLite',
    defaultPath: defaultName,
    filters: [{ name: 'SQLite Database', extensions: ['sqlite', 'db'] }],
  });
  if (canceled || !filePath) return { canceled: true };
  fs.copyFileSync(srcPath, filePath);
  return { success: true, filePath };
});

app.whenReady().then(() => {
  createWindow();
});

app.on('window-all-closed', () => {
  if (serverProcess) {
    try {
      serverProcess.kill();
    } catch {}
  }
  if (process.platform !== 'darwin') app.quit();
});
