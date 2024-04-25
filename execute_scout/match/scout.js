// Code for Progress Bar
window.addEventListener("load", (event) => {
  const progressBar = document.querySelector(".progress");
  function updateProgress(value) {
    progressBar.style.width = value + "%";
  }

  // Code for Team Color Selection
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

  // Code for Autonomous Section
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
          (row) => row.cells[0].textContent.trim() === action
        );
        if (existingRow) {
          existingRow.cells[1].textContent = item.clicks.toString();
        } else {
          const row = document.createElement("tr");
          row.innerHTML = `
            <td>${action}</td>
            <td>${item.clicks}</td>
            <td>${item.points}</td>
          `;
          summaryTableBody.appendChild(row);
        }
        // Add the color and team members to the last row
        const lastRow = summaryTableBody.lastElementChild;
        if (color && teamMembers.length > 0) {
          lastRow.insertAdjacentHTML(
            "beforeend",
            `<td>${color}, ${teamMembers.join(", ")}</td>`
          );
        }
      });
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

  // Code for TELEOPERATED Section
  const projectionSpeaker = document.getElementById("projectionSpeaker");
  const projectionAmpli = document.getElementById("projectionAmpli");
  const hangingTeleoperated = document.getElementById("hangingTeleoperated");
  const trap = document.getElementById("trap");
  const lancerTeleoperated = document.getElementById("lancerTeleoperated");
  function recordTeleoperated(action) {
    let humanPlayerNumber = ""; // Initialiser à une chaîne vide
    if (action === "Lancer J.H.") { // Vérifier si l'action est "Lancer J.H."
        humanPlayerNumber = document.getElementById("humanPlayerNumber").value; // Si oui, obtenir le numéro du joueur humain
    }
    const teleopSummary = document.getElementById("teleopSummary");
    const existingRow = Array.from(teleopSummary.rows).find(
      (row) => row.cells[0].textContent.trim() === action
    );
    if (existingRow) {
      existingRow.cells[1].textContent = parseInt(existingRow.cells[1].textContent) + 1;
    } else {
      const row = document.createElement("tr");
      row.innerHTML = `<td>${action}</td><td>1</td><td>0</td><td>${humanPlayerNumber}</td>`;
      teleopSummary.appendChild(row);
    }
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


// Code for Generation Section
// Code pour générer le CSV
const generateCSVButton = document.getElementById("generateCSV");

function generateCSV() {
  const teleoperatedActionsCSV = new Blob(
    [
      "Téléopérated Actions\n" +
        "Action,Clicks,Points,Player Number\n" +
        Array.from(document.querySelectorAll("#teleopSummary tr")).map(row => {
          const cells = Array.from(row.querySelectorAll("td"));
          return cells.map(cell => cell.textContent.trim()).join(",");
        }).join("\n").replace(/,(\n|$)/g, "$1")
    ],
    { type: "text/csv;charset=utf-8" }
  );
  const teleoperatedActionsLink = document.createElement("a");
  teleoperatedActionsLink.href = URL.createObjectURL(teleoperatedActionsCSV);
  teleoperatedActionsLink.download = "teleoperated_actions.csv";
  teleoperatedActionsLink.click();
  alert("Votre fichier en .csv à bien été téléchargé ! ")
}


generateCSVButton.addEventListener("click", () => {
  generateCSV();
});


  // Initialize the progress bar
  updateProgress(
    100 *
      (autonomousActions
        .map(({ clicks }) => clicks)
        .reduce((a, b) => a + b, 0) /
        (autonomousActions
          .map(({ clicks }) => clicks)
          .reduce((a, b) => a + b, 0) +
          teleoperatedActions
            .map(({ clicks }) => clicks)
            .reduce((a, b) => a + b, 0))
      )
    )
});
