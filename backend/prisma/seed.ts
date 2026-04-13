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
  const balitaNames = [
    'Ahmad', 'Budi', 'Cahyo', 'Dedi', 'Eko', 'Fajar', 'Gunawan', 'Heri', 'Irfan', 'Joko',
    'Kusuma', 'Laksana', 'Mulyono', 'Nur', 'Oky', 'Prasetyo', 'Qomar', 'Roni', 'Slamet', 'Toto',
    'Utomo', 'Vian', 'Wawan', 'Xander', 'Yanto', 'Zaki', 'Aris', 'Bagas', 'Candra', 'Daffa',
    'Erlangga', 'Farhan', 'Gilang', 'Hafiz', 'Indra', 'Jaka', 'Kevin', 'Lutfi', 'Maulana', 'Naufal',
    'Omar', 'Pandu', 'Raka', 'Satria', 'Tegar', 'Umar', 'Vicky', 'Wahyu', 'Yuda', 'Zain'
  ];
  const balitaGirls = [
    'Ani', 'Bunga', 'Citra', 'Dewi', 'Eka', 'Fitri', 'Gita', 'Hani', 'Indah', 'Julia',
    'Kiki', 'Lestari', 'Maya', 'Nuning', 'Oki', 'Putri', 'Qonita', 'Ratna', 'Siti', 'Tuti',
    'Umi', 'Vina', 'Wati', 'Xena', 'Yanti', 'Zahra', 'Amel', 'Bella', 'Dina', 'Enny',
    'Fanya', 'Gisel', 'Hana', 'Iis', 'Jeni', 'Karin', 'Lulu', 'Mila', 'Nabila', 'Oliv',
    'Pipit', 'Queen', 'Rani', 'Siska', 'Tika', 'Ulfa', 'Vera', 'Winda', 'Yulia', 'Zizi'
  ];
  
  const allBalita = [...balitaNames, ...balitaGirls];

  for (let i = 0; i < allBalita.length; i++) {
    const isMale = i < balitaNames.length;
    const bday = new Date();
    bday.setFullYear(bday.getFullYear() - (Math.floor(Math.random() * 4) + 1));
    bday.setMonth(Math.floor(Math.random() * 12));

    const balita = await prisma.balita.create({
      data: {
        nama: allBalita[i],
        tglLahir: bday,
        jk: isMale ? 'L' : 'P',
        ibu: `Ibu ${balitaGirls[Math.floor(Math.random() * balitaGirls.length)]}`,
        ayah: `Bapak ${balitaNames[Math.floor(Math.random() * balitaNames.length)]}`,
        alamat: `RT 0${Math.floor(Math.random() * 5) + 1} RW 02, Desa Nambo`
      }
    });

    for (let j = 0; j < 3; j++) {
      const periksaDate = new Date();
      periksaDate.setMonth(periksaDate.getMonth() - (2-j));
      await prisma.pemeriksaanBalita.create({
        data: {
          balitaId: balita.id,
          tglUkur: periksaDate,
          bb: 7 + (j * 1.5) + (Math.random() * 2),
          tb: 65 + (j * 5) + (Math.random() * 5),
          lingkarKepala: 40 + (j * 2),
          statusGizi: j === 2 ? 'Baik' : (Math.random() > 0.8 ? 'Kurang' : 'Baik'),
          catatanTindakan: j === 2 ? 'Vitamin A + Booster' : 'Pemeriksaan Rutin'
        }
      });
    }
  }

  console.log('🤰 Seeding Ibu Hamil...');
  const genericBumil = [
    'Siti', 'Aminah', 'Ratna', 'Maya', 'Wulan', 'Yulia', 'Dina', 'Ria', 'Lesti', 'Ayu',
    'Nagita', 'Kartika', 'Zaskia', 'Shireen', 'Alyssa', 'Chelsea', 'Sandra', 'Raisa', 'Isyana', 'Bunga',
    'Maudy', 'Pevita', 'Dian', 'Laudya', 'Titi', 'Donita', 'Nikita', 'Jessica', 'Enzy', 'Febby',
    'Yuki', 'Siska', 'Amel', 'Heni', 'Eli', 'Nining', 'Tuti', 'Yanti', 'Wati', 'Dewi'
  ];
  
  for (let i = 0; i < genericBumil.length; i++) {
    const hpht = new Date();
    hpht.setMonth(hpht.getMonth() - (Math.floor(Math.random() * 7) + 1));

    const bumil = await prisma.ibuHamil.create({
      data: {
        nama: `${genericBumil[i]} ${i % 2 === 0 ? 'Wahyuni' : 'Lestari'}`,
        tglLahir: new Date(1985 + (i % 15), Math.floor(Math.random() * 12), 10),
        hpht: hpht,
        suami: `Bapak ${balitaNames[Math.floor(Math.random() * balitaNames.length)]}`,
        alamat: `RT 0${Math.floor(Math.random() * 5) + 1} RW 01, Desa Nambo`,
        noTelepon: `08123000${i.toString().padStart(4, '0')}`
      }
    });

    for (let j = 0; j < 3; j++) {
      const periksaDate = new Date();
      periksaDate.setMonth(periksaDate.getMonth() - (2-j));
      await prisma.pemeriksaanIbuHamil.create({
        data: {
          ibuHamilId: bumil.id,
          tglPeriksa: periksaDate,
          usiaKandungan: 10 + (j * 6) + (i % 3),
          tensiSistolik: 110 + Math.floor(Math.random() * 15),
          tensiDiastolik: 70 + Math.floor(Math.random() * 15),
          bb: 50 + (j * 3) + (Math.random() * 5),
          tb: 155 + (Math.random() * 10),
          lila: 24 + (Math.random() * 4),
          tfu: 20 + (j * 5),
          djj: 130 + Math.floor(Math.random() * 20),
          statusRisiko: i % 10 === 0 ? 'Risiko Tinggi' : 'Normal',
          keluhan: j === 0 ? 'Mual' : 'Sehat'
        }
      });
    }
  }

  console.log('Teen Seeding Remaja...');
  for (let i = 0; i < 40; i++) {
    const isMale = i % 2 === 0;
    const name = isMale 
      ? `${balitaNames[i % balitaNames.length]} ${i}` 
      : `${balitaGirls[i % balitaGirls.length]} ${i}`;
      
    const remaja = await prisma.remaja.create({
      data: {
        nama: name,
        umur: 13 + (i % 5),
        jk: isMale ? 'L' : 'P',
        sekolah: i % 2 === 0 ? 'SMA 1 Nambo' : 'SMP 2 Nambo',
        alamat: 'Desa Nambo No. ' + i
      }
    });

    await prisma.pemeriksaanRemaja.create({
      data: {
        remajaId: remaja.id,
        bb: 45 + (i % 15) + (Math.random() * 5),
        tb: 155 + (i % 20) + Math.random() * 10,
        tensiSistolik: 115 + Math.floor(Math.random() * 10),
        tensiDiastolik: 75 + Math.floor(Math.random() * 10),
        kadarHb: 12 + (Math.random() * 3),
        lingkarPerut: 65 + (Math.random() * 15),
        statusGizi: i % 8 === 0 ? 'Kurang' : 'Normal'
      }
    });
  }

  console.log('👴 Seeding Lansia...');
  const kakekNames = ['Mbah', 'Kakek', 'Opa', 'Pak'];
  const nenekNames = ['Nenek', 'Oma', 'Ibu', 'Mbah'];
  const baseLansia = ['Darma', 'Sutedjo', 'Kromo', 'Suro', 'Joyo', 'Kartika', 'Rukmini', 'Sumiyati', 'Lastri', 'Inah'];

  for (let i = 0; i < 40; i++) {
    const isMale = i % 2 === 0;
    const title = isMale ? kakekNames[i % 4] : nenekNames[i % 4];
    const name = `${title} ${baseLansia[i % 10]} ${i}`;

    const lansia = await prisma.lansia.create({
      data: {
        nama: name,
        umur: 60 + (i % 30),
        jk: isMale ? 'L' : 'P',
        alamat: 'RT 03 Desa Nambo No. ' + i
      }
    });

    await prisma.pemeriksaanLansia.create({
      data: {
        lansiaId: lansia.id,
        bb: 55 + (Math.random() * 20),
        tb: 155 + (Math.random() * 15),
        tensiSistolik: 125 + Math.floor(Math.random() * 30),
        tensiDiastolik: 80 + Math.floor(Math.random() * 20),
        gulaDarah: 90 + Math.floor(Math.random() * 100),
        asamUrat: 4 + (Math.random() * 5),
        kolesterol: 170 + Math.floor(Math.random() * 100),
        resikoPTM: i % 4 === 0 ? 'Sedang' : 'Rendah'
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
