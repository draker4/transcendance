# Module Profil User Détaillé

**[Retour Page Inception](./00_Page_Inception.md)**

# Point Ouvert

# API Liée
- [API 21 - Update User](../API/21_Update_User.md)
- [API 31 - List User/Channel](../API/31_List_User_Channel.md)
# Regle de gestion

## Inspiration
<p align="center">
	<img src="./Inspiration/Profil_Edit.png" />
</p>

## Etape

> **Affichage**

Les champs s'afficher les un après les autres :
- Champ texte non-modifiable "Login"
- Champ texte "Username" :
	- icone info : "visible to other user, cannot be the same as the login, can be change, must be more than 3 characters, cannot be composed of # @ &"
- Champ texte "Bio"
- Champ texte "Nom" :
	- non modifiable si depuis 42 OAuth
- Champ texte "Prénom" :
	- non modifiable si depuis 42 OAuth
- Champ texte "Email" :
	- Checker si format email valide
- Champ texte "Téléphone" :
	- Checker si format téléphone valide
- Champ texte "Double Authentification :" :
	- Bouton "Activate" ou "Disable" à droite du texte
- Password (Ne pas afficher si user 42 OAuth):
	- non modifiable si depuis 42 OAuth
	- Bouton "Change Password" Au click ajouter le [module Password](./14A_Definition_Password.md)
- Bouton "Confirm Change"
- Bouton "Cancel"

> **Action**

- Clic bouton "Confirm" ou touche entrée
	- Checker le champ, si erreur (voir gestion erreur) si ok afficher le champ suivant
	- Si tous les champs ok alors envoyée [API 21 - Update User](../API/21_Update_User.md)
- Clic bouton "Cancel" ou sur la croix du navigateur afficher box confirmation et blocker modification du reste : 
	- Message "Your modification will be cancel. Would you proceed?"
	- Bouton "Confirm" -> fermer module edit
	- Bouton "Back" -> fermer box et permettre modification
- Clic bouton "Change Password" ajouter le [module Password](./A04_Definition_Password.md)
- Clic bouton "Double Authentification" ajouter le [module Double Authentification](./A04_Double_Autentification.md)
- Au survol / clic prévoir animation sur bouton et champ texte

> **Gestion Erreur**

- Pour champ "login" et "username" :
	- minimum 3 charactères (utile pour déclanchement recherche)
	- charactères interdit : # @ &
	- checker si déjà utilisé avec [API 31 - List User/Channel](../API/31_List_User_Channel.md) (attention si login utilisé mais avec 42 OAuth alors c'est ok pour éviter blocage à l'inverse)
- Pour champ "Nom", "Prénom" et "Email" :
	- doivent etre remplis
- Pour champ "Email" :
	- vérifié format donc char @ suive d'un .
- Pour champ "téléphone" :
	- obligatoire si sélection [02B - double authentification](./02B_Double_Authentification.md)

> **Gestion Succès**

Fermé module et message "Changes have been saved."
