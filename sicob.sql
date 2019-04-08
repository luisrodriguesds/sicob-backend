# Host: localhost  (Version 5.7.25-0ubuntu0.18.04.2)
# Date: 2019-04-08 09:38:46
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
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=latin1;

#
# Data for table "adonis_schema"
#

INSERT INTO `adonis_schema` VALUES (1,'1503250034279_user',1,'2019-03-21 09:21:16'),(2,'1503250034280_token',1,'2019-03-21 09:21:17'),(3,'1553170275958_center_schema',1,'2019-03-21 09:21:18'),(4,'1553170947389_add_relationship_center_user_schema',2,'2019-03-21 09:24:42'),(5,'1553172689589_category_schema',3,'2019-03-26 09:33:05'),(6,'1553601603184_subcategory_schema',4,'2019-03-26 09:36:10'),(7,'1553871691605_product_schema',5,'2019-03-29 12:27:46'),(8,'1553873378042_image_schema',6,'2019-03-29 12:33:13');

#
# Structure for table "categories"
#

DROP TABLE IF EXISTS `categories`;
CREATE TABLE `categories` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(254) NOT NULL,
  `thumb` varchar(254) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;

#
# Data for table "categories"
#

INSERT INTO `categories` VALUES (1,'Moveis',NULL,NULL,NULL),(2,'Eletronicos',NULL,NULL,NULL),(5,'Escritorio',NULL,NULL,NULL);

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
# Structure for table "subcategories"
#

DROP TABLE IF EXISTS `subcategories`;
CREATE TABLE `subcategories` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(254) NOT NULL,
  `thumb` varchar(254) DEFAULT NULL,
  `category_id` int(10) unsigned NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `subcategories_category_id_foreign` (`category_id`),
  CONSTRAINT `subcategories_category_id_foreign` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=latin1;

#
# Data for table "subcategories"
#

INSERT INTO `subcategories` VALUES (1,'Mesa',NULL,1,NULL,NULL),(2,'Cadeira',NULL,1,NULL,NULL),(3,'Escrivaninha',NULL,5,NULL,NULL),(4,'Computadores',NULL,2,NULL,NULL),(5,'Acessorios',NULL,2,NULL,NULL),(6,'TV',NULL,2,NULL,NULL),(7,'Áudio','dfvdsfv',2,NULL,'2019-03-29 11:31:03'),(8,'Sofa',NULL,1,NULL,NULL),(9,'Cadeira',NULL,5,NULL,NULL),(10,'Acessorios',NULL,5,NULL,NULL);

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
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;

#
# Data for table "users"
#

INSERT INTO `users` VALUES (1,'root','ROOT','Campus do PICI - Centro de Tecnologia, bc 701','roo.com','Gerente','root@root','$2a$10$AQJzaaPUUUvoUFgrUvhZtuDAmBjekF6kEzeR7z/xMMdWcn7HttW9e','2019-03-21 09:27:32','2019-03-21 09:27:32',1),(2,'diatec','Departamento Integração Acadêmica de Tecnologia','Campus do PICI - Centro de Tecnologia, bc 710','www.diatec.ufc.br','Normal','secretaria@diatec.ufc.br','$2a$10$vdZjsMkGhnM1BGP3qMJSMu9zdsfOYJovYuCeJ7kagwl5V43wW879a','2019-04-01 08:37:53','2019-04-01 08:37:53',1);

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


#
# Structure for table "products"
#

DROP TABLE IF EXISTS `products`;
CREATE TABLE `products` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(254) NOT NULL,
  `description` mediumtext,
  `num_patrimony` varchar(254) DEFAULT NULL,
  `user_id` int(11) unsigned DEFAULT NULL,
  `category_id` int(10) unsigned DEFAULT NULL,
  `subcategory_id` int(10) unsigned DEFAULT NULL,
  `address` varchar(254) DEFAULT NULL,
  `latitude` decimal(9,6) NOT NULL,
  `longitude` decimal(9,6) NOT NULL,
  `status` int(11) NOT NULL DEFAULT '1',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `products_user_id_foreign` (`user_id`),
  KEY `products_category_id_foreign` (`category_id`),
  KEY `products_subcategory_id_foreign` (`subcategory_id`),
  CONSTRAINT `products_category_id_foreign` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `products_subcategory_id_foreign` FOREIGN KEY (`subcategory_id`) REFERENCES `subcategories` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `products_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;

#
# Data for table "products"
#

INSERT INTO `products` VALUES (2,'Mesa de escritório','Mesa em ótimo estado','5185481',1,5,9,'Campus do PICI',-3.744153,-38.577805,1,'2019-04-01 09:37:18','2019-04-01 09:37:18'),(3,'Cadeira de escritório','O departamento oferece uma cadeira de escritorio em otimo estado!','89797522',1,1,2,'Campus do PICI',-3.742673,-38.574322,1,'2019-04-01 10:33:20','2019-04-01 10:33:20'),(4,'Telefone sem fio','O departamento oferece um telefone sem fio que está em desuso, porém em otimo estado!','89797522',1,1,2,'Campus do PICI',-27.204534,-27.204534,1,'2019-04-01 15:09:53','2019-04-01 15:09:53');

#
# Structure for table "images"
#

DROP TABLE IF EXISTS `images`;
CREATE TABLE `images` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `product_id` int(10) unsigned DEFAULT NULL,
  `path` varchar(256) NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `images_product_id_foreign` (`product_id`),
  CONSTRAINT `images_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=latin1;

#
# Data for table "images"
#

INSERT INTO `images` VALUES (5,3,'1554148051567-Google_Images_2015_logo.svg.png','2019-04-01 16:47:31','2019-04-01 16:47:31'),(6,3,'1554148051567-Google-Projetual.jpg','2019-04-01 16:47:31','2019-04-01 16:47:31');
