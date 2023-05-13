# Header

## --- General ---

### **Logo**

- Affichage : justifié à Gauche
- Action :
  - Clic : revenir à page connexion
  - Passage : prévoir animation

## --- Utilisateur Non Connecté ---

### **Bouton « Log in »**

- Affichage : justifié à Droite
- Action :
  - Clic :
    - présentation ouvert : ouverture **connexion**
    - connexion ouvert : ouverture **présentation**
  - Passage : prévoir animation

## --- Utilisateur Connecté ---

### **utilisateur**

- Affichage :
	- Username Utilisateur
	- Avatar Utilisateur
	- justifié à Droite
- Action :
  - Clic : menu déroulant avec :
  	- "settings" : 
	- "profil" :
  - Passage : prévoir animation

### **Bouton Chat**
- Affichage :
	- justifié à Gauche avant Logo
- Action :
  - Clic : Ouverture module chat
  - Passage : prévoir animation

### **Menu lien module**
- module en lien : 
	- [Profil](./07_Profil_Detail.md) = Profil détaillé de l'utilisateur courant
	- [Game](./08_Menu_Jeu.md) = page d'acceuil + scroll menu jeu
	- [LeaderBoard](./10_LeaderBoard.md)
	- [Settings](./11_Settings.md)
- Affichage :
	- si breakpoint peu de place : 
		- bouton + plus menu déroulant
		- position à définir
	- si breakpoint suffisament de place :
		- afficher chaque section
		- centrer sur la barre header
- Action :
  	- Clic : Ouverture module en lien
  	- Passage : prévoir animation
# Main

## --- General ---

### **Bouton « Remonter au header »**
- Affichage :
	- En bas à droite de la page
	- s'affiche au premier scroll
	- ne se superpose pas au footer
- Action :
	- Clic : revenir au Header
	- Passage : prévoir animation

## --- Utilisateur Non connecté ---

Module possible les 1 apres les autres : 

1. [Présentation](./01_Pr%C3%A9sentation.md)
2. [Connexion](./02_Gestion_Connexion.md)
3. [Inscription](./03_Inscription.md)
4. [Password Perdu](./04_Password_Perdu.md)

## --- Utilisateur connecté ---

Module page principal :
1. [Profil Resumé](./06_Profil_Resume.md)
2. [Menu Jeu](08_Menu_Jeu.md)

Le module chat devra pouvoir s'ouvrir si la page est assez grande sur la gauche de l'écran en réduisant la place des autres
[Chat](./05_Chat.md)

Module Stand-Alone :
1. [Profil Detail](./07_Profil_Detail.md)
2. [Jeu](./09_Jeu.md)
3. [LeaderBoard](./10_LeaderBoard.md)
4. [Settings](11_Settings.md)

# Footer

## --- General ---

- Crédit du site

## --- Utilisateur Non connecté ---


## --- Utilisateur connecté ---
