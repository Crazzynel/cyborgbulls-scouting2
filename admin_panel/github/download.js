const fs = require('fs');
const axios = require('axios');
const path = require('path');
const { dialog, BrowserWindow } = require('electron');

// Récupérer le chemin d'accès complet du dossier dans les Documents
const userDocumentsPath = process.env.USERPROFILE || process.env.HOMEPATH; // En fonction du système (Windows)
const folderPath = path.join(userDocumentsPath, 'Documents', 'CyborgBulls-SCOUTING25');

const REPO_OWNER = 'Team-9102-CyborgBulls';
const REPO_NAME = 'scouting-csv';

// Lire le token GitHub à partir de tokens.json
const getGitHubToken = () => {
    try {
        const tokens = JSON.parse(fs.readFileSync(path.join(__dirname, 'tokens.json'), 'utf8'));
        return tokens.github_token; // Assure-toi que le fichier JSON contient une clé github_token
    } catch (error) {
        dialog.showErrorBox('Erreur', 'Le fichier tokens.json est introuvable ou invalide.');
        return null;
    }
};

const downloadFiles = async () => {
    try {
        // Vérifier si le dossier de destination existe, sinon le créer
        if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath);
        }

        // Afficher la barre de progression
        let progressWindow = new BrowserWindow({
            width: 400,
            height: 300,
            frame: false,
            transparent: true,
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: false
            }
        });

        progressWindow.loadFile('admin_panel/github/progress.html');
        progressWindow.once('ready-to-show', () => {
            progressWindow.show();
        });

        // Récupérer le token GitHub
        const GITHUB_TOKEN = getGitHubToken();
        if (!GITHUB_TOKEN) return; // Si le token est absent, on arrête le processus

        // Récupérer la liste des fichiers du dépôt GitHub
        const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/`;
        const response = await axios.get(url, {
            headers: { 'Authorization': `token ${GITHUB_TOKEN}` }
        });

        // Filtrer uniquement les fichiers CSV
        const files = response.data.filter(file => file.name.endsWith('.csv'));

        if (files.length === 0) {
            dialog.showErrorBox('Erreur', 'Aucun fichier CSV trouvé dans le dépôt.');
            return;
        }

        // Boucler sur chaque fichier CSV et le télécharger
        for (let i = 0; i < files.length; i++) {
            let fileUrl = files[i].download_url;
            let filePath = path.join(folderPath, files[i].name);

            // Vérifier si le fichier existe déjà
            if (fs.existsSync(filePath)) {
                console.log(`Le fichier ${files[i].name} existe déjà, il ne sera pas téléchargé.`);
                continue; // Passer au fichier suivant si le fichier existe déjà
            }

            // Télécharger le fichier CSV
            const fileContent = await axios.get(fileUrl, { responseType: 'arraybuffer' });

            // Sauvegarder le fichier dans le dossier local
            fs.writeFileSync(filePath, fileContent.data);
            console.log(`Le fichier ${files[i].name} a été téléchargé.`);

            // Mettre à jour la barre de progression
            progressWindow.webContents.executeJavaScript(`updateProgress(${((i + 1) / files.length) * 100});`);
        }

        progressWindow.close();
        dialog.showMessageBox({ message: 'Tous les fichiers ont été téléchargés avec succès !' });
    } catch (error) {
        console.error('Erreur lors du téléchargement des fichiers :', error);
        dialog.showErrorBox('Erreur', 'Une erreur est survenue lors du téléchargement des fichiers.');
    }
};

module.exports = { downloadFiles };
