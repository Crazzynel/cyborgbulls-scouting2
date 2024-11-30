window.addEventListener("load", () => {
  const progressBar = document.querySelector(".progress");

  function updateProgress(value) {
    progressBar.style.width = value + "%";
  }

  function calculateProgress() {
    const totalClicks = autonomousActions
      .map(({ clicks }) => clicks)
      .reduce((a, b) => a + b, 0) + teleoperatedActions.map(({ clicks }) => clicks).reduce((a, b) => a + b, 0);
    const totalPossibleClicks = autonomousActions.length + teleoperatedActions.length;
    return (totalClicks / totalPossibleClicks) * 100;
  }

  // Récupère le numéro de l'équipe à suivre
  const teamNumberInput = document.getElementById("teamNumber");

  function getSelectedTeamNumber() {
    return teamNumberInput.value;
  }

  // Vérifie si la case "Joueur Humain" est cochée
  const humanPlayerCheckbox = document.getElementById("humanPlayerCheckbox");

  function isHumanPlayer() {
    return humanPlayerCheckbox.checked;
  }

  // Empêche l'utilisation du bouton "Lancer Joueur Humain" si la case n'est pas cochée
  const lancerTeleoperatedButton = document.getElementById("lancerTeleoperated");

  function enableLancerButton() {
    if (isHumanPlayer()) {
      lancerTeleoperatedButton.disabled = false; // Active le bouton si la case est cochée
    } else {
      lancerTeleoperatedButton.disabled = true; // Désactive le bouton si la case est décochée
    }
  }

  // Initialiser l'état du bouton au chargement de la page
  enableLancerButton();

  // Mettre à jour l'état du bouton en fonction du changement de la case
  humanPlayerCheckbox.addEventListener('change', enableLancerButton);

  // Actions pour la période autonome
  const projection = document.getElementById("projection");
  const zoneExit = document.getElementById("zoneExit");
  const hanging = document.getElementById("hanging");
  const ringRetrieval = document.getElementById("ringRetrieval");

  const autonomousActions = [
    { action: "Projection", clicks: 0, points: 5 },
    { action: "Zone exit", clicks: 0, points: 5 },
    { action: "Hanging", clicks: 0, points: 10 },
    { action: "Ring retrieval", clicks: 0, points: 10 },
  ];

  function recordAutonomous(action) {
    const teamNumber = getSelectedTeamNumber();
    autonomousActions
      .filter((item) => item.action === action)
      .forEach((item) => {
        item.clicks++;
        const summaryTableBody = document.querySelector(".summary-table tbody");
        const existingRow = Array.from(summaryTableBody.rows).find(
          (row) => row.cells[0].textContent.trim() === action && row.cells[3].textContent.trim() === "Autonome"
        );
        if (existingRow) {
          existingRow.cells[1].textContent = item.clicks.toString();
        } else {
          const row = document.createElement("tr");
          row.innerHTML = `
            <td>${action}</td>
            <td>${item.clicks}</td>
            <td>${item.points}</td>
            <td>Autonome</td>
            <td>Equipe ${teamNumber}</td>
          `;
          summaryTableBody.appendChild(row);
        }
      });
    updateProgress(calculateProgress());
  }

  projection.addEventListener("click", () => {
    if (isHumanPlayer()) {
      recordAutonomous("Projection");
    }
  });
  zoneExit.addEventListener("click", () => {
    if (isHumanPlayer()) {
      recordAutonomous("Zone exit");
    }
  });
  hanging.addEventListener("click", () => {
    if (isHumanPlayer()) {
      recordAutonomous("Hanging");
    }
  });
  ringRetrieval.addEventListener("click", () => {
    if (isHumanPlayer()) {
      recordAutonomous("Ring retrieval");
    }
  });

  // Actions pour la période téléopérée
  const projectionSpeaker = document.getElementById("projectionSpeaker");
  const projectionAmpli = document.getElementById("projectionAmpli");
  const hangingTeleoperated = document.getElementById("hangingTeleoperated");
  const trap = document.getElementById("trap");

  const teleoperatedActions = [
    { action: "Projection (Speaker)", clicks: 0, points: 5 },
    { action: "Projection (Ampli)", clicks: 0, points: 5 },
    { action: "Hanging (Teleop)", clicks: 0, points: 10 },
    { action: "Trap", clicks: 0, points: 5 },
  ];

  function recordTeleoperated(action) {
    const teamNumber = getSelectedTeamNumber();
    const isHuman = isHumanPlayer(); // Vérifie si un joueur humain est impliqué
    let humanPlayerNumber = isHuman ? "OUI" : "NON"; // Si joueur humain, affichage "OUI", sinon "NON"

    teleoperatedActions
      .filter((item) => item.action === action)
      .forEach((item) => {
        item.clicks++;
        const summaryTableBody = document.querySelector(".summary-table tbody");
        const existingRow = Array.from(summaryTableBody.rows).find(
          (row) => row.cells[0].textContent.trim() === action && row.cells[3].textContent.trim() === "Téléopéré"
        );
        if (existingRow) {
          existingRow.cells[1].textContent = item.clicks.toString();
          existingRow.cells[4].textContent = humanPlayerNumber; // Mise à jour de la colonne "Joueur Humain"
        } else {
          const row = document.createElement("tr");
          row.innerHTML = `
            <td>${action}</td>
            <td>${item.clicks}</td>
            <td>${item.points}</td>
            <td>Téléopéré</td>
            <td>${humanPlayerNumber}</td>
          `;
          summaryTableBody.appendChild(row);
        }
      });
    updateProgress(calculateProgress());
  }

  projectionSpeaker.addEventListener("click", () => {
    if (isHumanPlayer()) {
      recordTeleoperated("Projection (Speaker)");
    }
  });
  projectionAmpli.addEventListener("click", () => {
    if (isHumanPlayer()) {
      recordTeleoperated("Projection (Ampli)");
    }
  });
  hangingTeleoperated.addEventListener("click", () => {
    if (isHumanPlayer()) {
      recordTeleoperated("Hanging (Teleop)");
    }
  });
  trap.addEventListener("click", () => {
    if (isHumanPlayer()) {
      recordTeleoperated("Trap");
    }
  });

  // Activation du bouton "Lancer Joueur Humain"
  lancerTeleoperatedButton.addEventListener("click", () => {
    if (isHumanPlayer()) {
      recordTeleoperated("Lancer J.H.");
    }
  });

  const generateCSVButton = document.getElementById("generateCSV");

  function generateCSV() {
    const rows = Array.from(document.querySelectorAll("#teleopSummary tr")).map(row => {
      const cells = Array.from(row.querySelectorAll("td"));
      return cells.map(cell => cell.textContent.trim()).join(",");
    });
    const csvContent = [
      "Action,Clics,Points,Période,Joueur Humain",
      ...rows
    ].join("\n");
    
    const teleoperatedActionsCSV = new Blob([csvContent], { type: "text/csv;charset=utf-8" });
    const teleoperatedActionsLink = document.createElement("a");
    teleoperatedActionsLink.href = URL.createObjectURL(teleoperatedActionsCSV);
    teleoperatedActionsLink.download = "teleoperated_actions.csv";
    teleoperatedActionsLink.click();
    alert("Votre fichier en .csv a bien été créé !");
  }

  generateCSVButton.addEventListener("click", generateCSV);

  // Initialiser l'état du bouton "Lancer Joueur Humain"
  enableLancerButton();

  updateProgress(calculateProgress());
});
