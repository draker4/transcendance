# Module Settings - Section Gestion Channel

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

11.5.	 Gestion des Channel
Lister l’ensemble des channels de l’utilisateur (trié alphabétiquement) :
2.	Affichage :
a.	Avatar de la channel
b.	Nom de la channel
3.	Action : 
a.	Au clic sur la ligne ouverture « Gestion Détail Channel »
b.	Au clic droit sur la ligne ou clic maintenu sur la ligne ou survol sur la droite :
i.	Settings : ouverture « Gestion Détail Channel » avec présélection de cette channel
ii.	Une croix rouge à droite du nom permettant de partir de la channel (Si l’utilisateur courant est propriétaire, l’opérateur le plus ancien devient propriétaire, si aucun operateur alors c’est le membre le plus ancien, si aucun close la channel.) 
11.6.	Gestion Détail Channel 
1.	Sur la première ligne :
a.	Avatar Channel
b.	Nom Channel
c.	Croix rouge : quitter la channel + box confirmation (Si l’utilisateur courant est propriétaire, l’opérateur le plus ancien devient propriétaire, si aucun operateur alors c’est le membre le plus ancien, si aucun close la channel.) 
2.	Topic : afficher topic si Propriétaire / Admin box pour modification et bouton save (informer membre)
3.	3 sections (Propriétaire / Admin / Membre) avec bouton à gauche permettant d’ouvrir (flèche orientée à droite) / réduire (flèche orientée vers le bas) la section et utilisateur trié alphabétiquement (Voir API – GET channel_user – pour obtenir la liste des user d’un chanel) : 
i.	Avatar
ii.	Username
iii.	Si membre de la channel statuts des user en bas à droite de l’avatar (vert = dispo / rouge = inGame / gris = absent) (Voir API – GET list_contact_status) Action :  
ii.	Visage : Lien vers profil voire « Profil User »
iii.	Message : démarrer une conversation privée voir « Conversation »
iv.	Si operateur/propriétaire une croix rouge :  kick le contact de la channel (si rôle user est opérateur ne peux pas kick un autre opérateur ou propriétaire)
v.	Si operateur/propriétaire une main rouge : ban le user de la channel et le kick (si rôle user est opérateur ne peux pas ban et kick un autre opérateur ou propriétaire)
