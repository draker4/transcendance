# Module Profil User Détaillé

**[Retour Page Inception](./00_Page_Transcendence.md)**

# Point Ouvert
- pour le moment je met en place un depart -> page qui donne sur le profil l'overview du profil utilisateur
  route : localhost:3000/profil  |  fichier frontend (`loumarti`)

# API Liée
- [API 20 - Info User](../API/20_Info_User.md)
- [API 21 - Update User](../API/21_Update_User.md)

# Regle de gestion

## Inspiration
<p align="center">
	<img src="./Inspiration/" />
</p>

## Etape

> **Affichage**

- Texte de présentation "Bio"
- Niveau
- Pourcentage de victoire
- Resultat des match (Victoire / Nul / Défaite)
- Nombre de Match

> **Action**

- Si User est l'utilisateur :
	- Texte de présentation devient champ texte pour modification puis à la touche entrée ou clic ailleurs sauvegarde avec [API 21 - Update User](../API/21_Update_User.md) uniquement si modification détecté

> **Gestion Erreur**

> **Gestion Succès**
