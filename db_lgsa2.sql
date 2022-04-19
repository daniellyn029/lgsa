/*
SQLyog Ultimate v10.00 Beta1
MySQL - 5.7.23 : Database - db_lgsa2
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`db_lgsa2` /*!40100 DEFAULT CHARACTER SET latin1 */;

USE `db_lgsa2`;

/*Table structure for table `keys` */

DROP TABLE IF EXISTS `keys`;

CREATE TABLE `keys` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `key` varchar(40) COLLATE utf8mb4_unicode_ci NOT NULL,
  `level` int(2) NOT NULL,
  `ignore_limits` tinyint(1) NOT NULL DEFAULT '0',
  `date_created` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Data for the table `keys` */

/*Table structure for table `lgsa_assignment` */

DROP TABLE IF EXISTS `lgsa_assignment`;

CREATE TABLE `lgsa_assignment` (
  `lgsa_assignment_id` int(11) NOT NULL AUTO_INCREMENT,
  `lgsa_client_id` int(11) NOT NULL,
  `lgsa_employee_id` int(11) NOT NULL,
  `lgsa_assignment_rate` float(11,2) NOT NULL,
  `lgsa_assignment_days` int(11) NOT NULL,
  `lgsa_assignment_daily_rate` float(11,2) NOT NULL,
  `lgsa_assignment_status` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_created` datetime NOT NULL,
  `is_updated` datetime NOT NULL,
  PRIMARY KEY (`lgsa_assignment_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Data for the table `lgsa_assignment` */

/*Table structure for table `lgsa_billing` */

DROP TABLE IF EXISTS `lgsa_billing`;

CREATE TABLE `lgsa_billing` (
  `lgsa_billing_id` int(11) NOT NULL AUTO_INCREMENT,
  `lgsa_billing_control_id` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lgsa_billing_client_id` int(11) DEFAULT NULL,
  `lgsa_billing_client_name` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lgsa_billing_client_address` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lgsa_billing_date_issued` date DEFAULT NULL,
  `lgsa_billing_contact_number` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lgsa_billing_amount` float(11,2) DEFAULT NULL,
  `lgsa_billing_particulars` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lgsa_billing_prepared_by_employee_id` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lgsa_billing_prepared_by_employee_name` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lgsa_billing_approved_by_employee_id` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lgsa_billing_approved_by_name` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lgsa_billing_approved_date` date DEFAULT NULL,
  `lgsa_billing_status` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_created` datetime DEFAULT NULL,
  `is_updated` datetime DEFAULT NULL,
  PRIMARY KEY (`lgsa_billing_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Data for the table `lgsa_billing` */

insert  into `lgsa_billing`(`lgsa_billing_id`,`lgsa_billing_control_id`,`lgsa_billing_client_id`,`lgsa_billing_client_name`,`lgsa_billing_client_address`,`lgsa_billing_date_issued`,`lgsa_billing_contact_number`,`lgsa_billing_amount`,`lgsa_billing_particulars`,`lgsa_billing_prepared_by_employee_id`,`lgsa_billing_prepared_by_employee_name`,`lgsa_billing_approved_by_employee_id`,`lgsa_billing_approved_by_name`,`lgsa_billing_approved_date`,`lgsa_billing_status`,`is_created`,`is_updated`) values (1,NULL,1,'Seda Hotel','Cebu City','2020-04-08','54328509530',12.00,'asdasdasd','1000','Vincent Paul I. Lim',NULL,NULL,NULL,'Pending','2020-04-26 00:09:56',NULL),(2,NULL,2,'Bai Hotel','Ayala','2020-04-08','234554353',32.00,'qweqweqwe','','',NULL,NULL,NULL,'Pending','2020-04-26 01:01:27',NULL),(3,NULL,2,'Bai Hotel','Ayala','2020-04-08','234554353',323.00,'yuy','','',NULL,NULL,NULL,'Pending','2020-04-26 01:02:02',NULL),(4,NULL,1,'Seda Hotel','Cebu City','2020-04-30','54328509530',5090.00,'Bisag unsa','1000','Vincent Paul I. Lim',NULL,NULL,NULL,'Pending','2020-04-26 01:06:18',NULL),(5,'2020-BIL1001',1,'Seda Hotel','Cebu City','2020-04-30','54328509530',1000.00,'wqeqweqwe','1000','Vincent Paul I. Lim',NULL,NULL,NULL,'Pending','2020-04-30 02:05:57',NULL);

/*Table structure for table `lgsa_cash_advance` */

DROP TABLE IF EXISTS `lgsa_cash_advance`;

CREATE TABLE `lgsa_cash_advance` (
  `lgsa_cash_advance_id` int(11) NOT NULL AUTO_INCREMENT,
  `lgsa_cash_advance_requested_by_employee_id` int(11) DEFAULT NULL,
  `lgsa_cash_advance_requested_by_name` varchar(50) DEFAULT NULL,
  `lgsa_cash_advance_employee_id` varchar(50) DEFAULT NULL,
  `lgsa_cash_advance_control_no` varchar(50) DEFAULT NULL,
  `lgsa_cash_advance_name` varchar(50) DEFAULT NULL,
  `lgsa_cash_advance_date` date DEFAULT NULL,
  `lgsa_cash_advance_client_id` int(11) DEFAULT NULL,
  `lgsa_cash_advance_client_name` varchar(50) DEFAULT NULL,
  `lgsa_cash_advance_client_charge` varchar(50) DEFAULT NULL,
  `lgsa_cash_advance_approved_by_employee_id` varchar(50) DEFAULT NULL,
  `lgsa_cash_advance_approved_by_name` varchar(50) DEFAULT NULL,
  `lgsa_cash_advance_approved_date` date DEFAULT NULL,
  `lgsa_cash_advance_total` float(11,2) DEFAULT NULL,
  `lgsa_cash_advance_status` varchar(50) DEFAULT NULL,
  `is_created` datetime DEFAULT NULL,
  `is_updated` datetime DEFAULT NULL,
  PRIMARY KEY (`lgsa_cash_advance_id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=latin1;

/*Data for the table `lgsa_cash_advance` */

insert  into `lgsa_cash_advance`(`lgsa_cash_advance_id`,`lgsa_cash_advance_requested_by_employee_id`,`lgsa_cash_advance_requested_by_name`,`lgsa_cash_advance_employee_id`,`lgsa_cash_advance_control_no`,`lgsa_cash_advance_name`,`lgsa_cash_advance_date`,`lgsa_cash_advance_client_id`,`lgsa_cash_advance_client_name`,`lgsa_cash_advance_client_charge`,`lgsa_cash_advance_approved_by_employee_id`,`lgsa_cash_advance_approved_by_name`,`lgsa_cash_advance_approved_date`,`lgsa_cash_advance_total`,`lgsa_cash_advance_status`,`is_created`,`is_updated`) values (1,12354,'Secretary or Inspector','12312','123123456','Daniellyn Camocamo','2020-04-28',2,'Bai Hotel','500',NULL,'John','2020-04-29',NULL,'Pending',NULL,NULL),(2,1000,'Vincent Paul I. Lim',NULL,NULL,NULL,'2020-04-29',1,'Seda Hotel','qwe',NULL,NULL,NULL,NULL,'Pending','2020-04-29 22:16:36',NULL),(3,1000,'Vincent Paul I. Lim',NULL,NULL,NULL,'2020-04-29',2,'Bai Hotel','vvsdasdasd',NULL,NULL,NULL,NULL,'Pending','2020-04-29 22:28:03',NULL),(4,1000,'Vincent Paul I. Lim',NULL,NULL,NULL,'2020-04-30',1,'Seda Hotel','wqeqweqw',NULL,NULL,NULL,NULL,'Pending','2020-04-30 01:15:38',NULL),(5,1000,'Vincent Paul I. Lim',NULL,'',NULL,'2020-04-30',2,'Bai Hotel','qweqweqw',NULL,NULL,NULL,NULL,'Pending','2020-04-30 01:22:55',NULL),(6,1000,'Vincent Paul I. Lim',NULL,'2020-CA1003',NULL,'2020-04-30',2,'Bai Hotel','fdfdfdf',NULL,NULL,NULL,NULL,'Pending','2020-04-30 01:23:51',NULL),(7,1000,'Vincent Paul I. Lim',NULL,'2020-CA1004',NULL,'2020-04-30',1,'Seda Hotel','asdasd',NULL,NULL,NULL,NULL,'Pending','2020-04-30 01:25:42',NULL),(8,1000,'Vincent Paul I. Lim',NULL,'',NULL,'2020-04-30',2,'Bai Hotel','',NULL,NULL,NULL,NULL,'Pending','2020-04-30 23:05:58',NULL),(9,1000,'Vincent Paul I. Lim',NULL,'2020-CA000002',NULL,'2020-04-30',2,'Bai Hotel','',NULL,NULL,NULL,NULL,'Pending','2020-04-30 23:08:54',NULL),(10,1000,'Vincent Paul I. Lim',NULL,'2020-CA000003',NULL,'2020-04-30',1,'Seda Hotel','',NULL,NULL,NULL,NULL,'Pending','2020-04-30 23:14:33',NULL),(11,1000,'Vincent Paul I. Lim',NULL,'2020-CA000004',NULL,'2020-04-30',1,'Seda Hotel','',NULL,NULL,NULL,NULL,'Pending','2020-04-30 23:17:01',NULL),(12,1000,'Vincent Paul I. Lim',NULL,'2020-CA000005',NULL,'2020-04-30',1,'Seda Hotel','',NULL,NULL,NULL,NULL,'Pending','2020-04-30 23:23:02',NULL);

/*Table structure for table `lgsa_cashadvance_employee_name` */

DROP TABLE IF EXISTS `lgsa_cashadvance_employee_name`;

CREATE TABLE `lgsa_cashadvance_employee_name` (
  `lgsa_cashadvance_employee_name_id` int(11) NOT NULL AUTO_INCREMENT,
  `lgsa_cashadvance_control_no` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lgsa_cashadvance_employee_id` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lgsa_cashadvance_name` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lgsa_cashadvance_employee_amount` float(11,2) DEFAULT NULL,
  `lgsa_cashadvance_prepared_by_id` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lgsa_cashadvance_prepared_by_name` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`lgsa_cashadvance_employee_name_id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Data for the table `lgsa_cashadvance_employee_name` */

insert  into `lgsa_cashadvance_employee_name`(`lgsa_cashadvance_employee_name_id`,`lgsa_cashadvance_control_no`,`lgsa_cashadvance_employee_id`,`lgsa_cashadvance_name`,`lgsa_cashadvance_employee_amount`,`lgsa_cashadvance_prepared_by_id`,`lgsa_cashadvance_prepared_by_name`) values (1,'2020-CA000001','1003','',500.00,'1000','Vincent Paul I. Lim'),(2,'2020-CA000001','1000','',230.00,'1000','Vincent Paul I. Lim'),(3,'2020-CA000001','10101010','',123.00,'1000','Vincent Paul I. Lim'),(4,'2020-CA000002','1003','',123.00,'1000','Vincent Paul I. Lim'),(5,'2020-CA000002','1001','',3434.00,'1000','Vincent Paul I. Lim'),(6,'2020-CA000002','10101010','',34.00,'1000','Vincent Paul I. Lim'),(7,'2020-CA000003','1003','',213.00,'1000','Vincent Paul I. Lim'),(8,'2020-CA000003','10101010','',434.00,'1000','Vincent Paul I. Lim'),(9,'2020-CA000003','1000','Vincent Paul I. Lim',321.00,'1000','Vincent Paul I. Lim'),(10,'2020-CA000004','1003','',100.00,'1000','Vincent Paul I. Lim'),(11,'2020-CA000004','10101010','',200.00,'1000','Vincent Paul I. Lim'),(12,'2020-CA000005','1003','Daniellyn Z. Camocamo',256.00,'1000','Vincent Paul I. Lim'),(13,'2020-CA000005','10101010','Michael J. Nelly',321.00,'1000','Vincent Paul I. Lim');

/*Table structure for table `lgsa_client` */

DROP TABLE IF EXISTS `lgsa_client`;

CREATE TABLE `lgsa_client` (
  `lgsa_client_id` int(11) NOT NULL AUTO_INCREMENT,
  `lgsa_client_business_name` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lgsa_client_contact_person` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lgsa_client_business_add` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lgsa_client_tel_num` varchar(11) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lgsa_client_email` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lgsa_client_ds_working_hours` float(11,2) DEFAULT NULL,
  `lgsa_client_ns_working_hours` float(11,2) DEFAULT NULL,
  `lgsa_client_ds_annual_factor` float(11,2) DEFAULT NULL,
  `lgsa_client_ns_annual_factor` float(11,2) DEFAULT NULL,
  `lgsa_client_ds_minimum_daily_rate` float(11,2) DEFAULT NULL,
  `lgsa_client_ns_minimum_daily_rate` float(11,2) DEFAULT NULL,
  `lgsa_client_ds_average_pay_per_month` float(11,2) DEFAULT NULL,
  `lgsa_client_ns_average_pay_per_month` float(11,2) DEFAULT NULL,
  `lgsa_client_ds_5_days_incentive` float(11,2) DEFAULT NULL,
  `lgsa_client_ns_5_days_incentive` float(11,2) DEFAULT NULL,
  `lgsa_client_ds_13th_month_pay` float(11,2) DEFAULT NULL,
  `lgsa_client_ns_13th_month_pay` float(11,2) DEFAULT NULL,
  `lgsa_client_ds_retirement_benefits` float(11,2) DEFAULT NULL,
  `lgsa_client_ns_retirement_benefits` float(11,2) DEFAULT NULL,
  `lgsa_client_ds_uniform_allowance` float(11,2) DEFAULT NULL,
  `lgsa_client_ns_uniform_allowance` float(11,2) DEFAULT NULL,
  `lgsa_client_ds_total_amount_before_ot` float(11,2) DEFAULT NULL,
  `lgsa_client_ns_total_amount_before_ot` float(11,2) DEFAULT NULL,
  `lgsa_client_ds_overtime` float(11,2) DEFAULT NULL,
  `lgsa_client_ns_overtime` float(11,2) DEFAULT NULL,
  `lgsa_client_ns_night_differential` float(11,2) DEFAULT NULL,
  `lgsa_client_ds_total_amount_direct_to_guard` float(11,2) DEFAULT NULL,
  `lgsa_client_ns_total_amount_direct_to_guard` float(11,2) DEFAULT NULL,
  `lgsa_client_ds_sss` float(11,2) DEFAULT NULL,
  `lgsa_client_ns_sss` float(11,2) DEFAULT NULL,
  `lgsa_client_ds_philhealth` float(11,2) DEFAULT NULL,
  `lgsa_client_ns_philhealth` float(11,2) DEFAULT NULL,
  `lgsa_client_ds_pagibig` float(11,2) DEFAULT NULL,
  `lgsa_client_ns_pagibig` float(11,2) DEFAULT NULL,
  `lgsa_client_ds_total_amount_direct_to_govt_in_favor_of_sg` float(11,2) DEFAULT NULL,
  `lgsa_client_ns_total_amount_direct_to_govt_in_favor_of_sg` float(11,2) DEFAULT NULL,
  `lgsa_client_ds_total_amount_direct_to_guard_and_govt` float(11,2) DEFAULT NULL,
  `lgsa_client_ns_total_amount_direct_to_guard_and_govt` float(11,2) DEFAULT NULL,
  `lgsa_client_ds_agency_fee` float(11,2) DEFAULT NULL,
  `lgsa_client_ns_agency_fee` float(11,2) DEFAULT NULL,
  `lgsa_client_ds_vat` float(11,2) DEFAULT NULL,
  `lgsa_client_ns_vat` float(11,2) DEFAULT NULL,
  `lgsa_client_ds_total_contract_rate` float(11,2) DEFAULT NULL,
  `lgsa_client_ns_total_contract_rate` float(11,2) DEFAULT NULL,
  `lgsa_client_status` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_created` datetime DEFAULT NULL,
  `is_updated` datetime DEFAULT NULL,
  PRIMARY KEY (`lgsa_client_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Data for the table `lgsa_client` */

insert  into `lgsa_client`(`lgsa_client_id`,`lgsa_client_business_name`,`lgsa_client_contact_person`,`lgsa_client_business_add`,`lgsa_client_tel_num`,`lgsa_client_email`,`lgsa_client_ds_working_hours`,`lgsa_client_ns_working_hours`,`lgsa_client_ds_annual_factor`,`lgsa_client_ns_annual_factor`,`lgsa_client_ds_minimum_daily_rate`,`lgsa_client_ns_minimum_daily_rate`,`lgsa_client_ds_average_pay_per_month`,`lgsa_client_ns_average_pay_per_month`,`lgsa_client_ds_5_days_incentive`,`lgsa_client_ns_5_days_incentive`,`lgsa_client_ds_13th_month_pay`,`lgsa_client_ns_13th_month_pay`,`lgsa_client_ds_retirement_benefits`,`lgsa_client_ns_retirement_benefits`,`lgsa_client_ds_uniform_allowance`,`lgsa_client_ns_uniform_allowance`,`lgsa_client_ds_total_amount_before_ot`,`lgsa_client_ns_total_amount_before_ot`,`lgsa_client_ds_overtime`,`lgsa_client_ns_overtime`,`lgsa_client_ns_night_differential`,`lgsa_client_ds_total_amount_direct_to_guard`,`lgsa_client_ns_total_amount_direct_to_guard`,`lgsa_client_ds_sss`,`lgsa_client_ns_sss`,`lgsa_client_ds_philhealth`,`lgsa_client_ns_philhealth`,`lgsa_client_ds_pagibig`,`lgsa_client_ns_pagibig`,`lgsa_client_ds_total_amount_direct_to_govt_in_favor_of_sg`,`lgsa_client_ns_total_amount_direct_to_govt_in_favor_of_sg`,`lgsa_client_ds_total_amount_direct_to_guard_and_govt`,`lgsa_client_ns_total_amount_direct_to_guard_and_govt`,`lgsa_client_ds_agency_fee`,`lgsa_client_ns_agency_fee`,`lgsa_client_ds_vat`,`lgsa_client_ns_vat`,`lgsa_client_ds_total_contract_rate`,`lgsa_client_ns_total_contract_rate`,`lgsa_client_status`,`is_created`,`is_updated`) values (1,'Seda Hotel','John Doe','Cebu City','54328509530','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,500.00,'Active','2020-04-21 01:33:28',NULL),(2,'Bai Hotel','test','Ayala','234554353','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,400.00,'Active','2020-04-21 13:07:33',NULL),(3,'Parklane','John Doe','Ayala','32054354354','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,325.00,'Active','2020-04-21 13:21:42',NULL);

/*Table structure for table `lgsa_collectible` */

DROP TABLE IF EXISTS `lgsa_collectible`;

CREATE TABLE `lgsa_collectible` (
  `lgsa_collectible_id` int(11) NOT NULL AUTO_INCREMENT,
  `lgsa_collectible_from_date` date NOT NULL,
  `lgsa_collectible_to_date` date NOT NULL,
  `lgsa_collectible_total` float(11,2) NOT NULL,
  `lgsa_collectible_collected_amount` float(11,2) DEFAULT NULL,
  `lgsa_collectible_balance` float(11,2) DEFAULT NULL,
  `lgsa_employee_id` int(11) NOT NULL,
  `lgsa_collectible_client_name` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,
  `lgsa_client_id` int(11) NOT NULL,
  `lgsa_collectible_status` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,
  `lgsa_collectible_ar_or` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lgsa_collectible_date_collected` date DEFAULT NULL,
  `is_created` datetime NOT NULL,
  `is_updated` datetime NOT NULL,
  PRIMARY KEY (`lgsa_collectible_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Data for the table `lgsa_collectible` */

/*Table structure for table `lgsa_collectible_logs` */

DROP TABLE IF EXISTS `lgsa_collectible_logs`;

CREATE TABLE `lgsa_collectible_logs` (
  `lgsa_collectible_logs_id` int(11) NOT NULL AUTO_INCREMENT,
  `lgsa_collectible_logs_client_id` int(11) DEFAULT NULL,
  `lgsa_collectible_logs_client_name` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lgsa_collectible_logs_date_from` date DEFAULT NULL,
  `lgsa_collectible_logs_date_to` date DEFAULT NULL,
  `lgsa_collectible_logs_total` float(11,2) DEFAULT NULL,
  `lgsa_collectible_logs_amount_collected` float(11,2) DEFAULT NULL,
  `lgsa_collectible_logs_balance` float(11,2) DEFAULT NULL,
  `lgsa_collectible_logs_status` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lgsa_collectible_logs_ar_or` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lgsa_collectible_logs_date_collected` date DEFAULT NULL,
  `lgsa_collectible_logs_updated_by_employee_id` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lgsa_collectible_logs_updated_by_employee_name` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lgsa_collectible_logs_updated_datetime` datetime DEFAULT NULL,
  PRIMARY KEY (`lgsa_collectible_logs_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Data for the table `lgsa_collectible_logs` */

/*Table structure for table `lgsa_count` */

DROP TABLE IF EXISTS `lgsa_count`;

CREATE TABLE `lgsa_count` (
  `lgsa_count_id` int(11) NOT NULL AUTO_INCREMENT,
  `lgsa_count_control_name` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lgsa_count_counter` int(11) DEFAULT NULL,
  PRIMARY KEY (`lgsa_count_id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Data for the table `lgsa_count` */

insert  into `lgsa_count`(`lgsa_count_id`,`lgsa_count_control_name`,`lgsa_count_counter`) values (1,'employee',NULL),(2,'voucher',3),(3,'cash_advance',5),(4,'payroll',1000),(5,'billing',1000),(6,'user',NULL);

/*Table structure for table `lgsa_document` */

DROP TABLE IF EXISTS `lgsa_document`;

CREATE TABLE `lgsa_document` (
  `lgsa_document_id` int(11) NOT NULL AUTO_INCREMENT,
  `lgsa_document_type` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,
  `lgsa_document_name` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,
  `lgsa_document_file_location` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,
  `lgsa_employee_id` int(11) NOT NULL,
  `is_created` datetime NOT NULL,
  `is_updated` datetime NOT NULL,
  PRIMARY KEY (`lgsa_document_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Data for the table `lgsa_document` */

/*Table structure for table `lgsa_employee` */

DROP TABLE IF EXISTS `lgsa_employee`;

CREATE TABLE `lgsa_employee` (
  `lgsa_employee_id` int(11) NOT NULL AUTO_INCREMENT,
  `lgsa_employee_assignment` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '0',
  `lgsa_employee_assignment_client_id` int(11) NOT NULL DEFAULT '0',
  `lgsa_guard_employee_id` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lgsa_guard_firstname` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lgsa_guard_middlename` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lgsa_guard_lastname` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lgsa_guard_suffix` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lgsa_guard_present_address` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lgsa_guard_provincial_address` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lgsa_guard_gender` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lgsa_guard_birthdate` date DEFAULT NULL,
  `lgsa_guard_age` int(20) DEFAULT NULL,
  `lgsa_guard_birthplace` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lgsa_guard_incase_emergency` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lgsa_guard_emergency_relationship` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lgsa_guard_emergency_address` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lgsa_guard_emergency_cp_num` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lgsa_guard_height` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lgsa_guard_weight` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lgsa_guard_cp_num` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lgsa_guard_marital_stat` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lgsa_guard_name_spouse` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lgsa_guard_name_spouse_address` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lgsa_guard_person_supported` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lgsa_guard_person_supported_rel` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lgsa_guard_work_desire` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lgsa_guard_expected_salary` float(11,2) DEFAULT NULL,
  `lgsa_guard_introduce` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lgsa_guard_hobby_recreation` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lgsa_guard_elem_school` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lgsa_guard_elem_year` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lgsa_guard_high_school` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lgsa_guard_high_year` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lgsa_guard_coll_school` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lgsa_guard_coll_year` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lgsa_guard_deg_school` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lgsa_guard_deg_year` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lgsa_guard_voc_school` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lgsa_guard_voc_year` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lgsa_guard_previous_employer` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lgsa_guard_previous_employer_add` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lgsa_guard_employment_from` date DEFAULT '0000-00-00',
  `lgsa_guard_employment_to` date DEFAULT '0000-00-00',
  `lgsa_guard_employment_salary` float(11,2) DEFAULT NULL,
  `lgsa_guard_work_done` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lgsa_guard_reason_living` varbinary(100) DEFAULT NULL,
  `lgsa_guard_sss` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lgsa_guard_philhealth` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lgsa_guard_pagibig` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lgsa_guard_tin` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lgsa_employee_profpic` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lgsa_employee_date_hired` date DEFAULT NULL,
  `lgsa_employee_status` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_created` datetime DEFAULT NULL,
  `is_update` datetime DEFAULT NULL,
  PRIMARY KEY (`lgsa_employee_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Data for the table `lgsa_employee` */

insert  into `lgsa_employee`(`lgsa_employee_id`,`lgsa_employee_assignment`,`lgsa_employee_assignment_client_id`,`lgsa_guard_employee_id`,`lgsa_guard_firstname`,`lgsa_guard_middlename`,`lgsa_guard_lastname`,`lgsa_guard_suffix`,`lgsa_guard_present_address`,`lgsa_guard_provincial_address`,`lgsa_guard_gender`,`lgsa_guard_birthdate`,`lgsa_guard_age`,`lgsa_guard_birthplace`,`lgsa_guard_incase_emergency`,`lgsa_guard_emergency_relationship`,`lgsa_guard_emergency_address`,`lgsa_guard_emergency_cp_num`,`lgsa_guard_height`,`lgsa_guard_weight`,`lgsa_guard_cp_num`,`lgsa_guard_marital_stat`,`lgsa_guard_name_spouse`,`lgsa_guard_name_spouse_address`,`lgsa_guard_person_supported`,`lgsa_guard_person_supported_rel`,`lgsa_guard_work_desire`,`lgsa_guard_expected_salary`,`lgsa_guard_introduce`,`lgsa_guard_hobby_recreation`,`lgsa_guard_elem_school`,`lgsa_guard_elem_year`,`lgsa_guard_high_school`,`lgsa_guard_high_year`,`lgsa_guard_coll_school`,`lgsa_guard_coll_year`,`lgsa_guard_deg_school`,`lgsa_guard_deg_year`,`lgsa_guard_voc_school`,`lgsa_guard_voc_year`,`lgsa_guard_previous_employer`,`lgsa_guard_previous_employer_add`,`lgsa_guard_employment_from`,`lgsa_guard_employment_to`,`lgsa_guard_employment_salary`,`lgsa_guard_work_done`,`lgsa_guard_reason_living`,`lgsa_guard_sss`,`lgsa_guard_philhealth`,`lgsa_guard_pagibig`,`lgsa_guard_tin`,`lgsa_employee_profpic`,`lgsa_employee_date_hired`,`lgsa_employee_status`,`is_created`,`is_update`) values (1,'Seda Hotel',1,'1002','test','test','test','I','Single','Male',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Active',NULL,'2020-04-20 17:53:10'),(2,'Bai Hotel',2,'1001','test2','test2','test2',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Blocked',NULL,'2020-04-20 17:53:14'),(3,'0',0,'10101010','Michael','Jackson','Nelly','klj','lj','lj','Male','2020-03-31',3,'lkj','lkj','jkl','klj','8667','8','987','987','Single','jkh','kjh','kh','kjh','jkh',0.00,'iuy','uiyhj','yut','yut','ty','gjhg','jgh','hjg','hjg','jg','jhg','g','nmb','v','2020-04-16','2020-04-06',234.00,'jhg','jhg','sss','ph','pag','tin','1000.jpg',NULL,'Awol',NULL,'2020-04-20 17:53:18'),(4,'0',0,'1003','Daniellyn','Zozobrado','Camocamo','h','h','jkh','Female','2020-03-31',89,'jkh','hj','kjh','jkh','123','123','123','123','Single','asdasd','jhghj','ghjg','jhg','jhg',0.00,'jhg','jhg','yut','t','t','t','ut','uyt','ut','uyt','uyt','uyt','hj','hjg','2020-04-10','2020-03-31',123.00,'jhg','jhg','12312312323123','123123123213','123123123123','1231231231223','1000.jpg',NULL,'Applicant',NULL,'2020-04-20 17:53:21');

/*Table structure for table `lgsa_payroll` */

DROP TABLE IF EXISTS `lgsa_payroll`;

CREATE TABLE `lgsa_payroll` (
  `lgsa_payroll_id` int(11) NOT NULL AUTO_INCREMENT,
  `lgsa_payroll_number` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lgsa_employee_id` int(11) NOT NULL,
  `lgsa_payroll_guard_name` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lgsa_client_id` int(11) NOT NULL,
  `lgsa_payroll_client_name` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lgsa_payroll_rate` float(11,2) NOT NULL,
  `lgsa_payroll_num_days` int(11) NOT NULL,
  `lgsa_payroll_attendance` float(11,1) NOT NULL,
  `lgsa_payroll_from_date` date NOT NULL,
  `lgsa_payroll_to_date` date NOT NULL,
  `lgsa_payroll_overtime` float(11,1) NOT NULL,
  `lgsa_payroll_overtime_pay` float(11,2) NOT NULL,
  `lgsa_payroll_holiday_pay` float(11,2) NOT NULL,
  `lgsa_payroll_earnings` float(11,2) NOT NULL,
  `lgsa_payroll_gross_pay` float(11,2) NOT NULL,
  `lgsa_payroll_sss` float(11,2) NOT NULL,
  `lgsa_payroll_philhealth` float(11,2) NOT NULL,
  `lgsa_payroll_pagibig` float(11,2) NOT NULL,
  `lgsa_payroll_insurance` float(11,2) NOT NULL,
  `lgsa_cashadvance_id` int(11) NOT NULL,
  `lgsa_payroll_total_deduction` float(11,2) NOT NULL,
  `lgsa_payroll_net_amount` float(11,2) NOT NULL,
  `lgsa_payroll_status` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_created` datetime NOT NULL,
  `is_updated` datetime NOT NULL,
  PRIMARY KEY (`lgsa_payroll_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Data for the table `lgsa_payroll` */

/*Table structure for table `lgsa_received_copy` */

DROP TABLE IF EXISTS `lgsa_received_copy`;

CREATE TABLE `lgsa_received_copy` (
  `lgsa_received_copy_id` int(11) NOT NULL AUTO_INCREMENT,
  `lgsa_received_copy_employee_name` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lgsa_received_copy_employee_id` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lgsa_received_copy_client_id` int(11) DEFAULT NULL,
  `lgsa_received_copy_client_name` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lgsa_received_copy_signature_file` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lgsa_received_copy_date_issued` date DEFAULT NULL,
  `lgsa_received_copy_status` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_created` datetime DEFAULT NULL,
  `is_updated` datetime DEFAULT NULL,
  PRIMARY KEY (`lgsa_received_copy_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Data for the table `lgsa_received_copy` */

/*Table structure for table `lgsa_timekeeping` */

DROP TABLE IF EXISTS `lgsa_timekeeping`;

CREATE TABLE `lgsa_timekeeping` (
  `lgsa_timekeeping_id` int(11) NOT NULL AUTO_INCREMENT,
  `lgsa_timekeeping_client_id` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lgsa_timekeeping_client_name` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lgsa_timekeeping_period_covered_from` date DEFAULT NULL,
  `lgsa_timekeeping_period_covered_to` date DEFAULT NULL,
  `lgsa_timekeeping_employee_id` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lgsa_timekeeping_guard_name` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lgsa_timekeeping_guard_inspector_employee_id` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lgsa_timekeeping_guard_inspector_name` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lgsa_timekeeping_day_1` int(20) DEFAULT NULL,
  `lgsa_timekeeping_day_2` int(20) DEFAULT NULL,
  `lgsa_timekeeping_day_3` int(20) DEFAULT NULL,
  `lgsa_timekeeping_day_4` int(20) DEFAULT NULL,
  `lgsa_timekeeping_day_5` int(20) DEFAULT NULL,
  `lgsa_timekeeping_day_6` int(20) DEFAULT NULL,
  `lgsa_timekeeping_day_7` int(20) DEFAULT NULL,
  `lgsa_timekeeping_day_8` int(20) DEFAULT NULL,
  `lgsa_timekeeping_day_9` int(20) DEFAULT NULL,
  `lgsa_timekeeping_day_10` int(20) DEFAULT NULL,
  `lgsa_timekeeping_day_11` int(20) DEFAULT NULL,
  `lgsa_timekeeping_day_12` int(20) DEFAULT NULL,
  `lgsa_timekeeping_day_13` int(20) DEFAULT NULL,
  `lgsa_timekeeping_day_14` int(20) DEFAULT NULL,
  `lgsa_timekeeping_day_15` int(20) DEFAULT NULL,
  `lgsa_timekeeping_day_16` int(20) DEFAULT NULL,
  `lgsa_timekeeping_day_17` int(20) DEFAULT NULL,
  `lgsa_timekeeping_day_18` int(20) DEFAULT NULL,
  `lgsa_timekeeping_day_19` int(20) DEFAULT NULL,
  `lgsa_timekeeping_day_20` int(20) DEFAULT NULL,
  `lgsa_timekeeping_day_21` int(20) DEFAULT NULL,
  `lgsa_timekeeping_day_22` int(20) DEFAULT NULL,
  `lgsa_timekeeping_day_23` int(20) DEFAULT NULL,
  `lgsa_timekeeping_day_24` int(20) DEFAULT NULL,
  `lgsa_timekeeping_day_25` int(20) DEFAULT NULL,
  `lgsa_timekeeping_day_26` int(20) DEFAULT NULL,
  `lgsa_timekeeping_day_27` int(20) DEFAULT NULL,
  `lgsa_timekeeping_day_28` int(20) DEFAULT NULL,
  `lgsa_timekeeping_day_29` int(20) DEFAULT NULL,
  `lgsa_timekeeping_day_30` int(20) DEFAULT NULL,
  `lgsa_timekeeping_day_31` int(20) DEFAULT NULL,
  `lgsa_timekeeping_over_total_hours` float(11,2) DEFAULT NULL,
  `lgsa_timekeeping_no_of_days` int(11) DEFAULT NULL,
  `lgsa_timekeeping_status` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_updated` datetime DEFAULT NULL,
  `is_created` datetime DEFAULT NULL,
  PRIMARY KEY (`lgsa_timekeeping_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Data for the table `lgsa_timekeeping` */

/*Table structure for table `lgsa_user` */

DROP TABLE IF EXISTS `lgsa_user`;

CREATE TABLE `lgsa_user` (
  `lgsa_user_id` int(11) NOT NULL AUTO_INCREMENT,
  `lgsa_user_employee_id` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lgsa_user_role` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lgsa_user_username` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lgsa_user_password` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lgsa_user_firstname` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lgsa_user_middlename` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lgsa_user_lastname` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lgsa_user_profile_pic` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lgsa_email_status` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lgsa_account_status` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lgsa_user_email_address` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lgsa_user_contact_number` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lgsa_user_address` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lgsa_user_birthdate` date DEFAULT NULL,
  `lgsa_user_gender` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lgsa_user_suffix` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_created` datetime DEFAULT NULL,
  `is_updated` datetime DEFAULT NULL,
  PRIMARY KEY (`lgsa_user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Data for the table `lgsa_user` */

insert  into `lgsa_user`(`lgsa_user_id`,`lgsa_user_employee_id`,`lgsa_user_role`,`lgsa_user_username`,`lgsa_user_password`,`lgsa_user_firstname`,`lgsa_user_middlename`,`lgsa_user_lastname`,`lgsa_user_profile_pic`,`lgsa_email_status`,`lgsa_account_status`,`lgsa_user_email_address`,`lgsa_user_contact_number`,`lgsa_user_address`,`lgsa_user_birthdate`,`lgsa_user_gender`,`lgsa_user_suffix`,`is_created`,`is_updated`) values (1,'1000','Admin','admin','Uw7Wuwa2V32qe8DYwAwseg==','Vincent Paul','Idano','Lim','','Active','Active','','434325','Cebu City','2020-04-01','Male','','2020-04-18 22:02:01','2020-04-18 22:02:03');

/*Table structure for table `lgsa_user_log` */

DROP TABLE IF EXISTS `lgsa_user_log`;

CREATE TABLE `lgsa_user_log` (
  `lgsa_user_log_id` int(11) NOT NULL AUTO_INCREMENT,
  `lgsa_user_employee_id` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,
  `lgsa_user_log_user_account` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,
  `lgsa_user_log_function` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,
  `lgsa_user_log_module` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,
  `lgsa_user_log_action` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,
  `lgsa_user_log_date_time` datetime NOT NULL,
  PRIMARY KEY (`lgsa_user_log_id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Data for the table `lgsa_user_log` */

insert  into `lgsa_user_log`(`lgsa_user_log_id`,`lgsa_user_employee_id`,`lgsa_user_log_user_account`,`lgsa_user_log_function`,`lgsa_user_log_module`,`lgsa_user_log_action`,`lgsa_user_log_date_time`) values (1,'1000','Admin','addClient','clientsController','created','2020-04-21 01:33:28'),(2,'1000','Admin','editClient','clientsController','updated','2020-04-21 12:20:36'),(3,'1000','Admin','editClient','clientsController','updated','2020-04-21 12:21:28'),(4,'1000','Admin','editClient','clientsController','updated','2020-04-21 12:22:13'),(5,'1000','Admin','editClient','clientsController','updated','2020-04-21 13:04:32'),(6,'1000','Admin','editClient','clientsController','updated','2020-04-21 13:04:40'),(7,'1000','Admin','addClient','clientsController','created','2020-04-21 13:07:33'),(8,'1000','Admin','editClient','clientsController','updated','2020-04-21 13:08:22'),(9,'1000','Admin','addClient','clientsController','created','2020-04-21 13:21:42'),(10,'1000','Admin','editClient','clientsController','updated','2020-04-21 13:22:40'),(11,'1000','Admin','editClient','clientsController','updated','2020-04-21 13:22:46');

/*Table structure for table `lgsa_voucher` */

DROP TABLE IF EXISTS `lgsa_voucher`;

CREATE TABLE `lgsa_voucher` (
  `lgsa_voucher_id` int(11) NOT NULL AUTO_INCREMENT,
  `lgsa_payee_employee_id` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lgsa_payee_full_name` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lgsa_control_no` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lgsa_voucher_date` date DEFAULT NULL,
  `lgsa_payee_address` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lgsa_payee_contact_no` varchar(11) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lgsa_voucher_account_charge` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lgsa_voucher_total` float(11,2) DEFAULT NULL,
  `lgsa_voucher_prepared_by_employee_id` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lgsa_voucher_prepared_by_name` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lgsa_voucher_approved_by_employee_id` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lgsa_voucher_approved_by_name` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lgsa_voucher_received_by_employee_id` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lgsa_voucher_received_by_name` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lgsa_voucher_approved_date` date DEFAULT NULL,
  `lgsa_voucher_status` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_created` datetime DEFAULT NULL,
  `is_updated` datetime DEFAULT NULL,
  PRIMARY KEY (`lgsa_voucher_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Data for the table `lgsa_voucher` */

insert  into `lgsa_voucher`(`lgsa_voucher_id`,`lgsa_payee_employee_id`,`lgsa_payee_full_name`,`lgsa_control_no`,`lgsa_voucher_date`,`lgsa_payee_address`,`lgsa_payee_contact_no`,`lgsa_voucher_account_charge`,`lgsa_voucher_total`,`lgsa_voucher_prepared_by_employee_id`,`lgsa_voucher_prepared_by_name`,`lgsa_voucher_approved_by_employee_id`,`lgsa_voucher_approved_by_name`,`lgsa_voucher_received_by_employee_id`,`lgsa_voucher_received_by_name`,`lgsa_voucher_approved_date`,`lgsa_voucher_status`,`is_created`,`is_updated`) values (1,'1003','Daniellyn Camocamo','2020-VC000001','2020-04-30','h','123','',NULL,'1000','Vincent Paul I. Lim',NULL,NULL,NULL,NULL,NULL,'Pending','2020-04-30 20:12:34',NULL),(2,'1000','Test Test','2020-VC000002','2020-04-30','Single','','',NULL,'1000','Vincent Paul I. Lim',NULL,NULL,NULL,NULL,NULL,'Pending','2020-04-30 21:00:20',NULL),(3,'1003','Daniellyn Camocamo','2020-VC000003','2020-05-01','h','123','',NULL,'1000','Vincent Paul I. Lim',NULL,NULL,NULL,NULL,NULL,'Pending','2020-05-01 00:53:40',NULL);

/*Table structure for table `lgsa_voucher_particulars` */

DROP TABLE IF EXISTS `lgsa_voucher_particulars`;

CREATE TABLE `lgsa_voucher_particulars` (
  `lgsa_voucher_particulars_id` int(11) NOT NULL AUTO_INCREMENT,
  `lgsa_control_no` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lgsa_voucher_particulars` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lgsa_voucher_amount` float(11,2) DEFAULT NULL,
  `lgsa_voucher_particulars_employee_id` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lgsa_voucher_particulars_employee_name` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`lgsa_voucher_particulars_id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Data for the table `lgsa_voucher_particulars` */

insert  into `lgsa_voucher_particulars`(`lgsa_voucher_particulars_id`,`lgsa_control_no`,`lgsa_voucher_particulars`,`lgsa_voucher_amount`,`lgsa_voucher_particulars_employee_id`,`lgsa_voucher_particulars_employee_name`) values (1,'2020-VC000001','test',123.00,'1000','Vincent Paul I. Lim'),(2,'2020-VC000001','test 1',341.00,'1000','Vincent Paul I. Lim'),(3,'2020-VC000001','test2',3322.00,'1000','Vincent Paul I. Lim'),(4,'2020-VC000002','ikaw single',2657.00,'1000','Vincent Paul I. Lim'),(5,'2020-VC000003','iyawy',123.00,'1000','Vincent Paul I. Lim'),(6,'2020-VC000003','ayaw awy',3210.00,'1000','Vincent Paul I. Lim');

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
