const axios = require('axios');

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

// Vérification des mises à jour
async function checkForUpdates() {
    const localVersion = 'scouting_v.1.6.0_stable'; // Version locale
    const githubApiUrl = 'https://api.github.com/repos/crazzynel/cyborgbulls-scouting2/releases/latest'; // URL API GitHub
  
    console.log('Début de la vérification des mises à jour...');
  
    try {
      const response = await axios.get(githubApiUrl);
      console.log('Réponse API reçue :', response); // Affichage de la réponse complète pour déboguer
  
      if (response.status === 200) {
        const remoteVersion = response.data.tag_name; // Version distante
        console.log('Version distante :', remoteVersion); // Affichage de la version distante
  
        if (remoteVersion !== localVersion) {
          console.log('Une mise à jour est disponible !');
          const updateBanner = document.getElementById('update-banner');
          if (updateBanner) {
            updateBanner.style.display = 'flex';
            
          } else {
            console.error('Élément de la bannière non trouvé.');
          }
        } else {
          console.log('Votre application est à jour.');
        }
      } else {
        console.error('Erreur lors de la récupération des informations de la version. Code HTTP :', response.status);
      }
    } catch (error) {
      console.error('Erreur lors de la vérification des mises à jour :', error.message);
    }
  }
  
  // Lancer la vérification une fois la page complètement chargée
  document.addEventListener('DOMContentLoaded', () => {
    console.log('Page complètement chargée, vérification des mises à jour...');
    checkForUpdates();
  });
    
  // Lancer la vérification une fois la page complètement chargée
  document.addEventListener('DOMContentLoaded', () => {
    console.log('Page complètement chargée, vérification des mises à jour...');
    checkForUpdates();
  });
  

// Navigation entre les pages
function navigateToPitScouting() {
  console.log('Navigating to Pit Scouting');
  window.location.href = "./execute_scout/pit/page.html";
}

function navigateToMatchScouting() {
  console.log('Navigating to Match Scouting');
  window.location.href = "./execute_scout/match/match.html";
}

function redirectToAdminLog() {
  window.location.href = './admin_panel/logger.html';
  console.log("Redirection Effectuée à partir de la page d'accueil.");
}

function redirectToStatsAndAIFunctions() {
  console.log("Commande non utilisable pour le moment -> Redirection demandée vers le panel Stats and AI");
  alert("Cette page n'est pas encore accessible. Elle le sera dans une prochaine version.");
}

// Appeler la fonction lors du chargement du DOM
document.addEventListener('DOMContentLoaded', () => {
  prefillScouterName();
  checkForUpdates(); // Vérifier les mises à jour au démarrage
});
