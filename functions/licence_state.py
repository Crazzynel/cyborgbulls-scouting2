from datetime import datetime
from safer import id1, id2, id3

def userkey():
    # Collecter les informations d'identification
    nom = input("Enter your name: ")
    prenom = input("Enter your last name: ")
    cle_licence = input("Enter your license key: ")
    currentTime = datetime.now()

    # Vérifier la clé de licence
    if cle_licence in (id1, id2, id3):
        hypevaluestate = "Correct Key"
        print(hypevaluestate)
        print("Your ID has been successfully recorded")
        # Ouvrir le fichier de journal en mode écriture
        with open("./functions/credentials/user_log.log", "a") as log_file:
            # Écrire les informations d'identification dans le fichier de journal
            log_file.write(f"Nom: {nom},\nPrenom: {prenom}, \nCle de licence: {cle_licence}\nDate et Heure d'ajout d'ID Licence: {currentTime}")
    else:
        print("Cle incorrecte, vous ne disposez pas de compte CyborgBulls.fr .")

# Appel de la fonction pour collecter les informations d'identification
# function called on licence_user.cyborgbulls