// Les données de l'application
const appData = {
    teams: ['None', 'Team B', 'Team C'],
    selectedTeam: 'None',
    scouterName: localStorage.getItem('scouterName') || '',
    questions: []
};

// Méthode pour générer le fichier CSV
function generateCSV() {
    // Logique pour générer le fichier CSV à partir des données
    console.log('Génération du fichier CSV...', appData);
}

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
        option.textContent = team;
        option.value = team;
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
