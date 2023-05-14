# Module Chat - Section Détails Channel

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

1.	Sur la première ligne :
a.	Affichage : 
i.	Avatar Channel
ii.	Nom Channel
b.	Action : 
i.	Au clic sur la ligne ouverture « Conversation »
ii.	Au clic droit sur la ligne ou clic maintenu sur la ligne ou survol sur la droite : menu déroulant d’icone venant de la droite :
1.	Settings : ouverture « Gestion Channel » avec présélection de cette channel
2.	Croix rouge : quitter la channel + box confirmation (Si l’utilisateur courant est propriétaire, l’opérateur le plus ancien devient propriétaire, si aucun operateur alors c’est le membre le plus ancien, si aucun close la channel.) 
2.	Topic : afficher topic
3.	3 sections (Propriétaire / Admin / Membre) avec bouton à gauche permettant d’ouvrir (flèche orientée à droite) / réduire (flèche orientée vers le bas) la section et utilisateur trié alphabétiquement (Voir API – GET channel_user – pour obtenir la liste des user d’un chanel) : 
a.	Afficher : 
i.	Avatar
ii.	Username
iii.	Si membre de la channel statuts des user en bas à droite de l’avatar (vert = dispo / rouge = inGame / gris = absent) (Voir API – GET list_contact_status) Action : 
iii.	Au clic sur la ligne ouverture « Conversation »
iv.	Au clic droit sur la ligne ou clic maintenu sur la ligne ou survol sur la droite : 
1.	Visage : Lien vers profil voire « User Profile »
2.	Message : démarrer une conversation privée voir « Conversation »
3.	Si operateur/propriétaire une croix rouge :  kick le contact de la channel (si rôle user est opérateur ne peux pas kick un autre opérateur ou propriétaire)
4.	Si operateur/propriétaire une main rouge : ban le user de la channel et le kick (si rôle user est opérateur ne peux pas ban et kick un autre opérateur ou propriétaire.)

> **Action**

> **Gestion Erreur**

> **Gestion Succès**

