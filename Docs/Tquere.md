

# Ajout du 10/05

- Creation structure projet ( docker , makefile , dossier...)
- Creation du docker pour le frontend avec React

# Ajout du 11/05

- Modification du docker React pour ajouter NextJS

    - React + NextJS

        React : Framwork front avec utilisation de composant reutilisable et REACTif ;)

        NextJS : Framework open-source pour React qui facilite la création d'applications web côté client et côté serveur. Il fournit des fonctionnalités avancées telles que le rendu côté serveur, l'optimisation des performances, le routage côté serveur et la prise en charge des pages statiques et dynamiques.

    - Ecoute sur le port 3000

    - Configuré pour faire des requetes vers le port 4000

    - Ajout configuration de base NextJS et Typescript

    - Pourquoi ajouter NextJS ?

        Ajoute des fonctionalité pour le routage, la structuration du projet , la simplification de l'écriture en React.

- Ajout de code basique dans /Frontend/src a titre d'exemple

![](./imgs/first.png)

## Quelques infos utiles : 

- Tout le code associé au frontend est dans Frontend/transcendence-app

- Seul le contenu du dossier src et public à besoin d'etre modifié, le reste c'est des package et de la configuration pour React , TypeScript et NextJS

- Public contient toutes les ressources utilisé ( icone , favicon ..)

![](./imgs/frontend.png)

- Le dossier components contient tout les composants que l'on va faire et réutiliser au fur et à mesure ( des composants peuvent contenir d'autres composants ;) )

- Le dossier pages contient les pages de notre projet. Ces pages contiennent nos composants.

- Le dossier services contient des classes utilisées pour stocker des données. Mais elle contiennent surtout toutes les fonctions utilisées pour faire les requettes vers le backend..

- Le dossier styles contient toutes les fichiers css utilisés dans nos pages et nos composants.

- Il existe aussi deux page "_app" et "_document" , c'est la configuration des page par defaut. Attention au modification. Ces pages utilisent le fichier css global.css




