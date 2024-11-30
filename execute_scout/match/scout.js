// scout.js

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

  const color1 = document.getElementById("color1");
  const color2 = document.getElementById("color2");

  function getSelectedColor() {
    const color1 = document.getElementById("color1");
    const color2 = document.getElementById("color2");
    if (color1.checked) {
      return color1.value;
    } else if (color2.checked) {
      return color2.value;
    }
  }

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
    const color = getSelectedColor();
    const teamMembers = [
      document.getElementById("member1").value,
      document.getElementById("member2").value,
      document.getElementById("member3").value,
    ].filter((value) => value !== "");
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
            <td></td>
          `;
          summaryTableBody.appendChild(row);
        }
      });
    updateProgress(calculateProgress());
  }

  projection.addEventListener("click", () => {
    recordAutonomous("Projection");
  });
  zoneExit.addEventListener("click", () => {
    recordAutonomous("Zone exit");
  });
  hanging.addEventListener("click", () => {
    recordAutonomous("Hanging");
  });
  ringRetrieval.addEventListener("click", () => {
    recordAutonomous("Ring retrieval");
  });

  const projectionSpeaker = document.getElementById("projectionSpeaker");
  const projectionAmpli = document.getElementById("projectionAmpli");
  const hangingTeleoperated = document.getElementById("hangingTeleoperated");
  const trap = document.getElementById("trap");
  const lancerTeleoperated = document.getElementById("lancerTeleoperated");

  const teleoperatedActions = [
    { action: "Projection (Speaker)", clicks: 0, points: 5 },
    { action: "Projection (Ampli)", clicks: 0, points: 5 },
    { action: "Hanging (Teleop)", clicks: 0, points: 10 },
    { action: "Trap", clicks: 0, points: 5 },
    { action: "Lancer J.H.", clicks: 0, points: 5 },
  ];

  function recordTeleoperated(action) {
    let humanPlayerNumber = "";
    if (action === "Lancer J.H.") {
      humanPlayerNumber = document.getElementById("humanPlayerNumber").value;
    }
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
          if (action === "Lancer J.H.") {
            existingRow.cells[4].textContent = humanPlayerNumber;
          }
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
    recordTeleoperated("Projection (Speaker)");
  });
  projectionAmpli.addEventListener("click", () => {
    recordTeleoperated("Projection (Ampli)");
  });
  hangingTeleoperated.addEventListener("click", () => {
    recordTeleoperated("Hanging (Teleop)");
  });
  trap.addEventListener("click", () => {
    recordTeleoperated("Trap");
  });
  lancerTeleoperated.addEventListener("click", () => {
    recordTeleoperated("Lancer J.H.");
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
    alert("Votre fichier en .csv à bien été créé !");
  }

  generateCSVButton.addEventListener("click", generateCSV);

  updateProgress(calculateProgress());
});
