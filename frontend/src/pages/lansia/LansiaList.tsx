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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const lansiaSchema = z.object({
  nama: z.string().min(2, "Nama terlalu pendek"),
  umur: z.string().min(1, "Wajib diisi"),
  jk: z.enum(["L", "P"], { message: "Pilih jenis kelamin" }),
  alamat: z.string().min(5, "Alamat wajib diisi"),
});
type FormValues = z.infer<typeof lansiaSchema>;

const getStatusBadge = (status: string) => {
  switch (status) {
    case "Rendah": return "bg-green-100 text-green-700 border-green-200";
    case "Sedang": return "bg-amber-100 text-amber-700 border-amber-200";
    case "Tinggi": return "bg-red-100 text-red-700 border-red-200";
    default: return "bg-muted text-muted-foreground border-border";
  }
};

export default function LansiaList() {
  const [data, setData] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("Semua");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { fetchLansia(); }, []);

  const fetchLansia = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/v1/lansia');
      const raw = res.data.data || [];
      const mapped = raw.map((item: any) => {
        const latestP = item.pemeriksaan?.[0] ?? null;
        const tensi = latestP ? `${latestP.tensiSistolik ?? '-'}/${latestP.tensiDiastolik ?? '-'}` : "-";
        const gula = latestP?.gulaDarah ?? null;
        const resikoPTM = latestP?.resikoPTM ?? "Belum Dievaluasi";

        return { 
          id: item.id, 
          nama: item.nama, 
          umur: item.umur, 
          jk: item.jk, 
          alamat: item.alamat, 
          tensi, 
          gula, 
          resikoPTM 
        };
      });
      setData(mapped);
    } catch (err) {
      console.error("Gagal memuat data lansia:", err);
    } finally {
      setLoading(false);
    }
  };

  const addForm = useForm<FormValues>({ resolver: zodResolver(lansiaSchema), defaultValues: { nama: "", umur: "", jk: "L", alamat: "" } });
  const editForm = useForm<FormValues>({ resolver: zodResolver(lansiaSchema), defaultValues: { nama: "", umur: "", jk: "L", alamat: "" } });

  const openEdit = (item: any) => {
    setEditTarget(item);
    editForm.reset({ 
      nama: item.nama, 
      umur: item.umur.toString(), 
      jk: item.jk as "L" | "P", 
      alamat: item.alamat 
    });
  };

  const onAdd = async (values: FormValues) => {
    try {
      setSubmitting(true);
      await axios.post('/api/v1/lansia', { ...values, umur: parseInt(values.umur) });
      setIsAddOpen(false); addForm.reset(); fetchLansia();
    } catch (err) { console.error(err); } finally { setSubmitting(false); }
  };

  const onEdit = async (values: FormValues) => {
    if (!editTarget) return;
    try {
      setSubmitting(true);
      await axios.patch(`/api/v1/lansia/${editTarget.id}`, { ...values, umur: parseInt(values.umur) });
      setEditTarget(null); fetchLansia();
    } catch (err) { console.error(err); } finally { setSubmitting(false); }
  };

  const filteredData = data.filter(item => {
    const matchName = item.nama.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = filterStatus === "Semua" || item.resikoPTM === filterStatus;
    return matchName && matchStatus;
  });

  const FormFields = ({ control }: { control: any }) => (
    <>
      <FormField control={control} name="nama" render={({ field }) => (
        <FormItem><FormLabel>Nama Lengkap</FormLabel><FormControl><Input placeholder="Nama lansia/dewasa" {...field} /></FormControl><FormMessage /></FormItem>
      )} />
      <div className="grid grid-cols-2 gap-4">
        <FormField control={control} name="umur" render={({ field }) => (
          <FormItem><FormLabel>Umur (Tahun)</FormLabel><FormControl><Input type="number" placeholder="Contoh: 65" {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <FormField control={control} name="jk" render={({ field }) => (
          <FormItem>
            <FormLabel>Gender</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl><SelectTrigger><SelectValue placeholder="Pilih" /></SelectTrigger></FormControl>
              <SelectContent>
                <SelectItem value="L">Laki-laki</SelectItem>
                <SelectItem value="P">Perempuan</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
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
          <h1 className="text-3xl font-bold tracking-tight text-primary">Data Lansia & Dewasa</h1>
          <p className="text-muted-foreground text-sm">Pencatatan PTM (Penyakit Tidak Menular) dan Screening Lansia.</p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto shadow-sm transition-all hover:scale-[1.02] active:scale-95"><Plus className="w-4 h-4 mr-2" />Pendaftaran Peserta</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Pendaftaran Lansia/Dewasa Baru</DialogTitle>
              <DialogDescription>Masukkan biodata lengkap peserta posyandu lansia.</DialogDescription>
            </DialogHeader>
            <Form {...addForm}>
              <form onSubmit={addForm.handleSubmit(onAdd)} className="space-y-4 pt-4">
                <FormFields control={addForm.control} />
                <div className="flex justify-end pt-2">
                  <Button type="submit" disabled={submitting}>{submitting ? "Menyimpan..." : "Simpan Pendaftaran"}</Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Edit Modal */}
      <Dialog open={!!editTarget} onOpenChange={(open) => { if (!open) setEditTarget(null); }}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Biodata — {editTarget?.nama}</DialogTitle>
            <DialogDescription>Perbarui informasi identitas peserta.</DialogDescription>
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
      <Card className="border-border/60 shadow-sm">
        <CardContent className="p-4 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Cari nama peserta..." className="pl-9" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="w-4 h-4 text-muted-foreground hidden sm:block" />
            <select className="flex h-10 w-full sm:w-[220px] rounded-md border border-input bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
              <option value="Semua">Semua Risiko PTM</option>
              <option value="Rendah">Risiko Rendah</option>
              <option value="Sedang">Risiko Sedang</option>
              <option value="Tinggi">Risiko Tinggi</option>
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
                <TableHead className="w-[50px] text-center">No</TableHead>
                <TableHead>Identitas</TableHead>
                <TableHead>Gender</TableHead>
                <TableHead className="hidden sm:table-cell">Umur</TableHead>
                <TableHead>Screening Terakhir</TableHead>
                <TableHead>Risiko PTM</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={7} className="text-center h-32 text-muted-foreground">Memuat data...</TableCell></TableRow>
              ) : filteredData.length === 0 ? (
                <TableRow><TableCell colSpan={7} className="text-center h-32 text-muted-foreground">Tidak ada data lansia/dewasa.</TableCell></TableRow>
              ) : filteredData.map((item, idx) => (
                <TableRow key={item.id} className="hover:bg-muted/30">
                  <TableCell className="text-center text-muted-foreground">{idx + 1}</TableCell>
                  <TableCell>
                    <Link to={`/lansia/${item.id}`} className="font-semibold hover:text-primary transition-colors">{item.nama}</Link>
                    <div className="text-[10px] text-muted-foreground visible sm:hidden">{item.umur} Thn</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={item.jk === 'L' ? "text-blue-600 border-blue-200" : "text-pink-600 border-pink-200"}>
                      {item.jk === 'L' ? 'Laki-laki' : 'Perempuan'}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell text-sm font-medium">
                    {item.umur} Tahun
                  </TableCell>
                  <TableCell className="text-sm">
                    <div>Tensi: {item.tensi}</div>
                    <div className="text-muted-foreground">Gula: {item.gula != null ? `${item.gula} mg/dL` : '-'}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`border ${getStatusBadge(item.resikoPTM)}`}>{item.resikoPTM}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Tindakan</DropdownMenuLabel>
                        <DropdownMenuItem asChild>
                          <Link to={`/lansia/${item.id}`} className="flex w-full cursor-pointer">
                            <Eye className="mr-2 h-4 w-4 text-primary" /><span className="text-primary font-medium">Lihat Screening</span>
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
