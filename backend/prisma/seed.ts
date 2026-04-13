import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import bcrypt from 'bcryptjs';

const adapter = new PrismaMariaDb(process.env.DATABASE_URL!);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🗑️  Cleaning up existing data...');
  
  // Clean in order to respect foreign keys
  await prisma.pemeriksaanLansia.deleteMany();
  await prisma.lansia.deleteMany();
  await prisma.pemeriksaanRemaja.deleteMany();
  await prisma.remaja.deleteMany();
  await prisma.pemeriksaanIbuHamil.deleteMany();
  await prisma.ibuHamil.deleteMany();
  await prisma.pemeriksaanBalita.deleteMany();
  await prisma.balita.deleteMany();
  await prisma.jadwal.deleteMany();
  await prisma.user.deleteMany();

  console.log('👤 Seeding Users...');
  const salt = 10;
  const adminPwd = await bcrypt.hash('admin123', salt);
  const kaderPwd = await bcrypt.hash('kader123', salt);

  await prisma.user.createMany({
    data: [
      { nama: 'Admin Utama', username: 'admin', password: adminPwd, role: 'ADMIN' },
      { nama: 'Siti Kader', username: 'kader', password: kaderPwd, role: 'KADER' },
      { nama: 'Dewi Petugas', username: 'petugas', password: kaderPwd, role: 'KADER' },
    ]
  });

  console.log('📅 Seeding Jadwal...');
  const months = [0, 1, 2];
  for (const m of months) {
    const date = new Date();
    date.setMonth(date.getMonth() + m);
    date.setDate(15);
    await prisma.jadwal.create({
      data: {
        tema: m === 0 ? 'Pekan Imunisasi Nasional' : `Posyandu Rutin Bulan ${date.toLocaleString('id-ID', { month: 'long' })}`,
        tanggal: date,
        waktu: '08:00 - 12:00',
        lokasi: 'Balai Desa Nambo',
        status: m === 0 ? 'Sedang Berjalan' : 'Akan Datang'
      }
    });
  }

  console.log('👶 Seeding Balita...');
  const balitaNames = ['Ahmad Syamil', 'Annisa Fitri', 'Bagas Saputra', 'Citra Lestari', 'Daffa Arkan', 'Eka Putri', 'Fahri Ramadhan', 'Gita Cahyani', 'Hafizh Pratama', 'Indah Permata', 'Jaka Setia', 'Keysha Aurelia', 'Luthfi Hakim', 'Maulana Malik', 'Nabila Shafa', 'Omar Fattah', 'Putri Salma', 'Qonita Az-Zahra', 'Rizky Fadillah', 'Salsabila'];
  
  for (let i = 0; i < balitaNames.length; i++) {
    const isMale = i % 2 === 0;
    const bday = new Date();
    bday.setFullYear(bday.getFullYear() - (Math.floor(Math.random() * 4) + 1));
    bday.setMonth(Math.floor(Math.random() * 12));

    const balita = await prisma.balita.create({
      data: {
        nama: balitaNames[i],
        tglLahir: bday,
        jk: isMale ? 'L' : 'P',
        ibu: `Ibu ${balitaNames[i].split(' ')[0]}`,
        ayah: `Bapak ${balitaNames[i].split(' ')[1] || 'Fulan'}`,
        alamat: `RT 0${Math.floor(Math.random() * 5) + 1} RW 02, Desa Nambo`
      }
    });

    // Seed 3 pemeriksaan for each
    for (let j = 0; j < 3; j++) {
      const periksaDate = new Date();
      periksaDate.setMonth(periksaDate.getMonth() - (2-j));
      await prisma.pemeriksaanBalita.create({
        data: {
          balitaId: balita.id,
          tglUkur: periksaDate,
          bb: 7 + (j * 1.5) + (Math.random() * 2),
          tb: 60 + (j * 5) + (Math.random() * 5),
          lingkarKepala: 40 + (j * 2),
          statusGizi: j === 0 ? 'Kurang' : 'Baik',
          catatanTindakan: j === 2 ? 'Vitamin A + Obat Cacing' : 'Imunisasi Rutin'
        }
      });
    }
  }

  console.log('🤰 Seeding Ibu Hamil...');
  const bumilNames = ['Siti Aminah', 'Ratna Galih', 'Maya Sari', 'Wulan Guritno', 'Yulia Fitri', 'Dina Mariana', 'Ria Ricis', 'Lesti Kejora', 'Ayu Tingting', 'Nagita Slavina'];
  
  for (let i = 0; i < bumilNames.length; i++) {
    const hpht = new Date();
    hpht.setMonth(hpht.getMonth() - (Math.floor(Math.random() * 7) + 1));

    const bumil = await prisma.ibuHamil.create({
      data: {
        nama: bumilNames[i],
        tglLahir: new Date(1990 + i, Math.floor(Math.random() * 12), 10),
        hpht: hpht,
        suami: `Bapak ${bumilNames[i].split(' ')[0]}`,
        alamat: `RT 0${Math.floor(Math.random() * 5) + 1} RW 01, Desa Nambo`,
        noTelepon: `0812345678${i}`
      }
    });

    // 2 Pemeriksaan
    for (let j = 0; j < 2; j++) {
      const periksaDate = new Date();
      periksaDate.setMonth(periksaDate.getMonth() - (1-j));
      await prisma.pemeriksaanIbuHamil.create({
        data: {
          ibuHamilId: bumil.id,
          tglPeriksa: periksaDate,
          usiaKandungan: 12 + (j * 4) + (i % 5),
          tensiSistolik: 110 + (Math.random() * 20),
          tensiDiastolik: 70 + (Math.random() * 15),
          bb: 55 + (j * 2) + i,
          lila: 23.5 + (Math.random() * 3),
          tfu: 20 + (j * 4) + (i % 5),
          djj: 140 + (Math.random() * 20),
          statusRisiko: i % 4 === 0 ? 'Risiko Rendah' : 'Normal',
          keluhan: j === 0 ? 'Mual di pagi hari' : 'Pusing sedikit'
        }
      });
    }
  }

  console.log('Teen Seeding Remaja...');
  const remajaNames = ['Budi', 'Ani', 'Tono', 'Tini', 'Iwan', 'Wati', 'Dedi', 'Yanti', 'Anto', 'Ina'];
  for (let i = 0; i < remajaNames.length; i++) {
    const remaja = await prisma.remaja.create({
      data: {
        nama: remajaNames[i],
        umur: 12 + i,
        jk: i % 2 === 0 ? 'L' : 'P',
        sekolah: i % 2 === 0 ? 'SMPN 1 Gajah Mada' : 'SMAN 2 Nambo',
        alamat: 'Desa Nambo No. ' + i
      }
    });

    await prisma.pemeriksaanRemaja.create({
      data: {
        remajaId: remaja.id,
        bb: 40 + (i * 2),
        tb: 150 + (i * 2),
        tensiSistolik: 110,
        tensiDiastolik: 70,
        kadarHb: 12 + (Math.random() * 2),
        statusGizi: 'Normal'
      }
    });
  }

  console.log('👴 Seeding Lansia...');
  const lansiaNames = ['Mbah Marijan', 'Opa Rudy', 'Eyang Subur', 'Nenek Iroh', 'Oma Martha', 'Pak Haji Sobri'];
  for (let i = 0; i < lansiaNames.length; i++) {
    const lansia = await prisma.lansia.create({
      data: {
        nama: lansiaNames[i],
        umur: 60 + (i * 5),
        jk: i % 2 === 0 ? 'L' : 'P',
        alamat: 'RT 03 Desa Nambo'
      }
    });

    await prisma.pemeriksaanLansia.create({
      data: {
        lansiaId: lansia.id,
        bb: 50 + (Math.random() * 20),
        tensiSistolik: 130 + (i * 5),
        tensiDiastolik: 85 + (i * 2),
        gulaDarah: 100 + (Math.random() * 100),
        asamUrat: 5 + Math.random() * 4,
        resikoPTM: i % 3 === 0 ? 'Sedang' : 'Rendah'
      }
    });
  }

  console.log('✅ Seeding Complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
