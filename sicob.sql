# Host: localhost:3307  (Version 5.5.5-10.2.8-MariaDB)
# Date: 2019-03-20 23:26:46
# Generator: MySQL-Front 6.0  (Build 3.1)


#
# Structure for table "adonis_schema"
#

DROP TABLE IF EXISTS `adonis_schema`;
CREATE TABLE `adonis_schema` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `batch` int(11) DEFAULT NULL,
  `migration_time` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;

#
# Data for table "adonis_schema"
#

/*!40000 ALTER TABLE `adonis_schema` DISABLE KEYS */;
INSERT INTO `adonis_schema` VALUES (1,'1503250034279_user',1,'2019-03-20 22:34:36'),(2,'1503250034280_token',1,'2019-03-20 22:34:36'),(3,'1553083556642_centro_schema',1,'2019-03-20 22:34:37');
/*!40000 ALTER TABLE `adonis_schema` ENABLE KEYS */;

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
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

#
# Data for table "centros"
#

/*!40000 ALTER TABLE `centros` DISABLE KEYS */;
INSERT INTO `centros` VALUES (1,'Centro de Tecnologia','PICI -UFC ','PICI','Fortaleza','ct.ufc.br','2019-03-20 00:00:00','2019-03-20 00:00:00');
/*!40000 ALTER TABLE `centros` ENABLE KEYS */;

#
# Structure for table "tokens"
#

DROP TABLE IF EXISTS `tokens`;
CREATE TABLE `tokens` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(10) unsigned DEFAULT NULL,
  `token` varchar(255) NOT NULL,
  `type` varchar(80) NOT NULL,
  `is_revoked` tinyint(1) DEFAULT 0,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `tokens_token_unique` (`token`),
  KEY `tokens_user_id_foreign` (`user_id`),
  KEY `tokens_token_index` (`token`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

#
# Data for table "tokens"
#


#
# Structure for table "users"
#

DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(80) NOT NULL,
  `nome` varchar(254) NOT NULL,
  `endereco` varchar(254) NOT NULL,
  `id_centro` int(11) unsigned NOT NULL,
  `site` varchar(254) NOT NULL,
  `tipo` varchar(254) NOT NULL,
  `email` varchar(254) NOT NULL,
  `password` varchar(60) NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_username_unique` (`username`),
  UNIQUE KEY `users_email_unique` (`email`),
  KEY `users_id_centro_foreign` (`id_centro`)
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;

#
# Data for table "users"
#

/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'diatec','Departamento de Integração Academica e Tecnologia','PICI - UFC, BL 710',1,'http://www.diatec.ufc.br','Normal','diatec@diatec.ufc.br','$2a$10$2tZ1JqJjJPqf6qO1390iiez4ZOtpdoL3sxwtqV.Z5EM3YTXY34aAy','2019-03-20 22:04:06','2019-03-20 22:04:31'),(2,'root','root','PICI - UFC, BL 710',1,'root','Gerente','root@root','$2a$10$j4wKUsLlLMiMmG4K/u2Wven1DhAMATMdaWRNEmjoWzMbTcV0ie4h6','2019-03-20 22:02:34','2019-03-20 22:02:34');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
