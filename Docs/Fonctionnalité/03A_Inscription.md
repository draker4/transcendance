# Module Inscription

**[Retour Page Inception](./00_Page_Inception.md)**

# Point Ouvert

# API Liée

# Regle de gestion

1.	Login (uniquement pour se connecter – non modifiable par la suite – invisible des autres utilisateur):
a.	Checker caractère interdit
b.	Checker si disponible
2.	Username (modifiable par la suite – visible des autres utilisateur – minimum 3 chars) :
a.	Checker caractère interdit
b.	Checker si disponible
3.	Nom :
a.	Checker caractère interdit
b.	Checker si disponible
4.	Prénom :
a.	Checker caractère interdit
b.	Checker si disponible
5.	Email :
a.	Checker si format email valide
6.	Téléphone :
a.	Checker si format téléphone valide
7.	Password : 
a.	Prévoir module validation difficulté
b.	« Œil » pour voir mot de passe
8.	Confirmation Password :
a.	Checker si pareil
b.	Empêcher copier-coller
9.	Bouton « Sign Up » - au click ou touche entrée :
a.	Si l’ensemble est ok :
i.	Post info utilisateur pour création du compte
ii.	Passer au module settings
b.	Si une des conditions précédentes non remplis afficher erreur
