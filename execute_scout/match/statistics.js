window.addEventListener('load', () => {
    let parsedData = [];

    async function fetchLogData() {
        try {
            const logData = await window.electron.readLogFile();
            parsedData = parseLogData(logData);
            generateCharts(parsedData);
            populateFilters(parsedData); // Populate filters after fetching data
        } catch (error) {
            console.error('Erreur lors de la lecture du fichier de log:', error);
        }
    }

    function parseLogData(logData) {
        const matches = logData.trim().split('\n\n').filter(block => block.trim() !== '');
        const parsedData = matches.map(match => {
            const lines = match.split('\n');
            const matchTypeLine = lines.find(line => line.startsWith('QUALIFICATION') || line.startsWith('PRACTICE'));
            const matchType = matchTypeLine?.split(' ')[0] || 'undefined';
            const matchNumber = matchTypeLine?.split(' ')[2] || 'undefined';
            const allianceColor = lines.find(line => line.startsWith('COULEUR DE L\'ALLIANCE'))?.split(': ')[1] || 'undefined';
            const scouter = lines.find(line => line.startsWith('SCOOT'))?.split(': ')[1] || 'undefined';
            const actionsStartIndex = lines.findIndex(line => line.startsWith('ACTION,CLICS,POINTS,PERIODE,JOUEUR HUMAIN')) + 1;
            const actions = lines.slice(actionsStartIndex).map(line => {
                const [action, clicks, points, period, humanPlayer] = line.split(',');
                return { action, clicks: parseInt(clicks), points: parseInt(points), period, humanPlayer: humanPlayer || 'N/A' };
            });
            return { matchType, matchNumber, allianceColor, scouter, actions };
        });
        return parsedData;
    }

    function generateCharts(parsedData) {
        generateTotalPointsChart(parsedData);
        generatePointsPerGameChart(parsedData);
    }

    function generateTotalPointsChart(parsedData) {
        const ctx = document.createElement('canvas');
        document.getElementById('charts-container').appendChild(ctx);

        const labels = parsedData.map(match => `Match ${match.matchNumber}`);
        const dataPoints = parsedData.map(match => match.actions.reduce((total, action) => total + action.points * action.clicks, 0));

        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Points Totals',
                    data: dataPoints,
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                }]
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

    function generatePointsPerGameChart(parsedData) {
        const ctx = document.createElement('canvas');
        document.getElementById('charts-container').appendChild(ctx);

        const labels = parsedData.map(match => `Match ${match.matchNumber}`);
        const datasets = [];

        const actions = ['Projection (Speaker)', 'Projection (Ampli)', 'Hanging', 'Lancer J.H', 'Trap', 'Projection', 'Zone exit', 'Ring retrieval'];

        actions.forEach(actionType => {
            const dataPoints = parsedData.map(match => {
                const action = match.actions.find(a => a.action.includes(actionType));
                return action ? action.points * action.clicks : 0;
            });

            datasets.push({
                label: actionType,
                data: dataPoints,
                borderColor: getRandomColor(),
                fill: false
            });
        });

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: datasets
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

    function getRandomColor() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    function populateFilters(parsedData) {
        const matchTypes = [...new Set(parsedData.map(match => match.matchType))];
        const teamNumbers = [...new Set(parsedData.map(match => match.scouter))];

        const matchTypeSelect = document.getElementById('matchType');
        const allianceColorSelect = document.getElementById('allianceColor');
        const teamSelect1 = document.getElementById('teamSelect1');
        const teamSelect2 = document.getElementById('teamSelect2');

        matchTypes.forEach(type => {
            const option = document.createElement('option');
            option.value = type;
            option.textContent = type;
            matchTypeSelect.appendChild(option);
        });

        teamNumbers.forEach(team => {
            const option1 = document.createElement('option');
            const option2 = document.createElement('option');
            option1.value = team;
            option2.value = team;
            option1.textContent = team;
            option2.textContent = team;
            teamSelect1.appendChild(option1);
            teamSelect2.appendChild(option2);
        });

        matchTypeSelect.addEventListener('change', () => updateFilteredChart(parsedData));
        allianceColorSelect.addEventListener('change', () => updateFilteredChart(parsedData));
        teamSelect1.addEventListener('change', () => updateComparisonChart(parsedData));
        teamSelect2.addEventListener('change', () => updateComparisonChart(parsedData));
    }

    function updateFilteredChart(parsedData) {
        const matchType = document.getElementById('matchType').value;
        const allianceColor = document.getElementById('allianceColor').value;

        const filteredData = parsedData.filter(match => 
            (matchType === 'all' || match.matchType === matchType) && 
            (allianceColor === 'all' || match.allianceColor === allianceColor)
        );

        generateTotalPointsChart(filteredData);
        generatePointsPerGameChart(filteredData);
    }

    function updateComparisonChart(parsedData) {
        const team1 = document.getElementById('teamSelect1').value;
        const team2 = document.getElementById('teamSelect2').value;

        const team1Data = parsedData.filter(match => match.scouter === team1);
        const team2Data = parsedData.filter(match => match.scouter === team2);

        const labels = team1Data.map(match => `Match ${match.matchNumber}`);
        const team1Points = team1Data.map(match => match.actions.reduce((total, action) => total + action.points * action.clicks, 0));
        const team2Points = team2Data.map(match => match.actions.reduce((total, action) => total + action.points * action.clicks, 0));

        const ctx = document.getElementById('comparisonChart').getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: team1,
                        data: team1Points,
                        borderColor: 'rgba(255, 99, 132, 1)',
                        fill: false
                    },
                    {
                        label: team2,
                        data: team2Points,
                        borderColor: 'rgba(54, 162, 235, 1)',
                        fill: false
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

    fetchLogData();
});
