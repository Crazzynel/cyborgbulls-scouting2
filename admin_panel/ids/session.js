const SESSION_ID = 'Sample Edit'; // Cette partie n'est pas utilisable. le code émis est invalide et inconnu
var getTheUserAddress = document.getElementById('userAddress');
getTheUserAddress.textContent = userAddress(); 
 
 function userAddress() {  
 return SESSION_ID // Remplacer par la fonction ou variable qui génère l'adresse utilisateur -> Immpossibilité de récupérer l'identifiant session de l'utilisateur.   
}