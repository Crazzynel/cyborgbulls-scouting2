const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    on: (channel, func) => {
      ipcRenderer.on(channel, (event, ...args) => func(...args));
    },
    send: (channel, data) => {
      ipcRenderer.send(channel, data);
    },
    invoke: (channel, data) => {
      return ipcRenderer.invoke(channel, data);
    }
  },
  readLogFile: async () => {
    return ipcRenderer.invoke('read-log-file');
  }
});
