-- MySQL schema for Receipt Rocket (generated from database/schema.prisma)
-- Use this file in cPanel/phpMyAdmin: select your database, then go to Import and upload this .sql file.

-- OPTIONAL: Uncomment and edit this to create/select a database
-- CREATE DATABASE IF NOT EXISTS `receiptrocket` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
-- USE `receiptrocket`;

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- Drop tables if they already exist (optional, destructive)
DROP TABLE IF EXISTS `CustomerHistory`;
DROP TABLE IF EXISTS `Ticket`;
DROP TABLE IF EXISTS `Customer`;
DROP TABLE IF EXISTS `User`;

-- Enums are implemented as MySQL ENUM types in the column definitions

-- User table
CREATE TABLE `User` (
  `id`                  VARCHAR(191) NOT NULL,
  `name`                VARCHAR(191) NOT NULL,
  `email`               VARCHAR(191) NOT NULL,
  `password`            VARCHAR(191) NULL,
  `role`                ENUM('superadmin','admin','sales','auditor','operation') NOT NULL,
  `branchId`            VARCHAR(191) NOT NULL,
  `ticketNumberStart`   INT NULL,
  `ticketNumberEnd`     INT NULL,
  `currentTicketNumber` INT NULL,
  `isActive`            TINYINT(1) NOT NULL DEFAULT 1,
  `failedLoginAttempts` INT NOT NULL DEFAULT 0,
  `isLocked`            TINYINT(1) NOT NULL DEFAULT 0,
  `lockedAt`            DATETIME(3) NULL,
  `createdAt`           DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt`           DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),

  PRIMARY KEY (`id`),
  UNIQUE KEY `User_name_key` (`name`),
  UNIQUE KEY `User_email_key` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `Customer` (
  `id`                    VARCHAR(191) NOT NULL,
  `fullName`              VARCHAR(191) NOT NULL,
  `sex`                   ENUM('Male','Female') NOT NULL,
  `phoneNumber`           VARCHAR(191) NOT NULL,
  `address`               VARCHAR(191) NULL,
  `payersIdentification`  VARCHAR(191) NOT NULL,
  `savingType`            VARCHAR(191) NOT NULL,
  `loanType`              VARCHAR(191) NOT NULL,
  `registrationDate`      VARCHAR(191) NOT NULL,
  `isActive`              TINYINT(1) NOT NULL DEFAULT 1,
  `createdAt`             DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `registeredBy`          VARCHAR(191) NOT NULL,

  PRIMARY KEY (`id`),
  UNIQUE KEY `Customer_phoneNumber_key` (`phoneNumber`),
  UNIQUE KEY `Customer_payersIdentification_key` (`payersIdentification`),
  KEY `Customer_registeredBy_idx` (`registeredBy`),
  CONSTRAINT `Customer_registeredBy_fkey`
    FOREIGN KEY (`registeredBy`) REFERENCES `User` (`name`)
    ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Ticket table
CREATE TABLE `Ticket` (
  `id`              VARCHAR(191) NOT NULL,
  `customerName`    VARCHAR(191) NOT NULL,
  `customerPhone`   VARCHAR(191) NULL,
  `paymentAmount`   DOUBLE NOT NULL,
  `status`          ENUM('Sent','Failed') NOT NULL,
  `date`            VARCHAR(191) NOT NULL,
  `reasonForPayment` VARCHAR(191) NULL,
  `preparedBy`      VARCHAR(191) NOT NULL,
  `ticketNumber`    VARCHAR(191) NOT NULL,
  `modeOfPayment`   ENUM('CASH','BANK') NULL,
  `bankReceiptNo`   VARCHAR(191) NULL,
  `htmlContent`     LONGTEXT NULL,
  `createdAt`       DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

  `auditStatus`     ENUM('Pending','Approved','Rejected','Voided') NOT NULL DEFAULT 'Pending',
  `auditedBy`       VARCHAR(191) NULL,
  `auditedAt`       DATETIME(3) NULL,
  `auditNote`       VARCHAR(191) NULL,

  PRIMARY KEY (`id`),
  KEY `Ticket_preparedBy_idx` (`preparedBy`),
  KEY `Ticket_customerPhone_idx` (`customerPhone`),
  CONSTRAINT `Ticket_preparedBy_fkey`
    FOREIGN KEY (`preparedBy`) REFERENCES `User` (`name`)
    ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `Ticket_customerPhone_fkey`
    FOREIGN KEY (`customerPhone`) REFERENCES `Customer` (`phoneNumber`)
    ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- CustomerHistory table
CREATE TABLE `CustomerHistory` (
  `id`             VARCHAR(191) NOT NULL,
  `eventType`      ENUM('ticket') NOT NULL,
  `amount`         DOUBLE NOT NULL,
  `ticketNumber`   VARCHAR(191) NOT NULL,
  `date`           VARCHAR(191) NOT NULL,
  `preparedBy`     VARCHAR(191) NOT NULL,
  `reasonForPayment` VARCHAR(191) NULL,
  `customerId`     VARCHAR(191) NOT NULL,
  `createdAt`      DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

  PRIMARY KEY (`id`),
  KEY `CustomerHistory_customerId_idx` (`customerId`),
  CONSTRAINT `CustomerHistory_customerId_fkey`
    FOREIGN KEY (`customerId`) REFERENCES `Customer` (`id`)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;


