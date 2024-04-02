const { app, BrowserWindow, Menu } = require('electron');
let mainWindow;
let loadingWindow; // Déclaration de la fenêtre de chargement

// Ce code est fourni sans licence. Ce qui exprime l'acces libre au code a tous les utilisateurs.
// Nous commentons le code pour faciliter les comprehensions. 

// Fonction pour créer la fenêtre de chargement
const createLoadingWindow = () => {
    console.log('Creating loading window...'); // Message de création de la fenêtre de chargement
    loadingWindow = new BrowserWindow({
        width: 400,
        height: 300,
        frame: false,
        transparent: true,
        webPreferences: {
            nodeIntegration: true,
            frame: false,
        }
    });

    loadingWindow.loadFile('loading.html');

    loadingWindow.on('closed', () => {
        console.log('Loading window is closed.'); // Message indiquant que la fenêtre de chargement est fermée
        loadingWindow = null;
        createMainWindow();
    });

    setTimeout(() => {
        console.log('Closing loading window after timeout...'); // Message indiquant que la fenêtre de chargement se ferme après un délai
        loadingWindow.close();
    }, 12000);
};

// Fonction pour créer la fenêtre principale
const createMainWindow = () => {
    console.log('Creating main window...');
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        show: false,
        icon: '9102.png'
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
                        console.log('Navigating back to home page...');
                        mainWindow.loadFile('./index.html');
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
                { type: 'separator'},
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
                    label:'Developer Console',
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
                { type: 'separator'},
                {
                    label:  'Scout Name: Aucun',
                    role: ''
                },
                {
                    label: 'Scout Zone: Inconnue' ,
                    role: ''
                },
                { type: 'separator'},
                {
                    label:  'État de la licence: Invalide',
                    role: ''
                },
            ]
        }
    ]);

    Menu.setApplicationMenu(customMenu);
};

app.on('ready', () => {
    console.log('Application is ready.');
    createLoadingWindow(); // Appel de la fonction pour créer la fenêtre de chargement
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
