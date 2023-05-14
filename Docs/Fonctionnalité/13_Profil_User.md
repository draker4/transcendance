# Module Profil User Détaillé

**[Retour Page Inception](./00_Page_Inception.md)**

# Point Ouvert

# API Liée

# Regle de gestion

## Inspiration
<p align="center">
	<img src="./Inspiration/profil_large.png" />
</p>
<p align="center">
	<img src="./Inspiration/profil_short.png" />
</p>

## Etape

> **Affichage**

Le module profil doit s'appeler avec un username

Il sera composé de 3 partie :
1. Info User :
	- A gauche si suffisament de place
	- En premier si ecran réduit
	- Avatar :
		- si User est l'utilisateur alors bouton "Change Avatar" en bas à droite de l'avatar
	- Username
	- Level
	- Si User est l'utilisateur alors bouton "Edit Profil"
2. Menu permettant de naviguer dans 3 modules : Overview / Channel List / Contact List
3. Affichage du modules selectionnée, par défaut : Overview

> **Action**

- Si User est l'utilisateur :
	- clic bouton "Change Avatar" : ouverture menu déroulant :
		- "Select Avatar" au clic : ouverture [A02 - Selection Avatar](./A02_Selection_Avatar.md)
		- "Download Avatar" au clic : ouverture [A03 - Download Avatar](./A03_Download_Avatar.md)
	- clic bouton "Edit Profil" : ouverture [13A - Edit Profil](./13A_Edit_Profil.md)
- Au clic section "Overview" : ouverture [13B - Overview](./13B_Overview.md)
- Au clic section "Channel List" : ouverture [13C - Channel List](./13C_Channel_List.md)
- Au clic section "Contact List" : ouverture [13D - Contact List](./13D_Contact_List.md)

> **Gestion Erreur**

> **Gestion Succès**
