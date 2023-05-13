# Module Chat - Section Conversation

**[Retour Page Inception](./00_Page_Inception.md)**

# Point Ouvert

# API Liée
- [API 07 - Message](../API/07_Message.md)
# Regle de gestion

## Inspiration
<p align="center">
	<img src="./Inspiration/" />
</p>

## Etape

> **Affichage**

1.	2 sections : 
a.	Section principale pour l’affichage des messages (Voir API – message_received – pour récupérer l’historique des messages – ne pas charger l’ensemble directement mais uniquement petit à petit) :
i.	Affichage de chaque message :
1.	Reçu : Justifié à gauche
2.	Envoyé : Justifié à droit
3.	Première ligne : 
a.	Avatar de l’utilisateur
b.	Nom de l’avatar 
c.	Date et heure réception
4.	Ligne suivante tous les message reçu / envoyé à la suite (sauf si interruption entre temps ou plus de 5 min entre 2 messages)
ii.	Action : Au clic et au passage sur la première ligne d’un message (nom) afficher menu déroulant sur la droite :
1.	Visage : Lien vers profil voire « User Profile »
2.	Raquette : voir « Proposer Partie Privée »
3.	Si conversation privée : 
a.	Croix rouge : enlever de la liste d’amis et supprimer message
b.	Main rouge : bloquer user et enlever de la liste d’amis
4.	Si conversation dans une channel : 
a.	Message : démarrer une conversation privée voir « Conversation »
b.	Si operateur/propriétaire une croix rouge :  kick le contact de la channel (si rôle user est opérateur ne peux pas kick un autre opérateur ou propriétaire)
c.	Si operateur/propriétaire une main rouge : ban le user de la channel et le kick (si rôle user est opérateur ne peux pas ban et kick un autre opérateur ou propriétaire)
b.	Une section d’envoi : 
i.	Une section pour écrire
ii.	Un bouton pour l’envoie
iii.	Un bouton pour sélectionner des emojis
2.	Si c’est une channel protégé par password : 
a.	Envoyer un message automatique « This channel is password protected. Please enter password : »
b.	Si password ok : ajouter user à la channel et annoncer aux autres utilisateurs
c.	Si password fault : message « Incorect password. Please enter password : »

> **Action**

> **Gestion Erreur**

> **Gestion Succès**

