-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama` VARCHAR(191) NOT NULL,
    `username` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `role` ENUM('ADMIN', 'KADER', 'PUSKESMAS', 'MASYARAKAT') NOT NULL DEFAULT 'KADER',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User_username_key`(`username`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Jadwal` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tema` VARCHAR(191) NOT NULL,
    `tanggal` DATETIME(3) NOT NULL,
    `waktu` VARCHAR(191) NOT NULL,
    `lokasi` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'Akan Datang',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Balita` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama` VARCHAR(191) NOT NULL,
    `tglLahir` DATETIME(3) NOT NULL,
    `jk` ENUM('L', 'P') NOT NULL,
    `ibu` VARCHAR(191) NOT NULL,
    `ayah` VARCHAR(191) NOT NULL,
    `alamat` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PemeriksaanBalita` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `balitaId` INTEGER NOT NULL,
    `tglUkur` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `bb` DOUBLE NOT NULL,
    `tb` DOUBLE NULL,
    `lingkarKepala` DOUBLE NULL,
    `statusGizi` VARCHAR(191) NOT NULL,
    `catatanTindakan` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `IbuHamil` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama` VARCHAR(191) NOT NULL,
    `tglLahir` DATETIME(3) NOT NULL,
    `hpht` DATETIME(3) NOT NULL,
    `suami` VARCHAR(191) NOT NULL,
    `alamat` VARCHAR(191) NOT NULL,
    `noTelepon` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PemeriksaanIbuHamil` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `ibuHamilId` INTEGER NOT NULL,
    `tglPeriksa` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `usiaKandungan` INTEGER NOT NULL,
    `tensiSistolik` INTEGER NULL,
    `tensiDiastolik` INTEGER NULL,
    `bb` DOUBLE NULL,
    `lila` DOUBLE NULL,
    `tfu` INTEGER NULL,
    `djj` INTEGER NULL,
    `keluhan` TEXT NULL,
    `statusRisiko` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Remaja` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama` VARCHAR(191) NOT NULL,
    `umur` INTEGER NOT NULL,
    `sekolah` VARCHAR(191) NOT NULL,
    `alamat` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PemeriksaanRemaja` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `remajaId` INTEGER NOT NULL,
    `tglPeriksa` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `bb` DOUBLE NULL,
    `tb` DOUBLE NULL,
    `tensiSistolik` INTEGER NULL,
    `tensiDiastolik` INTEGER NULL,
    `lingkarPerut` DOUBLE NULL,
    `kadarHb` DOUBLE NULL,
    `statusGizi` VARCHAR(191) NOT NULL,
    `catatanEdukasi` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Lansia` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama` VARCHAR(191) NOT NULL,
    `umur` INTEGER NOT NULL,
    `alamat` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PemeriksaanLansia` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `lansiaId` INTEGER NOT NULL,
    `tglPeriksa` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `bb` DOUBLE NULL,
    `tb` DOUBLE NULL,
    `tensiSistolik` INTEGER NULL,
    `tensiDiastolik` INTEGER NULL,
    `gulaDarah` INTEGER NULL,
    `asamUrat` DOUBLE NULL,
    `kolesterol` INTEGER NULL,
    `keluhan` TEXT NULL,
    `resikoPTM` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `PemeriksaanBalita` ADD CONSTRAINT `PemeriksaanBalita_balitaId_fkey` FOREIGN KEY (`balitaId`) REFERENCES `Balita`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PemeriksaanIbuHamil` ADD CONSTRAINT `PemeriksaanIbuHamil_ibuHamilId_fkey` FOREIGN KEY (`ibuHamilId`) REFERENCES `IbuHamil`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PemeriksaanRemaja` ADD CONSTRAINT `PemeriksaanRemaja_remajaId_fkey` FOREIGN KEY (`remajaId`) REFERENCES `Remaja`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PemeriksaanLansia` ADD CONSTRAINT `PemeriksaanLansia_lansiaId_fkey` FOREIGN KEY (`lansiaId`) REFERENCES `Lansia`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
