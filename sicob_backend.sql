# Host: localhost  (Version 5.7.25-0ubuntu0.18.04.2)
# Date: 2019-03-20 09:53:12
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
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;

#
# Data for table "adonis_schema"
#

INSERT INTO `adonis_schema` VALUES (1,'1503250034279_user',1,'2019-03-20 08:55:39'),(2,'1503250034280_token',1,'2019-03-20 08:55:41'),(3,'1553083556642_centro_schema',2,'2019-03-20 09:12:31');

#
# Structure for table "centros"
#

DROP TABLE IF EXISTS `centros`;
CREATE TABLE `centros` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `nome` varchar(246) NOT NULL,
  `endereco` varchar(246) NOT NULL,
  `campus` varchar(246) NOT NULL,
  `cidade` varchar(246) NOT NULL,
  `site` varchar(246) NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

#
# Data for table "centros"
#

INSERT INTO `centros` VALUES (1,'Centro de Tecnologia','Campus do Pici - Bloco 710 - CEP 60455-900 - Fortaleza - CE ','PICI','Fortaleza','http://www.ct.ufc.br','2019-03-20 09:43:56','2019-03-20 09:43:56');

#
# Structure for table "users"
#

DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(80) NOT NULL,
  `nome` varchar(254) NOT NULL,
  `endereco` varchar(254) NOT NULL,
  `id_centro` int(11) NOT NULL,
  `site` varchar(254) NOT NULL,
  `tipo` varchar(254) NOT NULL,
  `email` varchar(254) NOT NULL,
  `password` varchar(60) NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_username_unique` (`username`),
  UNIQUE KEY `users_email_unique` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

#
# Data for table "users"
#

INSERT INTO `users` VALUES (1,'root','ROOT','Campus do PICI - Centro de Tecnologia, bc 701',1,'roo.com','Gerente','root@root','$2a$10$gxlbGjy.BsFfrja6/.z8IueONrygCc35Xzw0k1OVontWz3rarj6KW','2019-03-20 08:58:57','2019-03-20 08:58:57');

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

