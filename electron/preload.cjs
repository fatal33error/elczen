const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  isElectron: true,
  platform: process.platform,
  printDocument: (options) => ipcRenderer.invoke('electron:print', options),
  openDataFolder: () => ipcRenderer.invoke('electron:open-data-folder'),
  backupDatabase: () => ipcRenderer.invoke('electron:backup-db'),
});
