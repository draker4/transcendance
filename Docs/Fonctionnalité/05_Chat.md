# Module Chat

**[Retour Page Inception](./00_Page_Inception.md)**

# Point Ouvert

# API Liée

# Regle de gestion

## Inspiration
<p align="center">
	<img src="./Inspiration/" />
</p>

## Etape

> **Affichage**

> **Action**

> **Gestion Erreur**

> **Gestion Succès**

Composé de 2 sections :
1.	Bande latérale à gauche :
a.	Icone recherche en haut pour revenir à la section « Home »
b.	Liste d’icone avec avatar chanel / contact en cours de conversation avec user (Voir API – message_received) :
i.	Afficher : 
1.	Statuts des user en bas à gauche de l’avatar (vert = dispo / rouge = inGame / gris = absent) (Voir API – GET list_contact_status)
2.	Si nouveaux messages afficher le nombre en rouge en haut à droite de l’avatar (Voir API –message_received)
ii.	Au clic sur icone :
1.	Si non sélectionné afficher « Conversation » + donner l’impression que l’icône est sélectionnée
2.	Si sélectionné revenir à l’affichage « Home » + désélectionné l’icone
2.	Partie principale du chat avec 4 sous-section/version :
a.	« Home » : module d’affichage de la liste des channels et contact de l’utilisateur
b.	« Recherche Chat » : module d’affichage de recherche dans l’ensemble des channels et des utilisateurs sur la base des charactères entrées (3 au minimums).
c.	« Conversation » : module de conversation privé et dans chanel
d.	« Détails Channel » : liste d’utilisateur d’une channel et gestion pour admin
