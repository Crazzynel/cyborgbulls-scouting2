window.onload = function() {
    // Récupérer l'ID de licence depuis localStorage
    var licenceCode = localStorage.getItem('licence');
    var licenceCodeDate = localStorage.getItem('date')

    // Récupérer les éléments HTML
    var versionElement = document.getElementById('version');
    var descriptionElement = document.getElementById('description');
    var appNameElement = document.getElementById('appName');
    var userSessionElement = document.getElementById('userSession');
    var licenceIdElement = document.getElementById('licenceId');
    var licenceIdDate = document.getElementById("dateLicence");

    // Assigner les valeurs aux éléments HTML
    versionElement.textContent = getAppVersion();
    descriptionElement.textContent = getAppDescription();
    appNameElement.textContent = getAppName();
    userSessionElement.textContent = getUserSession();
    licenceIdElement.textContent = licenceCode;
    licenceIdDate.textContent= licenceCodeDate;
};

function getAppVersion() {
    return "1.3.0 - Developer Mode / Version d'essai"; // Remplacer par la fonction ou variable qui récupère la version de l'application
}

function getAppDescription() {
    return "Application de Scouting destinée à l'équipe de robotique CyborgBulls pour la participation à l'évènement FRC 2024 - Crescendo"; // Remplacer par la fonction ou variable qui récupère la description de l'application
}

function getAppName() {
    return "CyborgBulls Scouting - APP 2024 patch 1"; // Remplacer par la fonction ou variable qui récupère le nom de l'application
}

function getUserSession() {
    return "Accès refusé"; // Remplacer par la fonction ou variable qui récupère le nom de l'utilisateur
}

//function getLicenceId() {
//    return licenceCode; // Remplacer par la fonction ou variable qui récupère l'ID de licence
//}
