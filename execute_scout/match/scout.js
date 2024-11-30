window.addEventListener("load", () => {
  const progressBar = document.querySelector(".progress");

  // Mise à jour de la barre de progression
  function updateProgress(value) {
    progressBar.style.width = value + "%";
  }

  function calculateProgress() {
    const totalClicks = [
      ...autonomousActions,
      ...teleoperatedActions
    ].reduce((sum, { clicks }) => sum + clicks, 0);

    const totalPossibleClicks = autonomousActions.length + teleoperatedActions.length;
    return (totalClicks / totalPossibleClicks) * 100;
  }

  // Récupération des données d'équipe
  const teamNumberInput = document.getElementById("teamNumber");

  function getSelectedTeamNumber() {
    return teamNumberInput.value;
  }

  // Gestion du joueur humain
  const humanPlayerCheckbox = document.getElementById("humanPlayerCheckbox");
  const lancerTeleoperatedButton = document.getElementById("lancerTeleoperated");

  function isHumanPlayer() {
    return humanPlayerCheckbox ? humanPlayerCheckbox.checked : true;
  }

  function enableLancerButton() {
    lancerTeleoperatedButton.disabled = !isHumanPlayer();
    console.log(`Lancer J.H. button enabled: ${!lancerTeleoperatedButton.disabled}`);
  }

  // Initialiser l'état des boutons
  enableLancerButton();

  // Écouteur pour la case joueur humain
  humanPlayerCheckbox.addEventListener("change", () => {
    enableLancerButton();
  });

  // Actions pour la période autonome
  const autonomousActions = [
    { action: "Projection", clicks: 0, points: 5 },
    { action: "Zone exit", clicks: 0, points: 5 },
    { action: "Hanging", clicks: 0, points: 10 },
    { action: "Ring retrieval", clicks: 0, points: 10 }
  ];

  function recordAction(actions, period, actionName) {
    const teamNumber = getSelectedTeamNumber();
    const isHuman = isHumanPlayer() ? "OUI" : "NON";

    actions
      .filter(item => item.action === actionName)
      .forEach(item => {
        item.clicks++;

        const summaryTableBody = document.querySelector(".summary-table tbody");
        const existingRow = Array.from(summaryTableBody.rows).find(
          row => row.cells[0].textContent.trim() === actionName && row.cells[3].textContent.trim() === period
        );

        if (existingRow) {
          existingRow.cells[1].textContent = item.clicks.toString();
          if (period === "Téléopéré") existingRow.cells[4].textContent = isHuman;
        } else {
          const row = document.createElement("tr");
          row.innerHTML = `
            <td>${actionName}</td>
            <td>${item.clicks}</td>
            <td>${item.points}</td>
            <td>${period}</td>
            <td>${period === "Téléopéré" ? isHuman : "N/A"}</td>
          `;
          summaryTableBody.appendChild(row);
        }
      });

    updateProgress(calculateProgress());
  }

  const autonomousButtons = {
    "Projection": document.getElementById("projection"),
    "Zone exit": document.getElementById("zoneExit"),
    "Hanging": document.getElementById("hanging"),
    "Ring retrieval": document.getElementById("ringRetrieval")
  };

  Object.entries(autonomousButtons).forEach(([action, button]) => {
    button.addEventListener("click", () => {
      recordAction(autonomousActions, "Autonome", action);
    });
  });

  // Actions pour la période téléopérée
  const teleoperatedActions = [
    { action: "Projection (Speaker)", clicks: 0, points: 5 },
    { action: "Projection (Ampli)", clicks: 0, points: 5 },
    { action: "Hanging (Teleop)", clicks: 0, points: 10 },
    { action: "Trap", clicks: 0, points: 5 },
    { action: "Lancer J.H.", clicks: 0, points: 5 } // Ajout de l'action "Lancer J.H."
  ];

  const teleoperatedButtons = {
    "Projection (Speaker)": document.getElementById("projectionSpeaker"),
    "Projection (Ampli)": document.getElementById("projectionAmpli"),
    "Hanging (Teleop)": document.getElementById("hangingTeleoperated"),
    "Trap": document.getElementById("trap")
  };

  Object.entries(teleoperatedButtons).forEach(([action, button]) => {
    button.addEventListener("click", () => {
      recordAction(teleoperatedActions, "Téléopéré", action);
    });
  });

  lancerTeleoperatedButton.addEventListener("click", () => {
    if (isHumanPlayer()) {
      recordAction(teleoperatedActions, "Téléopéré", "Lancer J.H.");
      console.log("Action 'Lancer J.H.' recorded.");
    } else {
      console.log("Action 'Lancer J.H.' not recorded because player is not human.");
    }
  });

  // Génération de fichier CSV
  const generateCSVButton = document.getElementById("generateCSV");

  function generateCSV() {
    const rows = Array.from(document.querySelectorAll(".summary-table tbody tr")).map(row =>
      Array.from(row.cells).map(cell => cell.textContent.trim()).join(",")
    );

    const csvContent = [
      "Action,Clics,Points,Période,Joueur Humain",
      ...rows
    ].join("\n");

    const csvBlob = new Blob([csvContent], { type: "text/csv;charset=utf-8" });
    const downloadLink = document.createElement("a");
    downloadLink.href = URL.createObjectURL(csvBlob);
    downloadLink.download = "actions_summary.csv";
    downloadLink.click();

    alert("Votre fichier CSV a bien été généré !");
  }

  generateCSVButton.addEventListener("click", generateCSV);

  // Initialiser la barre de progression
  updateProgress(calculateProgress());
});