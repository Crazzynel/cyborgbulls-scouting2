// index.js

// Fonction pour enregistrer le nom du scouteur
function saveScouterName() {
    const scouterName = document.getElementById('scouterName').value;
    if (scouterName) {
        localStorage.setItem('scouterName', scouterName);
        alert('Nom du scouteur enregistré!');
    } else {
        alert('Veuillez entrer un nom.');
    }
}

// Fonction pour pré-remplir le nom du scouteur
function prefillScouterName() {
    const savedName = localStorage.getItem('scouterName');
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

document.addEventListener('DOMContentLoaded', () => {
    const updatePopup = document.getElementById('update-popup');
    const popupOkButton = document.getElementById('popup-ok-button');
    const popupOkNeverButton = document.getElementById('popup-ok-never-button');
  
    // Afficher la popup de mise à jour
    const showUpdatePopup = () => {
      updatePopup.style.display = 'block';
    };
  
    // Fermer la popup
    const closeUpdatePopup = () => {
      updatePopup.style.display = 'none';
    };
  
    // Gérer l'événement 'update_available'
    window.electron.ipcRenderer.on('update_available', () => {
      showUpdatePopup();
    });
  
    // Gérer le clic sur le bouton 'OK'
    popupOkButton.addEventListener('click', closeUpdatePopup);
  
    // Gérer le clic sur le bouton 'OK, ne plus voir jusqu'à la prochaine maj'
    popupOkNeverButton.addEventListener('click', () => {
      localStorage.setItem('hideUpdatePopup', true);
      closeUpdatePopup();
    });
  
    // Afficher la popup si 'hideUpdatePopup' n'est pas défini
    const hideUpdatePopup = localStorage.getItem('hideUpdatePopup');
    if (!hideUpdatePopup) {
      showUpdatePopup();
    }
  });
  