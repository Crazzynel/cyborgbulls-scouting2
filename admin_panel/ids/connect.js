function connectionAdminPanel() {
    const codes = {
        defaultID: "CyborgBulls_Admin",
        defaultPassword: "uzerbzrzb8257,sdgnsfn83Y"
    };

    let ID = document.getElementById('userID').value;
    let password = document.getElementById('userPassword').value;

    if (ID === codes.defaultID && password === codes.defaultPassword) {
        console.log("Connexion réussie au panneau admin");
        alert("Mot de passe et identifiants correct. Redirection en cours")
        window.location.href = './page.html'
    } else {
        console.log("Identifiant ou mot de passe incorrect.");
        alert('Mot de passe/Identifiant incorrect. Veuillez réessayer')

    }
}
