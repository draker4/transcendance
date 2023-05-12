-- Créer une base de données nommée "transcendence"
CREATE DATABASE transcendence;

-- Créer un utilisateur avec tous les privilèges
CREATE USER DATA_BASE_USER WITH PASSWORD DATA_BASE_PASSWORD;

-- Accorder tous les privilèges à l'utilisateur sur toutes les bases de données existantes
GRANT ALL PRIVILEGES ON DATABASE postgres TO DATA_BASE_USER;

-- Utiliser la base de données "transcendence"
\c transcendence

#Creer la table des users 
CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

#Peuple la table avec deux un utilisateur avec username = admin , password = admin , email = admin@transcendence.com
INSERT INTO `users` (`id`, `username`, `password`, `email`) VALUES (1, 'admin', 'admin', 'admin@transcendence.com');

# Creer un