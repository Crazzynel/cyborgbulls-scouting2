const fs = require('fs');
const axios = require('axios');
const path = require('path');
const { dialog, BrowserWindow } = require('electron');

// Récupérer le chemin d'accès complet du dossier dans les Documents
const userDocumentsPath = process.env.USERPROFILE || process.env.HOMEPATH; // En fonction du système (Windows)
const folderPath = path.join(userDocumentsPath, 'Documents', 'CyborgBulls Scouting Data');

// Token d'accès personnel GitHub, à ne pas inclure dans le code source (utiliser une variable d'environnement si possible)
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || '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'; // Assurez-vous que le token est dans une variable d'environnement sécurisée
const REPO_OWNER = 'Team-9102-CyborgBulls';
const REPO_NAME = 'scouting-csv';

const uploadFiles = async () => {
    try {
        // Vérifier si le dossier existe
        if (!fs.existsSync(folderPath)) {
            dialog.showErrorBox('Erreur', 'Le dossier spécifié n\'existe pas.');
            return;
        }

        // Récupérer tous les fichiers CSV dans le dossier
        const files = fs.readdirSync(folderPath).filter(file => file.endsWith('.csv'));

        if (files.length === 0) {
            dialog.showErrorBox('Erreur', 'Aucun fichier CSV trouvé dans le dossier.');
            return;
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

        // Boucler sur chaque fichier CSV et l'upload vers GitHub
        for (let i = 0; i < files.length; i++) {
            let filePath = path.join(folderPath, files[i]);

            // Lire le contenu du fichier CSV et l'encoder en base64
            const fileContent = fs.readFileSync(filePath, 'utf8');
            const contentBase64 = Buffer.from(fileContent).toString('base64');

            // URL pour l'API GitHub pour mettre à jour le fichier
            const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${files[i]}`;

            // Vérifier si le fichier existe déjà pour obtenir son SHA (nécessaire pour la mise à jour)
            const getFileResponse = await axios.get(url, {
                headers: { 'Authorization': `token ${GITHUB_TOKEN}` }
            }).catch(() => null);

            let sha = getFileResponse ? getFileResponse.data.sha : null;

            // Effectuer la requête PUT pour uploader ou mettre à jour le fichier
            await axios.put(url, {
                message: `Upload du fichier ${files[i]}`,
                content: contentBase64,
                sha: sha
            }, {
                headers: {
                    'Authorization': `token ${GITHUB_TOKEN}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            });

            // Mettre à jour la barre de progression
            progressWindow.webContents.executeJavaScript(`updateProgress(${((i + 1) / files.length) * 100});`);
        }

        progressWindow.close();
        dialog.showMessageBox({ message: 'Tous les fichiers ont été téléchargés avec succès !' });
    } catch (error) {
        console.error('Erreur lors de l\'upload des fichiers :', error);
        dialog.showErrorBox('Erreur', 'Une erreur est survenue lors de l\'upload des fichiers.');
    }
};

module.exports = { uploadFiles };
