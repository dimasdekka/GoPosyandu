import { useEffect, useState } from "react";
import { Search, Plus, Filter, MoreHorizontal, Edit, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const balitaSchema = z.object({
  nama: z.string().min(2, "Nama terlalu pendek"),
  tglLahir: z.string().min(1, "Tanggal lahir wajib diisi"),
  jk: z.enum(["L", "P"]),
  ibu: z.string().min(2, "Nama ibu wajib diisi"),
  ayah: z.string().min(2, "Nama ayah wajib diisi"),
  alamat: z.string().min(5, "Alamat wajib diisi"),
});
type FormValues = z.infer<typeof balitaSchema>;

const getStatusBadge = (status: string) => {
  switch (status) {
    case "Baik": return "bg-green-100 text-green-700 border-green-200";
    case "Kurang": return "bg-amber-100 text-amber-700 border-amber-200";
    case "Buruk": return "bg-red-100 text-red-700 border-red-200";
    case "Lebih": return "bg-blue-100 text-blue-700 border-blue-200";
    default: return "bg-muted text-muted-foreground border-border";
  }
};

export default function BalitaList() {
  const [data, setData] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("Semua");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { fetchBalita(); }, []);

  const fetchBalita = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/v1/balita');
      const raw = res.data.data || [];
      const mapped = raw.map((item: any) => {
        const tglLahir = new Date(item.tglLahir);
        const now = new Date();
        const bulan = (now.getFullYear() - tglLahir.getFullYear()) * 12 + (now.getMonth() - tglLahir.getMonth());
        const latestP = item.pemeriksaan?.[0] ?? null;
        return {
          id: item.id,
          nama: item.nama,
          tglLahir: item.tglLahir,
          usiaBulan: bulan >= 0 ? bulan : 0,
          jk: item.jk,
          ibu: item.ibu,
          ayah: item.ayah,
          alamat: item.alamat,
          bb: latestP?.bb ?? null,
          statusGizi: latestP?.statusGizi ?? "Belum Diukur",
        };
      });
      setData(mapped);
    } catch (err) {
      console.error("Gagal memuat balita:", err);
    } finally {
      setLoading(false);
    }
  };

  const addForm = useForm<FormValues>({
    resolver: zodResolver(balitaSchema),
    defaultValues: { nama: "", tglLahir: "", jk: "L", ibu: "", ayah: "", alamat: "" },
  });

  const editForm = useForm<FormValues>({
    resolver: zodResolver(balitaSchema),
    defaultValues: { nama: "", tglLahir: "", jk: "L", ibu: "", ayah: "", alamat: "" },
  });

  const openEdit = (item: any) => {
    setEditTarget(item);
    editForm.reset({
      nama: item.nama,
      tglLahir: item.tglLahir ? item.tglLahir.slice(0, 10) : "",
      jk: item.jk,
      ibu: item.ibu || "",
      ayah: item.ayah || "",
      alamat: item.alamat || "",
    });
  };

  const onAdd = async (values: FormValues) => {
    try {
      setSubmitting(true);
      await axios.post('/api/v1/balita', {
        ...values,
        tglLahir: new Date(values.tglLahir).toISOString(),
      });
      setIsAddOpen(false);
      addForm.reset();
      fetchBalita();
    } catch (err) {
      console.error("Gagal tambah balita:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const onEdit = async (values: FormValues) => {
    if (!editTarget) return;
    try {
      setSubmitting(true);
      await axios.patch(`/api/v1/balita/${editTarget.id}`, {
        ...values,
        tglLahir: new Date(values.tglLahir).toISOString(),
      });
      setEditTarget(null);
      fetchBalita();
    } catch (err) {
      console.error("Gagal update balita:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredData = data.filter(item => {
    const matchName = item.nama.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = filterStatus === "Semua" || item.statusGizi === filterStatus;
    return matchName && matchStatus;
  });

  const FormFields = ({ control }: { control: any }) => (
    <>
      <FormField control={control} name="nama" render={({ field }) => (
        <FormItem><FormLabel>Nama Lengkap Anak</FormLabel><FormControl><Input placeholder="Misal: Dimas Anggara" {...field} /></FormControl><FormMessage /></FormItem>
      )} />
      <div className="grid grid-cols-2 gap-4">
        <FormField control={control} name="tglLahir" render={({ field }) => (
          <FormItem><FormLabel>Tanggal Lahir</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <FormField control={control} name="jk" render={({ field }) => (
          <FormItem><FormLabel>Jenis Kelamin</FormLabel>
            <FormControl>
              <select className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" {...field}>
                <option value="L">Laki-laki</option>
                <option value="P">Perempuan</option>
              </select>
            </FormControl><FormMessage /></FormItem>
        )} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <FormField control={control} name="ibu" render={({ field }) => (
          <FormItem><FormLabel>Nama Ibu</FormLabel><FormControl><Input placeholder="Nama Ibu" {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <FormField control={control} name="ayah" render={({ field }) => (
          <FormItem><FormLabel>Nama Ayah</FormLabel><FormControl><Input placeholder="Nama Ayah" {...field} /></FormControl><FormMessage /></FormItem>
        )} />
      </div>
      <FormField control={control} name="alamat" render={({ field }) => (
        <FormItem><FormLabel>Alamat Lengkap</FormLabel><FormControl><Input placeholder="Alamat rumah..." {...field} /></FormControl><FormMessage /></FormItem>
      )} />
    </>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Data Balita & Anak Kecil</h1>
          <p className="text-muted-foreground text-sm">Kelola daftar balita terdaftar di Posyandu Anda.</p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto shadow-sm"><Plus className="w-4 h-4 mr-2" />Tambah Anak</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Pendaftaran Balita Baru</DialogTitle>
              <DialogDescription>Masukkan data anak beserta informasi orang tua.</DialogDescription>
            </DialogHeader>
            <Form {...addForm}>
              <form onSubmit={addForm.handleSubmit(onAdd)} className="space-y-4 pt-4">
                <FormFields control={addForm.control} />
                <div className="flex justify-end pt-2">
                  <Button type="submit" disabled={submitting}>{submitting ? "Menyimpan..." : "Simpan Data"}</Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editTarget} onOpenChange={(open) => { if (!open) setEditTarget(null); }}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Biodata — {editTarget?.nama}</DialogTitle>
            <DialogDescription>Perbarui data biodata anak.</DialogDescription>
          </DialogHeader>
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(onEdit)} className="space-y-4 pt-4">
              <FormFields control={editForm.control} />
              <div className="flex justify-end gap-3 pt-2">
                <Button type="button" variant="outline" onClick={() => setEditTarget(null)}>Batal</Button>
                <Button type="submit" disabled={submitting}>{submitting ? "Menyimpan..." : "Update Data"}</Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Filter */}
      <Card>
        <CardContent className="p-4 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Cari nama balita..." className="pl-9" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="w-4 h-4 text-muted-foreground hidden sm:block" />
            <select
              className="flex h-10 w-full sm:w-[180px] rounded-md border border-input bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
            >
              <option value="Semua">Semua Status</option>
              <option value="Baik">Gizi Baik</option>
              <option value="Kurang">Gizi Kurang</option>
              <option value="Buruk">Gizi Buruk</option>
              <option value="Lebih">Gizi Lebih</option>
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
                <TableHead className="w-[50px]">No</TableHead>
                <TableHead>Identitas Anak</TableHead>
                <TableHead className="hidden sm:table-cell">Orang Tua</TableHead>
                <TableHead>Status Terakhir</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={5} className="text-center h-32 text-muted-foreground">Memuat data...</TableCell></TableRow>
              ) : filteredData.length === 0 ? (
                <TableRow><TableCell colSpan={5} className="text-center h-32 text-muted-foreground">Tidak ada data balita.</TableCell></TableRow>
              ) : filteredData.map((item, idx) => (
                <TableRow key={item.id} className="hover:bg-muted/30">
                  <TableCell className="text-muted-foreground">{idx + 1}</TableCell>
                  <TableCell>
                    <Link to={`/balita/${item.id}`} className="font-semibold hover:text-primary transition-colors">{item.nama}</Link>
                    <div className="flex gap-2 text-xs text-muted-foreground mt-0.5">
                      <span>{item.jk === 'L' ? 'Laki-laki' : 'Perempuan'}</span>
                      <span>•</span>
                      <span>{item.usiaBulan} bln</span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell text-sm">
                    <div className="text-muted-foreground">Ibu: <span className="text-foreground">{item.ibu || "-"}</span></div>
                    <div className="text-muted-foreground">Ayah: <span className="text-foreground">{item.ayah || "-"}</span></div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`border ${getStatusBadge(item.statusGizi)}`}>{item.statusGizi}</Badge>
                    {item.bb != null && <div className="text-xs text-muted-foreground mt-0.5">{item.bb} kg</div>}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Tindakan</DropdownMenuLabel>
                        <DropdownMenuItem asChild>
                          <Link to={`/balita/${item.id}`} className="flex w-full cursor-pointer">
                            <Eye className="mr-2 h-4 w-4 text-primary" /><span className="text-primary font-medium">Lihat Detail</span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => openEdit(item)} className="cursor-pointer">
                          <Edit className="mr-2 h-4 w-4" /><span>Edit Biodata</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
