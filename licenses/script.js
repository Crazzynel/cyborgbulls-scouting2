// Fetch pour charger le fichier licenses.json
fetch('../licenses.json') // Le chemin relatif par rapport au dossier /licenses
  .then(response => {
    if (!response.ok) {
      throw new Error('Erreur lors du chargement du fichier licenses.json');
    }
    return response.json();
  })
  .then(data => {
    const container = document.getElementById('licenses-container');

    // Parcours de chaque entrée du fichier JSON
    Object.keys(data).forEach(key => {
      const item = data[key];
      const card = document.createElement('div');
      card.className = 'license-card';

      const name = document.createElement('div');
      name.className = 'license-name';
      name.textContent = `${key}`;

      const license = document.createElement('div');
      license.className = 'license-content';
      license.innerHTML = `
        <strong>Licence :</strong> ${item.licenses}<br>
        <strong>Repository :</strong> <a href="${item.repository}" target="_blank">${item.repository}</a><br>
        <strong>Path :</strong> ${item.path}<br>
        <strong>License File :</strong> <a href="${item.licenseFile}" target="_blank">Télécharger la licence</a>
      `;

      card.appendChild(name);
      card.appendChild(license);
      container.appendChild(card);
    });
  })
  .catch(error => {
    console.error('Erreur:', error);
  });
