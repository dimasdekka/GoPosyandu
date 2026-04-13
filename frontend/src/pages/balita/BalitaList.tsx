import { useState } from "react";
import { Search, Plus, Filter, MoreHorizontal, FileText, Activity } from "lucide-react";
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
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

// Mock Data
const INITIAL_BALITA = [
  { id: 1, nama: "Budi Santoso", usiaBulan: 14, bb: 9.2, statusGizi: "Gizi Baik", jk: "L", ibu: "Ratna", ayah: "Santoso" },
  { id: 2, nama: "Siti Aminah", usiaBulan: 8, bb: 7.5, statusGizi: "Gizi Baik", jk: "P", ibu: "Aisyah", ayah: "Jamal" },
  { id: 3, nama: "Rizky Firmansyah", usiaBulan: 24, bb: 10.1, statusGizi: "Gizi Kurang", jk: "L", ibu: "Dewi", ayah: "Firmansyah" },
  { id: 4, nama: "Aisyah Putri", usiaBulan: 18, bb: 11.0, statusGizi: "Gizi Baik", jk: "P", ibu: "Nina", ayah: "Andi" },
  { id: 5, nama: "Dimas Anggara", usiaBulan: 30, bb: 12.5, statusGizi: "Gizi Baik", jk: "L", ibu: "Sari", ayah: "Harto" },
  { id: 6, nama: "Rani Yulianti", usiaBulan: 10, bb: 6.8, statusGizi: "Gizi Buruk", jk: "P", ibu: "Yuli", ayah: "Rahmat" },
];

const balitaSchema = z.object({
  nama: z.string().min(2, "Nama terlalu pendek"),
  tglLahir: z.string().min(1, "Tanggal lahir wajib diisi"),
  jk: z.enum(["L", "P"], { message: "Pilih jenis kelamin" }),
  ibu: z.string().min(2, "Nama ibu wajib diisi"),
  ayah: z.string().min(2, "Nama ayah wajib diisi"),
  alamat: z.string().min(5, "Alamat wajib diisi"),
});

type FormValues = z.infer<typeof balitaSchema>;

export default function BalitaList() {
  const [data, setData] = useState(INITIAL_BALITA);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("Semua");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(balitaSchema),
    defaultValues: {
      nama: "",
      tglLahir: "",
      jk: "L",
      ibu: "",
      ayah: "",
      alamat: "",
    },
  });

  const onSubmit = (values: FormValues) => {
    // Mock save
    const newData = {
      id: data.length + 1,
      nama: values.nama,
      usiaBulan: 0, // Should be calculated from tglLahir in real app
      bb: 0,
      statusGizi: "Belum Diukur",
      jk: values.jk,
      ibu: values.ibu,
      ayah: values.ayah,
    };
    setData([newData, ...data]);
    setIsModalOpen(false);
    form.reset();
  };

  const filteredData = data.filter((item) => {
    const matchesSearch = item.nama.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "Semua" || item.statusGizi === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Gizi Baik":
        return "bg-primary/20 text-primary hover:bg-primary/30 border-primary/20 font-medium";
      case "Gizi Kurang":
        return "bg-warning/20 text-warning hover:bg-warning/30 border-warning/20 font-medium";
      case "Gizi Buruk":
        return "bg-destructive/20 text-destructive hover:bg-destructive/30 border-destructive/20 font-medium";
      default:
        return "bg-muted text-muted-foreground border-border/50";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Data Balita</h1>
          <p className="text-muted-foreground text-sm">Kelola daftar balita terdaftar di Posyandu Anda.</p>
        </div>

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto shadow-sm">
              <Plus className="w-4 h-4 mr-2" />
              Tambah Balita
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] h-[90vh] sm:h-auto overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Pendaftaran Balita Baru</DialogTitle>
              <DialogDescription>
                Masukkan data detail anak, beserta informasi orang tua dan kontak.
              </DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
                <FormField
                  control={form.control}
                  name="nama"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nama Lengkap Anak</FormLabel>
                      <FormControl>
                        <Input placeholder="Misal: Dimas Anggara" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="tglLahir"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tanggal Lahir</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="jk"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Jenis Kelamin</FormLabel>
                        <FormControl>
                          <select 
                            className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            {...field}
                          >
                            <option value="L">Laki-laki</option>
                            <option value="P">Perempuan</option>
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="ibu"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nama Ibu</FormLabel>
                        <FormControl>
                          <Input placeholder="Nama Ibu" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="ayah"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nama Ayah</FormLabel>
                        <FormControl>
                          <Input placeholder="Nama Ayah" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="alamat"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Alamat Lengkap</FormLabel>
                      <FormControl>
                        <Input placeholder="Alamat rumah..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end pt-4">
                  <Button type="submit" className="w-full sm:w-auto">Simpan Data</Button>
                </div>
              </form>
            </Form>

          </DialogContent>
        </Dialog>
      </div>

      {/* Filter and Search */}
      <Card>
        <CardContent className="p-4 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Cari nama balita..." 
              className="pl-9 w-full bg-background/50 border-border/60"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="w-4 h-4 text-muted-foreground hidden sm:block" />
            <select 
              className="flex h-10 w-full sm:w-[180px] items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="Semua">Semua Status</option>
              <option value="Gizi Baik">Gizi Baik</option>
              <option value="Gizi Kurang">Gizi Kurang</option>
              <option value="Gizi Buruk">Gizi Buruk</option>
              <option value="Belum Diukur">Belum Diukur</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Tabel */}
      <Card className="overflow-hidden border-border/60 shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="w-[80px]">No</TableHead>
                <TableHead>Identitas Balita</TableHead>
                <TableHead className="hidden sm:table-cell">Orang Tua</TableHead>
                <TableHead>Status Terakhir</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center h-32 text-muted-foreground">
                    Tidak ada data balita ditemukan.
                  </TableCell>
                </TableRow>
              ) : (
                filteredData.map((item, index) => (
                  <TableRow key={item.id} className="hover:bg-muted/30">
                    <TableCell className="font-medium text-muted-foreground">{index + 1}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <Link to={`/balita/${item.id}`} className="font-semibold text-foreground hover:text-primary transition-colors">
                          {item.nama}
                        </Link>
                        <div className="flex gap-2 text-xs text-muted-foreground mt-1">
                          <span>{item.jk === 'L' ? 'Laki-laki' : 'Perempuan'}</span>
                          <span>•</span>
                          <span>{item.usiaBulan} bln</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <div className="flex flex-col text-sm">
                        <span className="text-muted-foreground">Ibu: <span className="text-foreground">{item.ibu}</span></span>
                        <span className="text-muted-foreground">Ayah: <span className="text-foreground">{item.ayah}</span></span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1 items-start">
                        <Badge variant="outline" className={getStatusBadge(item.statusGizi)}>
                          {item.statusGizi}
                        </Badge>
                        {item.bb > 0 && <span className="text-xs font-medium pl-1 text-muted-foreground">{item.bb} kg</span>}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Tindakan</DropdownMenuLabel>
                          <DropdownMenuItem asChild>
                            <Link to={`/balita/${item.id}`} className="cursor-pointer flex w-full">
                              <Activity className="mr-2 h-4 w-4 text-primary" />
                              <span className="font-medium text-primary">Lihat Detail & Grafik</span>
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <FileText className="mr-2 h-4 w-4" />
                            <span>Lihat Biodata</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
