// Les données de l'application
const appData = {
    teams: ['Team A', 'Team B', 'Team C'],
    selectedTeam: 'Team A',
    scouterComments: ''
};

// Méthode pour générer le fichier CSV
function generateCSV() {
    // Logique pour générer le fichier CSV à partir des données
    console.log('Génération du fichier CSV...');
}

// Méthode pour enregistrer les commentaires du scouteur dans un fichier texte
function saveComments() {
    // Logique pour enregistrer les commentaires dans un fichier texte
    console.log('Enregistrement des commentaires...');
}

// Fonction d'initialisation de l'application
function initializeApp() {
    // Sélection des éléments HTML
    const teamSelect = document.getElementById('team');
    const commentTextarea = document.querySelector('.scouter-comments textarea');
    const saveButton = document.querySelector('.save-button');
    const csvButton = document.querySelector('.csv-button');

    // Initialisation de la liste des équipes
    appData.teams.forEach(team => {
        const option = document.createElement('option');
        option.textContent = team;
        teamSelect.appendChild(option);
    });

    // Écouteurs d'événements pour les boutons
    saveButton.addEventListener('click', saveComments);
    csvButton.addEventListener('click', generateCSV);

    // Écouteur d'événement pour la sélection de l'équipe
    teamSelect.addEventListener('change', function() {
        appData.selectedTeam = this.value;
        console.log('Équipe sélectionnée :', appData.selectedTeam);
    });

    // Écouteur d'événement pour les commentaires du scouteur
    commentTextarea.addEventListener('input', function() {
        appData.scouterComments = this.value;
        console.log('Commentaires du scouteur :', appData.scouterComments);
    });
}

// Appel de la fonction d'initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', initializeApp);
