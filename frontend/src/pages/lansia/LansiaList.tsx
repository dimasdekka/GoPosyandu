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
} from "@/components/ui/form";

const INITIAL_LANSIA = [
  { id: 1, nama: "Sugeng Raharjo", umur: 65, tensi: "150/90", gulaDarah: 200, resikoPTM: "Tinggi" },
  { id: 2, nama: "Suminah", umur: 70, tensi: "130/80", gulaDarah: 110, resikoPTM: "Rendah" },
];

const lansiaSchema = z.object({
  nama: z.string().min(2, "Nama terlalu pendek"),
  umur: z.string().min(1, "Wajib diisi"),
  alamat: z.string().min(5, "Alamat wajib diisi"),
});

export default function LansiaList() {
  const [data, setData] = useState(INITIAL_LANSIA);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const form = useForm<z.infer<typeof lansiaSchema>>({
    resolver: zodResolver(lansiaSchema),
    defaultValues: { nama: "", umur: "45", alamat: "" },
  });

  const onSubmit = (values: z.infer<typeof lansiaSchema>) => {
    setData([{
      id: data.length + 1,
      nama: values.nama,
      umur: Number(values.umur) || 0,
      tensi: "-",
      gulaDarah: 0,
      resikoPTM: "Belum Dievaluasi",
    }, ...data]);
    setIsModalOpen(false); form.reset();
  };

  const getStatusBadge = (status: string) => {
    if (status === "Tinggi") return "bg-destructive/20 text-destructive border-destructive/20 font-medium";
    if (status === "Rendah") return "bg-primary/20 text-primary border-primary/20 font-medium";
    return "bg-muted text-muted-foreground";
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Data Dewasa & Lansia</h1>
          <p className="text-muted-foreground text-sm">Pencatatan PTM (Penyakit Tidak Menular) dan lansia.</p>
        </div>

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild><Button><Plus className="w-4 h-4 mr-2" />Daftar Peserta</Button></DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Pendaftaran Dewasa/Lansia</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
                <FormField control={form.control} name="nama" render={({ field }) => (
                  <FormItem><FormLabel>Nama Lengkap</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                )} />
                <FormField control={form.control} name="umur" render={({ field }) => (
                  <FormItem><FormLabel>Umur</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                )} />
                <Button type="submit" className="w-full">Simpan</Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Card><CardContent className="p-4 flex gap-4">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Cari nama..." className="pl-9" onChange={e => setSearchTerm(e.target.value)} />
          </div>
      </CardContent></Card>

      <Card className="overflow-hidden"><Table>
        <TableHeader className="bg-muted/50">
          <TableRow>
            <TableHead>Nama</TableHead>
            <TableHead>Umur</TableHead>
            <TableHead>Screening Terakhir</TableHead>
            <TableHead>Risiko PTM</TableHead>
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.filter(i => i.nama.toLowerCase().includes(searchTerm.toLowerCase())).map(item => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">{item.nama}</TableCell>
              <TableCell>{item.umur} Thn</TableCell>
              <TableCell>Tensi: {item.tensi} | Gula: {item.gulaDarah}</TableCell>
              <TableCell><Badge variant="outline" className={getStatusBadge(item.resikoPTM)}>{item.resikoPTM}</Badge></TableCell>
              <TableCell className="text-right">
                <Link to={`/lansia/${item.id}`}><Button variant="ghost" size="sm">Detail</Button></Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table></Card>
    </div>
  );
}
