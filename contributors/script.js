// Tableaux pour stocker les utilisateurs de chaque catégorie
const developers = [
    {
        name: "Crazzynel",
        image: "./assets/crazzynel_icon.jpeg",
        description: "Développeur de l'application CyborgBulls Scouting. <br> Il apporte son soutien à d'autres projets open source. Quoique débutant dans ce domaine, il cherchera toujours à se surpasser pour offrir un travail fini <br> et le plus qualitatif possible.",
        projectsLink: "https://github.com/Crazzynel"
    },
    // Ajoutez d'autres développeurs si nécessaire
];

const githubContributors = [
    {
        name: "Lullaby.exe",
        image: "./assets/lullaby_icon.jpeg",
        description: "Contributrice dynamique sur le projet.<br> Elle est passionnée par la programmation et nous permet de nous surpasser grâce à sa motivation",
        projectsLink: "https://github.com/lulIaby",
        //contributeLevel: "9"
    },
    // Ajoutez d'autres contributeurs Github si nécessaire
];

const supporters = [
    {
        name: "CyborgBulls",
        image: "./assets/9102.png",
        description: "Equipe de robotique située à Saint-Christol-Lès-Alès dans le Gard.<br> Leur aide dans le projet a nos contributeurs et étudiants engagés de découvrir la programmation de manière plus ludique. .",
        projectsLink: "https://cyborgbulls.fr"
    },
    // Ajoutez d'autres soutiens si nécessaire
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

// Ajoutez les utilisateurs à chaque catégorie
addUsersToCategory(developers, "developers-container");
addUsersToCategory(githubContributors, "github-contributors-container");
addUsersToCategory(supporters, "supporters-container");
