-- MySQL dump 10.13  Distrib 8.0.40, for Win64 (x86_64)
--
-- Host: localhost    Database: receiptrocket
-- ------------------------------------------------------
-- Server version	5.5.5-10.4.32-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `customer`
--

DROP TABLE IF EXISTS `customer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `customer` (
  `id` varchar(191) NOT NULL,
  `fullName` varchar(191) NOT NULL,
  `sex` enum('Male','Female') NOT NULL,
  `phoneNumber` varchar(191) NOT NULL,
  `address` varchar(191) DEFAULT NULL,
  `payersIdentification` varchar(191) NOT NULL,
  `savingType` varchar(191) NOT NULL,
  `loanType` varchar(191) NOT NULL,
  `registrationDate` varchar(191) NOT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT 1,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `registeredBy` varchar(191) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Customer_phoneNumber_key` (`phoneNumber`),
  UNIQUE KEY `Customer_payersIdentification_key` (`payersIdentification`),
  KEY `Customer_registeredBy_fkey` (`registeredBy`),
  CONSTRAINT `Customer_registeredBy_fkey` FOREIGN KEY (`registeredBy`) REFERENCES `user` (`name`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customer`
--

LOCK TABLES `customer` WRITE;
/*!40000 ALTER TABLE `customer` DISABLE KEYS */;
INSERT INTO `customer` VALUES ('cmidka4uf0001lpdog4dhdvu7','berkery','Male','0939118279','Addis ketema','NV026000003','Michu Current Saving Account','Tiguhan loan','November 24, 2025',1,'2025-11-24 19:50:17.499','Sales User');
/*!40000 ALTER TABLE `customer` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `customerhistory`
--

DROP TABLE IF EXISTS `customerhistory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `customerhistory` (
  `id` varchar(191) NOT NULL,
  `eventType` enum('ticket') NOT NULL,
  `amount` double NOT NULL,
  `ticketNumber` varchar(191) NOT NULL,
  `date` varchar(191) NOT NULL,
  `preparedBy` varchar(191) NOT NULL,
  `reasonForPayment` varchar(191) DEFAULT NULL,
  `customerId` varchar(191) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  PRIMARY KEY (`id`),
  KEY `CustomerHistory_customerId_fkey` (`customerId`),
  CONSTRAINT `CustomerHistory_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `customer` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customerhistory`
--

LOCK TABLES `customerhistory` WRITE;
/*!40000 ALTER TABLE `customerhistory` DISABLE KEYS */;
INSERT INTO `customerhistory` VALUES ('cmied86yw000llpvwhz5kuyjp','ticket',5000,'001013','November 25, 2025','Sales User','Repayment','cmidka4uf0001lpdog4dhdvu7','2025-11-25 09:20:35.897'),('cmiedms3v000plpvw3jyh7hsq','ticket',10000,'001014','November 25, 2025','Sales User','Repayment','cmidka4uf0001lpdog4dhdvu7','2025-11-25 09:31:56.491'),('cmiedtvxr000tlpvw96zydnxn','ticket',2000,'001015','November 25, 2025','Sales User','Repayment','cmidka4uf0001lpdog4dhdvu7','2025-11-25 09:37:28.047'),('cmiee30o30003lpgoan41ebir','ticket',2000,'001016','November 25, 2025','Sales User','Tiguhan Medium business loan','cmidka4uf0001lpdog4dhdvu7','2025-11-25 09:44:34.083'),('cmiefctzf0003lpbc3c3jpthe','ticket',5000,'001017','November 25, 2025','Sales User','Repayment','cmidka4uf0001lpdog4dhdvu7','2025-11-25 10:20:11.595'),('cmirckhqy0003lpakbadjfdcr','ticket',498,'001018','December 4, 2025','Sales User','Repayment','cmidka4uf0001lpdog4dhdvu7','2025-12-04 11:23:10.426');
/*!40000 ALTER TABLE `customerhistory` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ticket`
--

DROP TABLE IF EXISTS `ticket`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ticket` (
  `id` varchar(191) NOT NULL,
  `customerName` varchar(191) NOT NULL,
  `customerPhone` varchar(191) DEFAULT NULL,
  `paymentAmount` double NOT NULL,
  `status` enum('Sent','Failed') NOT NULL,
  `date` varchar(191) NOT NULL,
  `reasonForPayment` varchar(191) DEFAULT NULL,
  `preparedBy` varchar(191) NOT NULL,
  `ticketNumber` varchar(191) NOT NULL,
  `modeOfPayment` enum('CASH','BANK') DEFAULT NULL,
  `bankReceiptNo` varchar(191) DEFAULT NULL,
  `htmlContent` varchar(191) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `auditStatus` enum('Pending','Approved','Rejected','Voided') NOT NULL DEFAULT 'Pending',
  `auditedBy` varchar(191) DEFAULT NULL,
  `auditedAt` datetime(3) DEFAULT NULL,
  `auditNote` varchar(191) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `Ticket_preparedBy_fkey` (`preparedBy`),
  KEY `Ticket_customerPhone_fkey` (`customerPhone`),
  CONSTRAINT `Ticket_customerPhone_fkey` FOREIGN KEY (`customerPhone`) REFERENCES `customer` (`phoneNumber`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `Ticket_preparedBy_fkey` FOREIGN KEY (`preparedBy`) REFERENCES `user` (`name`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ticket`
--

LOCK TABLES `ticket` WRITE;
/*!40000 ALTER TABLE `ticket` DISABLE KEYS */;
INSERT INTO `ticket` VALUES ('cmied86qh000jlpvw0pkwt302','berkery','0939118279',5000,'Failed','November 25, 2025','Repayment','Sales User','001013','CASH',NULL,'\n    <!DOCTYPE html>\n    <html lang=\"en\">\n    <head>\n        <meta charset=\"UTF-8\">\n        <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n        <title>Payment Recei','2025-11-25 09:20:35.609','Pending',NULL,NULL,NULL),('cmiedmrol000nlpvwcgc7cz34','berkery','0939118279',10000,'Failed','November 25, 2025','Repayment','Sales User','001014','CASH',NULL,'\n    <!DOCTYPE html>\n    <html lang=\"en\">\n    <head>\n        <meta charset=\"UTF-8\">\n        <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n        <title>Payment Recei','2025-11-25 09:31:55.940','Pending',NULL,NULL,NULL),('cmiedtvsa000rlpvwf9eb4izp','berkery','0939118279',2000,'Failed','November 25, 2025','Repayment','Sales User','001015','CASH',NULL,'\n    <!DOCTYPE html>\n    <html lang=\"en\">\n    <head>\n        <meta charset=\"UTF-8\">\n        <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n        <title>Payment Recei','2025-11-25 09:37:27.850','Pending',NULL,NULL,NULL),('cmiee30b80001lpgoqzoh0k68','berkery','0939118279',2000,'Failed','November 25, 2025','Tiguhan Medium business loan','Sales User','001016','CASH',NULL,'\n    <!DOCTYPE html>\n    <html lang=\"en\">\n    <head>\n        <meta charset=\"UTF-8\">\n        <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n        <title>Payment Recei','2025-11-25 09:44:33.566','Pending',NULL,NULL,NULL),('cmiefcskf0001lpbcg6qzxpvp','berkery','0939118279',5000,'Sent','November 25, 2025','Repayment','Sales User','001017','CASH',NULL,'\n    <!DOCTYPE html>\n    <html lang=\"en\">\n    <head>\n        <meta charset=\"UTF-8\">\n        <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n        <title>Payment Recei','2025-11-25 10:20:09.685','Pending',NULL,NULL,NULL),('cmirckg5y0001lpaklb1znh75','berkery','0939118279',498,'Sent','December 4, 2025','Repayment','Sales User','001018','CASH',NULL,'\n    <!DOCTYPE html>\n    <html lang=\"en\">\n    <head>\n        <meta charset=\"UTF-8\">\n        <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n        <title>Payment Recei','2025-12-04 11:23:08.277','Pending',NULL,NULL,NULL),('cuid_1765096009291_ve4rkqtvg','berkery','0939118279',222,'Failed','December 7, 2025','Repayment','Sales User','000005','CASH',NULL,'\n    <!DOCTYPE html>\n    <html lang=\"en\">\n    <head>\n        <meta charset=\"UTF-8\">\n        <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n        <title>Payment Recei','2025-12-07 11:26:49.291','Pending',NULL,NULL,NULL),('cuid_1765096078258_32w0p83od','berkery','0939118279',222,'Failed','December 7, 2025','Repayment','Sales User','000006','CASH',NULL,'\n    <!DOCTYPE html>\n    <html lang=\"en\">\n    <head>\n        <meta charset=\"UTF-8\">\n        <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n        <title>Payment Recei','2025-12-07 11:27:58.259','Pending',NULL,NULL,NULL),('cuid_1765096498895_bav5r1ho7','berkery','0939118279',1000,'Failed','December 7, 2025','Mothers Loan','Sales User','000007','CASH',NULL,'\n    <!DOCTYPE html>\n    <html lang=\"en\">\n    <head>\n        <meta charset=\"UTF-8\">\n        <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n        <title>Payment Recei','2025-12-07 11:34:58.895','Pending',NULL,NULL,NULL),('cuid_1765096557379_bheu7uwqh','berkery','0939118279',1000,'Failed','December 7, 2025','Mothers Loan','Sales User','000008','CASH',NULL,'\n    <!DOCTYPE html>\n    <html lang=\"en\">\n    <head>\n        <meta charset=\"UTF-8\">\n        <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n        <title>Payment Recei','2025-12-07 11:35:57.379','Pending',NULL,NULL,NULL),('cuid_1765096763224_udddblyxj','berkery','0939118279',300,'Failed','December 7, 2025','Repayment','Sales User','000009','CASH',NULL,'\n    <!DOCTYPE html>\n    <html lang=\"en\">\n    <head>\n        <meta charset=\"UTF-8\">\n        <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n        <title>Payment Recei','2025-12-07 11:39:23.224','Pending',NULL,NULL,NULL),('cuid_1765098442196_d60gst5v8','berkery','0939118279',200,'Failed','December 7, 2025','Mothers Loan','Sales User','000200','CASH',NULL,'\n    <!DOCTYPE html>\n    <html lang=\"en\">\n    <head>\n        <meta charset=\"UTF-8\">\n        <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n        <title>Payment Recei','2025-12-07 12:07:22.196','Pending',NULL,NULL,NULL),('cuid_1765099041991_t048718sx','berkery','0939118279',555,'Failed','December 7, 2025','Repayment','Sales User','000201','CASH',NULL,'\n    <!DOCTYPE html>\n    <html lang=\"en\">\n    <head>\n        <meta charset=\"UTF-8\">\n        <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n        <title>Payment Recei','2025-12-07 12:17:21.991','Pending',NULL,NULL,NULL),('cuid_1765099164463_4uag4o7zu','berkery','0939118279',333,'Failed','December 7, 2025','Young Women\'s loan','Sales User','000202','CASH',NULL,'\n    <!DOCTYPE html>\n    <html lang=\"en\">\n    <head>\n        <meta charset=\"UTF-8\">\n        <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n        <title>Payment Recei','2025-12-07 12:19:24.463','Pending',NULL,NULL,NULL),('cuid_1765099394923_dqhz9u2w7','berkery','0939118279',444,'Failed','December 7, 2025','Tiguhan loan','Sales User','000203','BANK','RS3987656e44','\n    <!DOCTYPE html>\n    <html lang=\"en\">\n    <head>\n        <meta charset=\"UTF-8\">\n        <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n        <title>Payment Recei','2025-12-07 12:23:14.923','Pending',NULL,NULL,NULL),('cuid_1765101056474_2gy6fvr4t','berkery','0939118279',356,'Failed','December 7, 2025','Repayment','Sales User','000204','CASH',NULL,'\n    <!DOCTYPE html>\n    <html lang=\"en\">\n    <head>\n        <meta charset=\"UTF-8\">\n        <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n        <title>Payment Recei','2025-12-07 12:50:56.474','Pending',NULL,NULL,NULL),('cuid_1765101070183_9f8fzk0p6','berkery','0939118279',356,'Failed','December 7, 2025','Repayment','Sales User','000205','CASH',NULL,'\n    <!DOCTYPE html>\n    <html lang=\"en\">\n    <head>\n        <meta charset=\"UTF-8\">\n        <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n        <title>Payment Recei','2025-12-07 12:51:10.183','Pending',NULL,NULL,NULL),('cuid_1765101877138_pqphfxxpl','berkery','0939118279',125,'Failed','December 7, 2025','Motorcycle & Taxi Drivers Loan','Sales User','000206','CASH',NULL,'\n    <!DOCTYPE html>\n    <html lang=\"en\">\n    <head>\n        <meta charset=\"UTF-8\">\n        <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n        <title>Payment Recei','2025-12-07 13:04:37.138','Pending',NULL,NULL,NULL),('cuid_1765102287537_v22vxx6dg','berkery','0939118279',4000,'Failed','December 7, 2025','Mothers Loan','Sales User','000207','CASH',NULL,'\n    <!DOCTYPE html>\n    <html lang=\"en\">\n    <head>\n        <meta charset=\"UTF-8\">\n        <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n        <title>Payment Recei','2025-12-07 13:11:27.537','Pending',NULL,NULL,NULL),('cuid_1765115375328_czufotbb7','berkery','0939118279',122,'Failed','December 7, 2025','Repayment','Sales User','000208','CASH',NULL,'\n    <!DOCTYPE html>\n    <html lang=\"en\">\n    <head>\n        <meta charset=\"UTF-8\">\n        <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n        <title>Payment Recei','2025-12-07 16:49:35.329','Pending',NULL,NULL,NULL),('cuid_1765115792663_er8a63rtx','berkery','0939118279',255,'Failed','December 7, 2025','Young Women\'s loan','Sales User','000209','CASH',NULL,'\n    <!DOCTYPE html>\n    <html lang=\"en\">\n    <head>\n        <meta charset=\"UTF-8\">\n        <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n        <title>Payment Recei','2025-12-07 16:56:32.663','Pending',NULL,NULL,NULL),('cuid_1765116276584_qjyo3m9v5','berkery','0939118279',1223,'Failed','December 7, 2025','Repayment','Sales User','000210','CASH',NULL,'\n    <!DOCTYPE html>\n    <html lang=\"en\">\n    <head>\n        <meta charset=\"UTF-8\">\n        <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n        <title>Payment Recei','2025-12-07 17:04:36.584','Pending',NULL,NULL,NULL),('cuid_1765117924394_c9mmzr52m','berkery','0939118279',234,'Failed','December 7, 2025','Repayment','Sales User','000211','CASH',NULL,'\n    <!DOCTYPE html>\n    <html lang=\"en\">\n    <head>\n        <meta charset=\"UTF-8\">\n        <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n        <title>Payment Recei','2025-12-07 17:32:04.394','Pending',NULL,NULL,NULL);
/*!40000 ALTER TABLE `ticket` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `id` varchar(191) NOT NULL,
  `name` varchar(191) NOT NULL,
  `email` varchar(191) NOT NULL,
  `password` varchar(191) DEFAULT NULL,
  `role` enum('superadmin','admin','sales','auditor','operation') NOT NULL,
  `branchId` varchar(191) NOT NULL,
  `ticketNumberStart` int(11) DEFAULT NULL,
  `ticketNumberEnd` int(11) DEFAULT NULL,
  `currentTicketNumber` int(11) DEFAULT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT 1,
  `failedLoginAttempts` int(11) NOT NULL DEFAULT 0,
  `isLocked` tinyint(1) NOT NULL DEFAULT 0,
  `lockedAt` datetime(3) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `User_name_key` (`name`),
  UNIQUE KEY `User_email_key` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES ('cmiegwnit0004lpbchhhutq3e','yared tesfaye','yada@test.com','password123','sales','2',-1,-1,0,1,0,0,NULL,'2025-11-25 11:03:35.957','2025-12-07 10:26:26.799'),('user_admin','Branch Admin','admin@test.com','$2a$10$b3vGg/x6pF.40oVubKwOEe3/DwFi8Bg1xoIic.XyLBwomO31Octee','admin','branch_main',NULL,NULL,NULL,1,0,0,NULL,'2025-11-24 22:16:35.000','2025-12-04 10:59:12.172'),('user_auditor','Auditor User','auditor@test.com','$2a$10$b3vGg/x6pF.40oVubKwOEe3/DwFi8Bg1xoIic.XyLBwomO31Octee','auditor','branch_main',NULL,NULL,NULL,1,0,0,NULL,'2025-11-24 22:16:35.000','2025-11-24 22:16:35.000'),('user_operation','Operation User','operation@test.com','$2a$10$b3vGg/x6pF.40oVubKwOEe3/DwFi8Bg1xoIic.XyLBwomO31Octee','operation','branch_main',NULL,NULL,NULL,1,0,0,NULL,'2025-11-24 22:16:35.000','2025-11-24 22:16:35.000'),('user_sales','Sales User','sales@test.com','123456','sales','branch_main',200,300,212,1,0,0,NULL,'2025-11-24 22:16:35.000','2025-12-07 22:23:04.662'),('user_superadmin','Super Admin','superadmin@test.com','$2a$10$b3vGg/x6pF.40oVubKwOEe3/DwFi8Bg1xoIic.XyLBwomO31Octee','superadmin','branch_main',NULL,NULL,NULL,1,0,0,NULL,'2025-11-24 22:16:35.000','2025-12-07 22:30:47.614');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-12-07 22:31:00
