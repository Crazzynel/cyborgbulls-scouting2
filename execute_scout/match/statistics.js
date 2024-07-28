window.addEventListener('load', () => {
    async function fetchLogData() {
        try {
            const logData = await window.electron.readLogFile();
            const parsedData = parseLogData(logData);
            generateCharts(parsedData);
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

    fetchLogData();
});
