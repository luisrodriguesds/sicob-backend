# Host: localhost  (Version 5.7.25-0ubuntu0.18.04.2)
# Date: 2019-03-26 09:16:00
# Generator: MySQL-Front 6.1  (Build 1.26)


#
# Structure for table "adonis_schema"
#

DROP TABLE IF EXISTS `adonis_schema`;
CREATE TABLE `adonis_schema` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `batch` int(11) DEFAULT NULL,
  `migration_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;

#
# Data for table "adonis_schema"
#

INSERT INTO `adonis_schema` VALUES (1,'1503250034279_user',1,'2019-03-21 09:21:16'),(2,'1503250034280_token',1,'2019-03-21 09:21:17'),(3,'1553170275958_center_schema',1,'2019-03-21 09:21:18'),(4,'1553170947389_add_relationship_center_user_schema',2,'2019-03-21 09:24:42');

#
# Structure for table "centers"
#

DROP TABLE IF EXISTS `centers`;
CREATE TABLE `centers` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(246) NOT NULL,
  `initials` varchar(246) NOT NULL,
  `address` varchar(246) NOT NULL,
  `campus` varchar(246) NOT NULL,
  `city` varchar(246) NOT NULL,
  `website` varchar(246) NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

#
# Data for table "centers"
#

INSERT INTO `centers` VALUES (1,'Centro de Tecnologia','CT','Campus do Pici - Bloco 710 - CEP 60455-900 - Fortaleza - CE ','PICI','Fortaleza','http://www.ct.ufc.br','2019-03-21 09:21:43','2019-03-21 09:21:43');

#
# Structure for table "users"
#

DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(80) NOT NULL,
  `name` varchar(254) NOT NULL,
  `address` varchar(254) NOT NULL,
  `website` varchar(254) NOT NULL,
  `type` varchar(254) NOT NULL,
  `email` varchar(254) NOT NULL,
  `password` varchar(60) NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `id_center` int(11) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_username_unique` (`username`),
  UNIQUE KEY `users_email_unique` (`email`),
  KEY `users_id_center_foreign` (`id_center`),
  CONSTRAINT `users_id_center_foreign` FOREIGN KEY (`id_center`) REFERENCES `centers` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

#
# Data for table "users"
#

INSERT INTO `users` VALUES (1,'root','ROOT','Campus do PICI - Centro de Tecnologia, bc 701','roo.com','Gerente','root@root','$2a$10$AQJzaaPUUUvoUFgrUvhZtuDAmBjekF6kEzeR7z/xMMdWcn7HttW9e','2019-03-21 09:27:32','2019-03-21 09:27:32',1);

#
# Structure for table "tokens"
#

DROP TABLE IF EXISTS `tokens`;
CREATE TABLE `tokens` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(10) unsigned DEFAULT NULL,
  `token` varchar(255) NOT NULL,
  `type` varchar(80) NOT NULL,
  `is_revoked` tinyint(1) DEFAULT '0',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `tokens_token_unique` (`token`),
  KEY `tokens_user_id_foreign` (`user_id`),
  KEY `tokens_token_index` (`token`),
  CONSTRAINT `tokens_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

#
# Data for table "tokens"
#

