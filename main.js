const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const { autoUpdater } = require('electron-updater');

let mainWindow;
let loadingWindow;

// Fonction pour créer la fenêtre de chargement
const createLoadingWindow = () => {
    console.log('Creating loading window...');
    loadingWindow = new BrowserWindow({
        width: 400,
        height: 300,
        frame: false,
        transparent: true,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    loadingWindow.loadFile('loading.html');

    loadingWindow.on('closed', () => {
        console.log('Loading window is closed.');
        loadingWindow = null;
        createMainWindow();
    });

    setTimeout(() => {
        console.log('Closing loading window after timeout...');
        loadingWindow.close();
    }, 12000);
};

const generateAndSaveSessionId = () => {
    const sessionDirectory = './admin_panel/ids';
    if (!fs.existsSync(sessionDirectory)) {
        fs.mkdirSync(sessionDirectory, { recursive: true });
    }
    const sessionFilePath = `${sessionDirectory}/session.js`;

    if (!fs.existsSync(sessionFilePath)) {
        const sessionId = uuidv4();
        fs.writeFileSync(sessionFilePath, `const SESSION_ID = '${sessionId}';\nvar userAddress = document.getElementById('userAddress');\nuserAddress.textContent = userAddress();\n\nfunction userAddress() {\n  return SESSION_ID;\n}`);
        console.log('Identifiant de session généré pour le premier démarrage :', sessionId);
    }
};

// Fonction pour créer la fenêtre principale
const createMainWindow = () => {
    console.log('Creating main window...');
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        show: false,
        icon: '9102.png',
        webPreferences: {
            preload: path.join(__dirname, 'preload.js') // Charger preload.js
        }
    });

    mainWindow.loadFile('index.html');

    mainWindow.once('ready-to-show', () => {
        console.log('Main window is ready to show.');
        mainWindow.show();
    });

    mainWindow.on('closed', () => {
        console.log('Main window is closed.');
        mainWindow = null;
    });

    const customMenu = Menu.buildFromTemplate([
        {
            label: 'Navigation',
            submenu: [
                {
                    label: 'Retour à l\'accueil',
                    click: () => {
                        mainWindow.loadFile('index.html');
                    }
                },
                { type: 'separator' },
                {
                    label: 'Recharger la page',
                    role: 'reload'
                },
            ]
        },
        {
            label: 'Application',
            submenu: [
                {
                    label: 'Réduire l\'application',
                    role: 'minimize'
                },
                { type: 'separator' },
                {
                    label: 'Quitter',
                    role: 'quit'
                },
                { type: 'separator' },
                {
                    label: 'Passer en plein écran',
                    role: 'togglefullscreen'
                },
                {
                    label: 'Developer Console',
                    role: 'toggleDevTools'
                }
            ]
        },
        {
            label: 'Informations',
            submenu: [
                {
                    label: 'FRC TEAM: 9102',
                    role: ''
                },
                { type: 'separator' },
                {
                    label: 'Scout Name: Aucun', // Initial value, to be updated
                    role: ''
                },
                {
                    label: 'Scout Zone: Inconnue',
                    role: ''
                },
                { type: 'separator' },
                {
                    label: 'État de la licence: Valide',
                    click() {
                        mainWindow.loadFile('log.html');
                    }
                },
            ]
        },
        {
            label: 'Contributions',
            submenu: [
                {
                    label: 'Accéder à la page des Contributeurs',
                    click() {
                        mainWindow.loadFile('contributors/page.html');
                    }
                }
            ]
        }
    ]);

    Menu.setApplicationMenu(customMenu);

    mainWindow.webContents.on('did-finish-load', () => {
        mainWindow.webContents.executeJavaScript('localStorage.getItem("scouterName")').then(scouterName => {
            if (scouterName) {
                customMenu.items[2].submenu.items[2].label = `Scout Name: ${scouterName}`;
                Menu.setApplicationMenu(customMenu);
            }
        });
        autoUpdater.checkForUpdatesAndNotify();  // Vérifiez les mises à jour ici
    });

    autoUpdater.on('update-available', () => {
        mainWindow.webContents.send('update_available');
    });

    autoUpdater.on('update-downloaded', () => {
        mainWindow.webContents.send('update_downloaded');
    });
};

// Appel de la fonction pour générer et enregistrer l'identifiant de session lors du premier démarrage
generateAndSaveSessionId();

app.on('ready', () => {
    console.log('Application is ready.');
    createLoadingWindow();
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        console.warn('All windows are closed. Quitting the application.');
        app.quit();
    }
});

app.on('activate', () => {
    if (mainWindow === null) {
        console.warn('Main window is null. Recreating main window.');
        createMainWindow();
    }
});

ipcMain.on('restart_app', () => {
    autoUpdater.quitAndInstall();
});
