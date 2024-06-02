// index.js

// Fonction pour enregistrer le nom du scouteur
function saveScouterName() {
    const scouterName = document.getElementById('scouterName').value;
    if (scouterName) {
        window.electronStore.set('scouterName', scouterName);
        alert('Nom du scouteur enregistré!');
    } else {
        alert('Veuillez entrer un nom.');
    }
}

// Fonction pour pré-remplir le nom du scouteur
function prefillScouterName() {
    const savedName = window.electronStore.get('scouterName', '');
    if (savedName) {
        document.getElementById('scouterName').value = savedName;
    }
}

// Fonctions de navigation
function navigateToPitScouting() {
    console.log('Navigating to Pit Scouting');
    window.location.href = "./execute_scout/pit/page.html";
}

function navigateToMatchScouting() {
    console.log('Navigating to Match Scouting');
    window.location.href = "./execute_scout/match/test.html";
}

function redirectToAdminLog() {
    window.location.href = './admin_panel/logger.html';
    console.log("Redirection Effectuée à partir de la page d'accueil.");
}

document.addEventListener('DOMContentLoaded', prefillScouterName);
