// preload.js
const { contextBridge, ipcRenderer } = require('electron');
const Store = require('electron-store');
const store = new Store();

contextBridge.exposeInMainWorld('electronStore', {
    set: (key, value) => store.set(key, value),
    get: (key, defaultValue) => store.get(key, defaultValue)
});
