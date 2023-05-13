# Module Chat

**[Retour Page Inception](./00_Page_Inception.md)**

# Point Ouvert

# API Liée
- [API 30 - Message](../API/30_Message.md)
- [API 31 - List User Channel](../API/31_List_User_Channel.md)
# Regle de gestion

## Inspiration
<p align="center">
	<img src="./Inspiration/Chat_Home.png" />
</p>

## Etape

> **Affichage**

Composé de 2 sections :

1. **Bande latérale à gauche**

- Icone "Home" en haut pour revenir à la section "Home"
- Liste d’icone avec avatar channel / contact en cours de conversation avec user :
	- Statuts des user en bas à gauche de l’avatar (Vert = Dispo / Orange = Absent/ Rouge = inGame / Gris = Déconnecté) voir [API 31 - List User Channel](../API/31_List_User_Channel.md)
	- Si nouveaux messages afficher le nombre en rouge en haut à droite de l’avatar voir [API 30 - Message](../API/30_Message.md)

2.	**Partie principale du chat à droite**

- Composé de 4 sous-section/version :
	- [Home](./05A_Chat_Home.md)
	- [Recherche](./05B_Recherche_Chat.md)
	- [Conversation](./05C_Conversation.md)
	- [Details Channel](./05D_Details_Channel.md)
	- [Partie Privée](./05E_Partie_Privee.md)

> **Action Bande latérale à gauche**

- Au clic sur icone "Home" :
	- Afficher module Home
- Au clic sur icone "Avatar" :
	- Si non sélectionné afficher « Conversation » + donner l’impression que l’icône est sélectionnée (bande blanche grosis/réduit)
	- Si sélectionné revenir à l’affichage « Home » + désélectionné l’icone (bande blanche grosis/réduit)
- Au survol des icone "Avatar" :
	- Afficher leurs nom
	- Annimation sur la gauche (bande blanche grosis/réduit)

> **Gestion Erreur**

> **Gestion Succès**
