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
const INITIAL_IBU_HAMIL = [
  { id: 1, nama: "Siti Nurhaliza", usiaKandungan: 12, hpl: "2026-08-15", statusRisiko: "Normal", tensi: "110/70", bb: 55 },
  { id: 2, nama: "Putri Andini", usiaKandungan: 24, hpl: "2026-05-20", statusRisiko: "Risiko Tinggi", tensi: "140/90", bb: 62 },
  { id: 3, nama: "Lestari Dewi", usiaKandungan: 32, hpl: "2026-03-10", statusRisiko: "Normal", tensi: "120/80", bb: 68 },
  { id: 4, nama: "Nadia Utami", usiaKandungan: 8, hpl: "2026-09-05", statusRisiko: "Risiko Rendah", tensi: "100/60", bb: 48 },
];

const ibuHamilSchema = z.object({
  nama: z.string().min(2, "Nama terlalu pendek"),
  tglLahir: z.string().min(1, "Tanggal lahir wajib diisi"),
  hpht: z.string().min(1, "HPHT wajib diisi"),
  suami: z.string().min(2, "Nama suami wajib diisi"),
  alamat: z.string().min(5, "Alamat wajib diisi"),
  noTelepon: z.string().min(10, "Nomor telepon tidak valid"),
});

type FormValues = z.infer<typeof ibuHamilSchema>;

export default function IbuHamilList() {
  const [data, setData] = useState(INITIAL_IBU_HAMIL);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("Semua");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(ibuHamilSchema),
    defaultValues: {
      nama: "",
      tglLahir: "",
      hpht: "",
      suami: "",
      alamat: "",
      noTelepon: "",
    },
  });

  const onSubmit = (values: FormValues) => {
    // Mock save
    const newData = {
      id: data.length + 1,
      nama: values.nama,
      usiaKandungan: 0, // Mock init
      hpl: "TBD", // Should calculate from HPHT (+280 days)
      statusRisiko: "Belum Dievaluasi",
      tensi: "-",
      bb: 0,
    };
    setData([newData, ...data]);
    setIsModalOpen(false);
    form.reset();
  };

  const filteredData = data.filter((item) => {
    const matchesSearch = item.nama.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "Semua" || item.statusRisiko === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Normal":
        return "bg-primary/20 text-primary hover:bg-primary/30 border-primary/20 font-medium";
      case "Risiko Rendah":
        return "bg-warning/20 text-warning hover:bg-warning/30 border-warning/20 font-medium";
      case "Risiko Tinggi":
        return "bg-destructive/20 text-destructive hover:bg-destructive/30 border-destructive/20 font-medium";
      default:
        return "bg-muted text-muted-foreground border-border/50";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Data Ibu Hamil</h1>
          <p className="text-muted-foreground text-sm">Kelola daftar ibu hamil terdaftar di Posyandu Anda.</p>
        </div>

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto shadow-sm">
              <Plus className="w-4 h-4 mr-2" />
              Pendaftaran Bumil
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] h-[90vh] sm:h-auto overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Pendaftaran Ibu Hamil Baru</DialogTitle>
              <DialogDescription>
                Masukkan data detail ibu hamil beserta perkiraan HPHT (Hari Pertama Haid Terakhir).
              </DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
                <FormField
                  control={form.control}
                  name="nama"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nama Lengkap Ibu Hamil</FormLabel>
                      <FormControl>
                        <Input placeholder="Misal: Siti Nurhaliza" {...field} />
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
                    name="hpht"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>HPHT</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="suami"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nama Suami</FormLabel>
                        <FormControl>
                          <Input placeholder="Nama Suami" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="noTelepon"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nomor Whatsapp</FormLabel>
                        <FormControl>
                          <Input placeholder="08..." {...field} />
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
                  <Button type="submit" className="w-full sm:w-auto">Simpan Pendafataran</Button>
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
              placeholder="Cari nama ibu hamil..." 
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
              <option value="Semua">Semua Status Risiko</option>
              <option value="Normal">Normal</option>
              <option value="Risiko Rendah">Risiko Rendah</option>
              <option value="Risiko Tinggi">Risiko Tinggi</option>
              <option value="Belum Dievaluasi">Belum Dievaluasi</option>
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
                <TableHead>Identitas</TableHead>
                <TableHead className="hidden sm:table-cell">Usia / HPL</TableHead>
                <TableHead>Pemeriksaan Terakhir</TableHead>
                <TableHead>Kondisi</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center h-32 text-muted-foreground">
                    Tidak ada data ibu hamil ditemukan.
                  </TableCell>
                </TableRow>
              ) : (
                filteredData.map((item, index) => (
                  <TableRow key={item.id} className="hover:bg-muted/30">
                    <TableCell className="font-medium text-muted-foreground">{index + 1}</TableCell>
                    <TableCell>
                      <Link to={`/ibu-hamil/${item.id}`} className="font-semibold text-foreground hover:text-primary transition-colors">
                        {item.nama}
                      </Link>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <div className="flex flex-col text-sm">
                        <span className="font-medium text-primary">{item.usiaKandungan > 0 ? `${item.usiaKandungan} Minggu` : '-'}</span>
                        <span className="text-muted-foreground text-xs">{item.hpl}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col text-sm">
                        <span>Tensi: {item.tensi}</span>
                        <span className="text-muted-foreground">BB: {item.bb > 0 ? `${item.bb} kg` : '-'}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getStatusBadge(item.statusRisiko)}>
                        {item.statusRisiko}
                      </Badge>
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
                            <Link to={`/ibu-hamil/${item.id}`} className="cursor-pointer flex w-full">
                              <Activity className="mr-2 h-4 w-4 text-primary" />
                              <span className="font-medium text-primary">Lihat Kunjungan</span>
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <FileText className="mr-2 h-4 w-4" />
                            <span>Edit Biodata</span>
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
