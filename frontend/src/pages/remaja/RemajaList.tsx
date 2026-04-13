import { useState } from "react";
import { Search, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";


const INITIAL_REMAJA = [
  { id: 1, nama: "Budi Kusuma", umur: 15, statusGizi: "Normal", tensi: "110/70", bb: 55, sekolah: "SMPN 1" },
  { id: 2, nama: "Sinta Amelia", umur: 16, statusGizi: "Kurang", tensi: "100/65", bb: 42, sekolah: "SMAN 2" },
];

const remajaSchema = z.object({
  nama: z.string().min(2, "Nama terlalu pendek"),
  umur: z.string().min(1, "Wajib diisi"),
  sekolah: z.string().min(2, "Nama sekolah wajib diisi"),
  alamat: z.string().min(5, "Alamat wajib diisi"),
});

type FormValues = z.infer<typeof remajaSchema>;

export default function RemajaList() {
  const [data, setData] = useState(INITIAL_REMAJA);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(remajaSchema),
    defaultValues: {
      nama: "",
      umur: "12",
      sekolah: "",
      alamat: "",
    },
  });

  const onSubmit = (values: FormValues) => {
    setData([{
      id: data.length + 1,
      nama: values.nama,
      umur: Number(values.umur) || 0,
      sekolah: values.sekolah,
      statusGizi: "Belum Diukur",
      tensi: "-",
      bb: 0,
    }, ...data]);
    setIsModalOpen(false);
    form.reset();
  };

  const filteredData = data.filter(item => 
    item.nama.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Data Posyandu Remaja</h1>
          <p className="text-muted-foreground text-sm">Kelola daftar remaja terdaftar beserta edukasinya.</p>
        </div>

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto shadow-sm">
              <Plus className="w-4 h-4 mr-2" />
              Daftar Remaja
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Pendaftaran Remaja</DialogTitle>
              <DialogDescription>Masukkan data remaja peserta Posyandu.</DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
                <FormField control={form.control} name="nama" render={({ field }) => (
                  <FormItem><FormLabel>Nama Lengkap</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="umur" render={({ field }) => (
                  <FormItem><FormLabel>Umur (Tahun)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="sekolah" render={({ field }) => (
                  <FormItem><FormLabel>Asal Sekolah</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="alamat" render={({ field }) => (
                  <FormItem><FormLabel>Alamat</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <Button type="submit" className="w-full">Simpan Data</Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-4 flex gap-4">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Cari nama remaja..." className="pl-9" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          </div>
        </CardContent>
      </Card>

      <Card className="overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead>Nama</TableHead>
              <TableHead>Umur/Sekolah</TableHead>
              <TableHead>Pemeriksaan Akhir</TableHead>
              <TableHead>Status Gizi</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map(item => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.nama}</TableCell>
                <TableCell>{item.umur} Thn<br/><span className="text-xs text-muted-foreground">{item.sekolah}</span></TableCell>
                <TableCell>BB: {item.bb}kg | Tensi: {item.tensi}</TableCell>
                <TableCell><Badge variant="outline">{item.statusGizi}</Badge></TableCell>
                <TableCell className="text-right">
                  <Link to={`/remaja/${item.id}`}><Button variant="ghost" size="sm">Detail</Button></Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
