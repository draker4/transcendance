# Module Chat - Section Home

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

- Zone de recherche en haut : au click ouvrir [Recherche Chat](./05B_Recherche_Chat.md)
- 2 section avec un bouton à gauche du titre permettant d’ouvrir / réduire la section
- Récupérer donnée avec [API 31 - List User Channel](../API/31_List_User_Channel.md) et afficher dans l’ordre suivant  :
	- Section "Channel" :
		- Trié alphabétiquement 
		- Avatar channel : 
			- Si nouveaux messages afficher le nombre en rouge en haut à droite de l’avatar
		- Nom channel
	- Section "Contact" (User liée à l'utilisateur) :
		- trié par statut puis alphabétiquement 
		- Avatar User : 
			- Statuts des user en bas à droite de l’avatar
			- Si nouveaux messages afficher le nombre en rouge en haut à droite de l’avatar
		- Username
- Chaque ligne disposera d'un menu déroulant d'icone pour lien vers fonctionnalité : 
	- Section "Channel" :
		- Visage : ouverture « Détails Channel »
		- Settings : ouverture « Gestion Channel » avec présélection de cette channel
		- Croix rouge : quitter la channel + box confirmation
	- Section "Contact" :
		- Visage : Lien vers profil voir « User Profil »
		- Raquette : voir « Proposer Partie Privée »
		- Croix rouge : enlever de la liste d’amis + box confirmation
		- Main rouge : bloquer user et enlever de la liste d’amis + box confirmation

> **Action**

- Sur la ligne d'une channel / d'un user :
	- Au clic ouverture [Conversation](./05C_Conversation.md) 
	- Au clic droit ou clic maintenu ou survol sur la droite : afficher menu déroulant d’icone venant de la droite

1.	Au clic sur la ligne ouverture « Conversation »
2.	Au clic droit sur la ligne ou clic maintenu sur la ligne ou survol sur la droite : menu déroulant d’icone venant de la droite :


> **Gestion Erreur**

> **Gestion Succès**

