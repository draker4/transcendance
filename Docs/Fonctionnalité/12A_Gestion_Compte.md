# Module Settings

**[Retour Page Inception](./00_Page_Inception.md)**

# Point Ouvert

# API Liée

# Regle de gestion

11.1.	Gestion Compte Utilisateur
1.	Avatar : 
a.	Si non définis : prévoir image par défaut
b.	Section « Édit » au survol/click proposition :
i.	« Choose » : Module proposition d’avatar 
ii.	« Download » : Module avatar externe
2.	Username (visible des autres utilisateur – minimum 3char) :
a.	Modifiable - si vide sauvegarde impossible 
b.	Checker si disponible
3.	Prénom :
a.	Si utilisateur 42 : reprendre de l’api et champ grisé/ non modifiable
b.	Si utilisateur Crunch : modifiable - si vide sauvegarde impossible 
4.	Nom :
a.	Si utilisateur 42 : reprendre de l’api et champ grisé/ non modifiable
b.	Si utilisateur Crunch : modifiable - si vide sauvegarde impossible 
5.	Email : 
a.	Si utilisateur 42 : reprendre de l’api et champ grisé/ non modifiable
b.	Si utilisateur Crunch : modifiable si double authentification non activé - si vide sauvegarde impossible
6.	Téléphone : 
a.	Si utilisateur 42 : reprendre de l’api et champ grisé/ non modifiable
b.	Si utilisateur Crunch : modifiable si double authentification non activé - si vide sauvegarde impossible
7.	Password :
a.	Si utilisateur Crunch uniquement
8.	Case Double authentification : 
a.	Si activation : module activation double authentification
b.	SI désactivation : module annuler double authentification
9.	Bouton “Save” : 
a.	Post modification de l’utilisateur
10.	Bouton “Cancel” ou bouton croix : 
a.	Si utilisateur Registered : 
i.	Si aucune modification détecter revenir à la page d’accueil
ii.	Si modification box erreur « your change will be lost: confirm/back»
b.	Si utilisateur non Registered : box erreur « your inscription will be cancel : confirm/back » ou ne pas l’afficher 
