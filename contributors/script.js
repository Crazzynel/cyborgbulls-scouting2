// Tableaux pour stocker les utilisateurs de chaque catégorie
const developers = [
    {
        name: "Crazzynel",
        image: "./assets/crazzynel_icon.jpeg",
        description: "",
        projectsLink: "https://github.com/Crazzynel"
    },
    // Ajout de soutiens/Contributeurs/développeurs en dupliquant la const
];

const githubContributors = [
    {
        name: "Lullaby.exe",
        image: "./assets/lullaby_icon.jpeg",
        description: "",
        projectsLink: "https://github.com/lulIaby",
    },
    // Ajout de soutiens/Contributeurs/développeurs en dupliquant la const
];

const supporters = [
    {
        name: "CyborgBulls",
        image: "./assets/9102.png",
        description: "<b>Equipe de robotique située à Saint-Christol-Lès-Alès dans le Gard.<br> Leur aide dans le projet a permis à nos contributeurs et étudiants engagés de découvrir la programmation de manière plus ludique.</b>",
        projectsLink: "https://cyborgbulls.fr"
    },
    // Ajout de soutiens/Contributeurs/développeurs en dupliquant la const
];

// Fonction pour créer un cadre utilisateur
function createUserCard(user) {
    const card = document.createElement("div");
    card.classList.add("user-card");
    card.innerHTML = `
        <img src="${user.image}" alt="${user.name}">
        <h3>${user.name}</h3>
        <p>${user.description}</p>
        <a href="${user.projectsLink}" class="btn">Voir les projets</a>
    `;
    return card;
}

// Fonction pour ajouter des utilisateurs dans une catégorie
function addUsersToCategory(users, categoryId) {
    const categoryContainer = document.getElementById(categoryId);
    users.forEach(user => {
        const card = createUserCard(user);
        categoryContainer.appendChild(card);
    });
}

// Ajout des classements
addUsersToCategory(developers, "developers-container");
addUsersToCategory(githubContributors, "github-contributors-container");
addUsersToCategory(supporters, "supporters-container");


