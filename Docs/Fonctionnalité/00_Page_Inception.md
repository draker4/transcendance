# Sommaire des modules

- [01 - Présentation](./01_Presentation.md)
- [02A - Gestion Connexion](./02A_Gestion_Connexion.md)
- [02B - Connexion 42](./02B_Connexion_42.md)
- [02C - Gestion Connexion](./02C_Double_Authentification.md)
- [03A - Inscription](./03A_Inscription.md)
- [03B - Vérification Email](./03B_Verification_Email.md)
- [04A - Password Perdu](./04_Password_Perdu.md)
- [04B - Modification Password Perdu](./04B_Modification_Password_Perdu.md)
- [05 - Chat](./05_Chat.md)
- [05A - Chat - Section Home](./05A_Chat_Home.md)
- [05B - Chat - Section Recherche](./05B_Recherche_Chat.md)
- [05C - Chat - Section Conversation](./05C_Conversation.md)
- [05D - Chat - Section Détails Channel](./05D_Details_Channel.md)
- [05E - Chat - Section Partie Privée](./05E_Partie_Privee.md)
- [06 - Profil Resumé](./06_Profil_Resume.md)
- [07 - Profil Detail](./07_Profil_Detail.md)
- [08 - Menu Jeu](08_Menu_Jeu.md)
- [09 - Jeu](./09_Jeu.md)
- [10 - LeaderBoard](./10_LeaderBoard.md)
- [11 - Recherche Result](./11_Recherche.md)
- [12 - Settings](12_Settings.md)
- [13 - Terms](./13_Terms.md)
- [Annexe 1 - Sommaire API](../API/00_Sommaire_API.md)

# Header

**Inspirartion Ecran Large :**
<p align="center">
	<img src="./Inspiration/Header_Full.png" />
</p>

**Inspiration Ecran Réduit :** 
<p align="center">
	<img src="./Inspiration/Header_Reduce.png" />
</p>

<p align="center">
	<img src="./Inspiration/Header_Reduce_Menu.png" />
</p>

## --- General ---

### **Logo**

> **Action**
- Clic : revenir configuration Home
- Passage : prévoir animation

## --- Utilisateur Non Connecté ---

### **Logo**

> **Action**
- Clic : Revenir configuration Home
- Passage : prévoir animation

### **Bouton "Log in"**

> **Affichage**
- justifié à Droite

> **Action**
- Clic : ouverture / fermeture module [Gestion Connexion](./02_Gestion_Connexion.md)
- Passage : prévoir animation

### **Bouton "Sign Up"**

> **Affichage**
- justifié à Droite avant Bouton "Log In"

> **Action**
- Clic : ouverture / fermeture module [Inscription](./03_Inscription.md)
- Passage : prévoir animation
## --- Utilisateur Connecté ---

### **Logo**

> **Affichage**
- Grand Ecran : Justiifié à Gauche
- Ecran Réduit : Centré

### **Utilisateur**

> **Affichage**
- justifié à Droite
- Avatar Utilisateur
- Grand Ecran : Username Utilisateur à gauche de l'avatar

> **Action**
- Clic : menu déroulant avec :
	- [Profil](./07_Profil_Detail.md) = Profil détaillé de l'utilisateur courant
	- [Settings](./12_Settings.md) 
	- "Log out"
- Passage : prévoir animation

### **Bouton Chat**

> **Affichage**
- Grand Ecran : justifié à Gauche après le Logo
- Ecran Réduit : justifié à Gauche après le bouton Menu

> **Action**
- Clic : Ouverture module chat
- Passage : prévoir animation

### **Menu**
module en lien : 
- [Game](./08_Menu_Jeu.md) = page d'acceuil + scroll menu jeu
- [LeaderBoard](./10_LeaderBoard.md)
- [Section de Recherche](./11_Recherche.md)

> **Affichage**
- Grand Ecran : afficher chaque section :
	- Game & LeaderBoard à Gauche apres Bouton Chat
	- Section de recherche à Droit avant utilisateur
- Ecran Réduit : 
	- bouton + plus menu déroulant
	- Justifié à Gauche
	- Section de Recherche en premier

> **Action**
- Clic : Ouverture module en lien
- Passage : prévoir animation

# Main

## --- General ---

### **Bouton "Remonter au header"**

> **Affichage**
- En bas à droite de la page
- s'affiche au premier scroll et s'enlève lorsque tout en haut
- ne se superpose pas au footer

> **Action**
	- Clic : revenir au Header
	- Passage : prévoir animation

## --- Utilisateur Non connecté ---

Module possible tous stand-alone : 

1. [Présentation](./01_Pr%C3%A9sentation.md)
2. [Connexion](./02_Gestion_Connexion.md)
3. [Inscription](./03_Inscription.md)
4. [Password Perdu](./04_Password_Perdu.md)
5. [Terms](./13_Terms.md)

## --- Utilisateur connecté ---

Module page principal :
1. [Profil Resumé](./06_Profil_Resume.md)
2. [Menu Jeu](08_Menu_Jeu.md)

Le module chat devra pouvoir s'ouvrir si la page est assez grande sur la gauche de l'écran en réduisant la place des autres modules affiché
(voir [Chat](./05_Chat.md))

Module Stand-Alone :
1. [Profil Detail](./07_Profil_Detail.md)
2. [Jeu](./09_Jeu.md)
3. [LeaderBoard](./10_LeaderBoard.md)
4. [Settings](12_Settings.md)
5. [Recherche Result](./11_Recherche.md)
5. [Présentation](./01_Pr%C3%A9sentation.md)
6. [Terms](./13_Terms.md)

# Footer

**Inspiration :**
<p align="center">
	<img src="./Inspiration/Footer.png" />
</p>

## --- General ---

### Ligne de lien vers module : 

- [About](./01_Pr%C3%A9sentation.md)
- [Terms](./13_Terms.md)

> **Action**
- Clic : Ouverture module en lien
- Passage : prévoir animation

### Ligne Crédit du site :

> **Affichage**
- L'ensemble sera Centrer
1. Logo
2. Année
3. Nom du site

> **Action**
- Clic : Retour Page Home
- Passage : prévoir animation

## --- Utilisateur Non connecté ---

## --- Utilisateur connecté ---
Ajouter le lien :
- [Settings](./12_Settings.md)