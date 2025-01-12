const fs = require('fs');
const axios = require('axios');
const path = require('path');
const { dialog, BrowserWindow } = require('electron');

// Mode Debug pour tester sans lancer d'upload
const DEBUG_MODE = false;

// Récupérer le chemin d'accès complet du dossier dans les Documents
const userDocumentsPath = process.env.USERPROFILE || process.env.HOMEPATH; // Pour Windows
const folderPath = path.join(userDocumentsPath, 'Documents', 'CyborgBulls-SCOUTING25');

// Récupérer le token GitHub depuis un fichier tokens.json
let GITHUB_TOKEN;
try {
    const tokens = JSON.parse(fs.readFileSync(path.join(__dirname, 'tokens.json'), 'utf8'));
    GITHUB_TOKEN = tokens.github_token;
} catch (error) {
    dialog.showErrorBox('Erreur', 'Le fichier tokens.json est introuvable ou invalide. Ajoutez un fichier tokens.json avec le token GitHub.');
    process.exit(1); // Arrête l'exécution si le token n'est pas récupérable
}

const REPO_OWNER = 'Team-9102-CyborgBulls';
const REPO_NAME = 'scouting-csv';

const uploadFiles = async () => {
    try {
        if (DEBUG_MODE) console.log("Mode debug activé : Aucun fichier ne sera envoyé à GitHub.");

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

        // Créer une fenêtre de progression
        let progressWindow = new BrowserWindow({
            width: 500,
            height: 400,
            resizable: true,
            frame: true,
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: false,
            }
        });

        progressWindow.loadFile('admin_panel/github/progress.html'); // Assurez-vous que ce fichier existe
        progressWindow.once('ready-to-show', () => {
            progressWindow.show();
        });

        // Boucler sur chaque fichier CSV et l'upload vers GitHub
        for (let i = 0; i < files.length; i++) {
            let filePath = path.join(folderPath, files[i]);
            const fileContent = fs.readFileSync(filePath, 'utf8');
            const contentBase64 = Buffer.from(fileContent).toString('base64');

            const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${files[i]}`;
            let sha = null;

            try {
                const getFileResponse = await axios.get(url, {
                    headers: { 'Authorization': `token ${GITHUB_TOKEN}` }
                });
                sha = getFileResponse.data.sha;
            } catch {
                if (DEBUG_MODE) console.log(`Fichier ${files[i]} introuvable sur le dépôt. Il sera créé.`);
            }

            if (!DEBUG_MODE) {
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
            }

            if (DEBUG_MODE) {
                console.log(`DEBUG : Fichier ${files[i]} traité.`);
            } else {
                progressWindow.webContents.executeJavaScript(`updateProgress(${((i + 1) / files.length) * 100});`);
            }
        }

        progressWindow.close();
        dialog.showMessageBox({ message: 'Tous les fichiers ont été téléchargés avec succès !' });
    } catch (error) {
        console.error('Erreur lors de l\'upload des fichiers :', error);
        dialog.showErrorBox('Erreur', 'Une erreur est survenue lors de l\'upload des fichiers.');
    }
};

module.exports = { uploadFiles };
