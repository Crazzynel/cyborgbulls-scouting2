const fs = require('fs');
const path = require('path');
const os = require('os');

document.addEventListener('DOMContentLoaded', () => {
  const matchTypeSelect = document.getElementById('matchType');
  const matchList = document.getElementById('match-list');
  const matchChart = document.getElementById('matchChart').getContext('2d');
  
  matchTypeSelect.addEventListener('change', () => {
    const matchType = matchTypeSelect.value;
    const matches = getMatches(matchType);
    displayMatches(matches);
  });

  function getDocumentsPath() {
    return path.join(os.homedir(), 'Documents', 'CyborgBulls Scouting Data');
  }

  function getMatches(matchType) {
    const dataFolderPath = getDocumentsPath();
    const files = fs.readdirSync(dataFolderPath);
    return files
      .filter(file => file.endsWith('.csv'))
      .map(file => {
        const content = fs.readFileSync(path.join(dataFolderPath, file), 'utf-8');
        const lines = content.split('\n');
        const matchDetails = {
          name: lines[0].split(': ')[1],
          number: lines[1].split(': ')[1],
          type: lines[2].split(': ')[1],
          data: lines.slice(4).map(line => line.split(',')),
        };
        return matchDetails;
      })
      .filter(match => matchType === 'all' || match.type === matchType);
  }

  function displayMatches(matches) {
    matchList.innerHTML = '';
    matches.forEach((match, index) => {
      const matchElement = document.createElement('div');
      matchElement.textContent = `${match.type} ${match.number} - ${match.name}`;
      matchElement.addEventListener('click', () => {
        displayMatchDetails(match);
      });
      matchList.appendChild(matchElement);
    });
  }

  function displayMatchDetails(match) {
    const labels = match.data.map(row => row[0]);
    const data = match.data.map(row => parseInt(row[1]));
    const averageData = calculateAverageData(match.data);

    const chart = new Chart(matchChart, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: `Match ${match.number}`,
            data: data,
            backgroundColor: 'rgba(30, 144, 255, 0.6)',
            borderColor: 'rgba(30, 144, 255, 1)',
            borderWidth: 1
          },
          {
            label: 'Moyenne Globale',
            data: averageData,
            backgroundColor: 'rgba(255, 99, 132, 0.6)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1
          }
        ]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

  function calculateAverageData(data) {
    const total = data.reduce((acc, row) => acc + parseInt(row[1]), 0);
    const average = total / data.length;
    return Array(data.length).fill(average);
  }

  // Initial display
  displayMatches(getMatches('all'));
});
