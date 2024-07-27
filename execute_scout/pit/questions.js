const { options } = require("yargs");

const questions = [
    {
        question: "Le robot peut-il grimper?",
        options: ["OUI", "Pas sûr", "Non"]
    },
    {
        question: "Le robot peut-il transporter des objets?",
        options: ["OUI", "Pas sûr", "Non"]
    },
    {
        question: "Type de roues:",
        options: ["Tank", "Mecanum", "Omnidirectionnelles"]
    }
    // Ajoutez d'autres questions ici
];
