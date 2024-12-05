const fs = require('fs');
const path = require('path');

const view_teams = [
    { id: 296, name: 'Northern Knights' },
    { id: 2626, name: 'Evolution' },
    { id: 3015, name: 'Ranger Robotics' },
    { id: 3117, name: 'Harfangs' },
    { id: 3171, name: 'HURRICANES' },
    { id: 3360, name: 'Hyperion' },
    { id: 3532, name: 'Piranhas' },
    { id: 3533, name: 'Mekano' },
    { id: 3544, name: 'Spartiates' },
    { id: 3550, name: 'Robotronix' },
    { id: 3985, name: 'Sonic Howl' },
    { id: 3986, name: 'Express-O' },
    { id: 3990, name: 'Tech for Kids' },
    { id: 3996, name: 'RIKITIK' },
    { id: 4947, name: 'Fenix' },
    { id: 4952, name: 'Les Carnicas' },
    { id: 4955, name: 'LA Tech' },
    { id: 5439, name: 'Huskies' },
    { id: 5440, name: 'Les Chevaliers' },
    { id: 5443, name: 'Les PATenteux' },
    { id: 5528, name: 'Ultime AGT' },
    { id: 5618, name: 'PLS' },
    { id: 6540, name: 'Dynamo' },
    { id: 6622, name: 'Stan Robotix' },
    { id: 6869, name: 'Gladiateurs' },
    { id: 6929, name: 'Cuivre & Or' },
    { id: 7471, name: 'Robo Montagnards' },
    { id: 7605, name: 'ASTRO' },
    { id: 7700, name: 'West Tech Paladins' },
    { id: 8067, name: 'Alpha Lab' },
    { id: 8132, name: 'Sysmik' },
    { id: 8152, name: 'Escouade' },
    { id: 8224, name: 'Vanguard Robotics' },
    { id: 9102, name: 'CyborgBulls' },
    { id: 9234, name: 'Les aigles d\'or' },
    { id: 9406, name: 'TechJunior' },
    { id: 9624, name: 'Dynamiques' }
];


const appData = {
    teams: view_teams,
    selectedTeam: 'None',
    scouterName: localStorage.getItem('scouterName') || '',
    questions: [],
};

// Méthode pour générer le fichier CSV
function generateCSV() {
    const csvRows = [];

    // Ajouter l'en-tête
    csvRows.push(['Team Number', 'Team Name', 'Scouter Name', 'Questions and Answers']);

    console.log('Team selected:', appData.selectedTeam);

    // Filtrer et inclure uniquement l'équipe sélectionnée
    appData.teams.forEach(team => {
        console.log('Checking team:', team.id, team.name);
        if (team.id == appData.selectedTeam) {
            const row = [
                team.id, // Numéro de l'équipe
                team.name, // Nom de l'équipe
                appData.scouterName || 'Non défini', // Nom du scouteur
                JSON.stringify(appData.questions) // Liste des réponses aux questions
            ];
            csvRows.push(row);
        }
    });

    // Convertir le tableau en texte CSV
    const csvContent = csvRows.map(row => row.join(',')).join('\n');

    // Définir le dossier et le fichier
    const dirPath = path.join(require('os').homedir(), 'Documents', 'CyborgBulls-SCOUTING25');
    let baseFileName = `pit_scout_${appData.selectedTeam}`;
    let filePath = path.join(dirPath, `${baseFileName}.csv`);
    let suffix = 1;

    // Créer le dossier s'il n'existe pas
    fs.mkdir(dirPath, { recursive: true }, (err) => {
        if (err) {
            console.error('Erreur lors de la création du dossier:', err);
            return;
        }

        // Gérer les doublons
        while (fs.existsSync(filePath)) {
            filePath = path.join(dirPath, `${baseFileName}-${suffix}.csv`);
            suffix++;
        }

        // Écrire le fichier CSV
        fs.writeFile(filePath, csvContent, (err) => {
            if (err) {
                console.error('Erreur lors de l\'écriture du fichier:', err);
                return;
            }
            alert(`Fichier CSV enregistré : ${filePath}`);
        });
    });
}

{/*
    // Créer un lien pour télécharger le fichier CSV
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'scouting_data.csv';
    a.click();
    URL.revokeObjectURL(url);

    alert("Fichier CSV généré !");
}
*/}


// Fonction d'initialisation de l'application
// Fonction d'initialisation de l'application
function initializeApp() {
    const teamSelect = document.getElementById('team');
    const scouterNameInput = document.getElementById('scouter-name');
    const csvButton = document.querySelector('.csv-button');
    const selectedTeamDisplay = document.getElementById('selected-team-display');
    const questionsContainer = document.getElementById('questions-container');

    // Pré-remplir le nom du scouteur depuis localStorage
    if (appData.scouterName) {
        scouterNameInput.value = appData.scouterName;
    }

    // Initialisation de la liste des équipes
    appData.teams.forEach(team => {
        const option = document.createElement('option');
        // Utiliser le nom de l'équipe et son id comme texte et valeur
        option.textContent = `${team.id} - ${team.name}`;
        option.value = team.id; // Tu peux utiliser l'ID pour identifier l'équipe
        teamSelect.appendChild(option);
    });

    selectedTeamDisplay.textContent = appData.selectedTeam;
    teamSelect.value = appData.selectedTeam;

    teamSelect.addEventListener('change', function() {
        appData.selectedTeam = this.value;
        selectedTeamDisplay.textContent = this.value;
        console.log('Équipe sélectionnée :', appData.selectedTeam);
    });

    scouterNameInput.addEventListener('input', function() {
        appData.scouterName = this.value;
        localStorage.setItem('scouterName', this.value); // Mettre à jour le nom du scouteur dans localStorage
        console.log('Nom du scouteur :', appData.scouterName);
    });

    csvButton.addEventListener('click', generateCSV);

    questions.forEach((q, index) => {
        const questionItem = document.createElement('div');
        questionItem.className = 'question-item';

        const questionLabel = document.createElement('label');
        questionLabel.textContent = q.question;
        questionItem.appendChild(questionLabel);

        q.options.forEach(option => {
            const radioInput = document.createElement('input');
            radioInput.type = 'radio';
            radioInput.name = `question-${index}`;
            radioInput.value = option;
            radioInput.addEventListener('change', function() {
                appData.questions[index] = this.value;
                console.log(`Réponse à la question ${index + 1}: ${this.value}`);
            });

            const radioLabel = document.createElement('label');
            radioLabel.textContent = option;
            radioLabel.prepend(radioInput);

            questionItem.appendChild(radioLabel);
        });

        questionsContainer.appendChild(questionItem);
    });
}

// Appel de la fonction d'initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', initializeApp);
