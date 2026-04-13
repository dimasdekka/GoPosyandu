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

const ibuHamilSchema = z.object({
  nama: z.string().min(2, "Nama terlalu pendek"),
  tglLahir: z.string().min(1, "Tanggal lahir wajib diisi"),
  hpht: z.string().optional(),
  usiaKandungan: z.string().optional(),
  suami: z.string().min(2, "Nama suami wajib diisi"),
  alamat: z.string().min(5, "Alamat wajib diisi"),
  noTelepon: z.string().min(10, "Nomor telepon tidak valid"),
  bb: z.string().optional(),
  tb: z.string().optional(),
  tfu: z.string().optional(),
  djj: z.string().optional(),
}).refine(data => data.hpht || data.usiaKandungan, {
  message: "HPHT atau Usia Kandungan wajib diisi",
  path: ["hpht"],
});
type FormValues = z.infer<typeof ibuHamilSchema>;

const getStatusBadge = (status: string) => {
  switch (status) {
    case "Normal": return "bg-green-100 text-green-700 border-green-200";
    case "Risiko Rendah": return "bg-amber-100 text-amber-700 border-amber-200";
    case "Risiko Tinggi": return "bg-red-100 text-red-700 border-red-200";
    default: return "bg-muted text-muted-foreground border-border";
  }
};

export default function IbuHamilList() {
  const [data, setData] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("Semua");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { fetchIbuHamil(); }, []);

  const fetchIbuHamil = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/v1/ibu-hamil');
      const raw = res.data.data || [];
      const mapped = raw.map((item: any) => {
        // ✅ Field sesuai schema Prisma: pemeriksaan, tensiSistolik, tensiDiastolik, bb
        const latestP = item.pemeriksaan?.[0] ?? null;
        const tensi = latestP ? `${latestP.tensiSistolik ?? '-'}/${latestP.tensiDiastolik ?? '-'}` : "-";
        const bb = latestP?.bb ?? null;
        const tb = latestP?.tb ?? null;
        const tfu = latestP?.tfu ?? null;
        const djj = latestP?.djj ?? null;
        const statusRisiko = latestP?.statusRisiko ?? "Belum Dievaluasi";

        const hphtDate = new Date(item.hpht);
        const now = new Date();
        
        let usiaKandungan = 0;
        if (latestP && latestP.usiaKandungan) {
          const checkupDate = new Date(latestP.tglPeriksa || latestP.createdAt);
          const diffTimeP = now.getTime() - checkupDate.getTime();
          const diffWeeksP = Math.floor(diffTimeP / (1000 * 60 * 60 * 24 * 7));
          usiaKandungan = latestP.usiaKandungan + diffWeeksP;
        } else {
          const diffTime = now.getTime() - hphtDate.getTime();
          const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
          usiaKandungan = Math.max(0, Math.floor(diffDays / 7));
        }
        
        const hplDate = new Date(hphtDate.getTime());
        hplDate.setDate(hphtDate.getDate() + 280); 
        const hpl = hplDate.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });

        return { 
          id: item.id, 
          nama: item.nama, 
          tglLahir: item.tglLahir, 
          hpht: item.hpht, 
          suami: item.suami, 
          alamat: item.alamat, 
          noTelepon: item.noTelepon, 
          usiaKandungan, 
          hpl, 
          tensi, 
          bb, 
          tb,
          tfu,
          djj,
          statusRisiko 
        };
      });
      setData(mapped);
    } catch (err) {
      console.error("Gagal memuat ibu hamil:", err);
    } finally {
      setLoading(false);
    }
  };

  const addForm = useForm<FormValues>({ resolver: zodResolver(ibuHamilSchema), defaultValues: { nama: "", tglLahir: "", hpht: "", usiaKandungan: "", suami: "", alamat: "", noTelepon: "" } });
  const editForm = useForm<FormValues>({ resolver: zodResolver(ibuHamilSchema), defaultValues: { nama: "", tglLahir: "", hpht: "", usiaKandungan: "", suami: "", alamat: "", noTelepon: "" } });

  const openEdit = (item: any) => {
    setEditTarget(item);
    editForm.reset({ nama: item.nama, tglLahir: item.tglLahir?.slice(0, 10) ?? "", hpht: item.hpht?.slice(0, 10) ?? "", suami: item.suami || "", alamat: item.alamat || "", noTelepon: item.noTelepon || "" });
  };

  const onAdd = async (values: FormValues) => {
    try {
      setSubmitting(true);
      
      // Calculate HPHT if only Usia Kandungan was provided
      let hpht = values.hpht;
      let initialUk = 0;
      
      if (values.usiaKandungan) {
        initialUk = parseInt(values.usiaKandungan);
      }

      if (!hpht && values.usiaKandungan) {
        const weeks = parseInt(values.usiaKandungan);
        const date = new Date();
        date.setDate(date.getDate() - (weeks * 7));
        hpht = date.toISOString().split('T')[0];
      }
      
      // 1. Register basic profile
      const regRes = await axios.post('/api/v1/ibu-hamil', { 
        nama: values.nama,
        tglLahir: new Date(values.tglLahir).toISOString(),
        hpht: hpht ? new Date(hpht).toISOString() : new Date().toISOString(),
        suami: values.suami,
        alamat: values.alamat,
        noTelepon: values.noTelepon
      });

      const newId = regRes.data.data.id;

      // 2. If measurements are provided, create initial examination
      const hasMeasurements = values.bb || values.tfu || values.djj;
      if (newId && hasMeasurements) {
        const payload: any = {
          usiaKandungan: initialUk || 0,
          statusRisiko: "Normal" // Default for initial registration
        };
        if (values.bb) payload.bb = parseFloat(values.bb);
        if (values.tb) payload.tb = parseFloat(values.tb);
        if (values.tfu) payload.tfu = parseInt(values.tfu);
        if (values.djj) payload.djj = parseInt(values.djj);
        
        await axios.post(`/api/v1/ibu-hamil/${newId}/pemeriksaan`, payload);
      }

      setIsAddOpen(false); 
      addForm.reset(); 
      fetchIbuHamil();
    } catch (err) { 
      console.error("Gagal menambahkan ibu hamil:", err); 
    } finally { 
      setSubmitting(false); 
    }
  };

  const onEdit = async (values: FormValues) => {
    if (!editTarget) return;
    try {
      setSubmitting(true);
      await axios.patch(`/api/v1/ibu-hamil/${editTarget.id}`, { ...values, tglLahir: new Date(values.tglLahir).toISOString(), hpht: new Date(values.hpht).toISOString() });
      setEditTarget(null); fetchIbuHamil();
    } catch (err) { console.error(err); } finally { setSubmitting(false); }
  };

  const filteredData = data.filter(item => {
    const matchName = item.nama.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = filterStatus === "Semua" || item.statusRisiko === filterStatus;
    return matchName && matchStatus;
  });

  const FormFields = ({ control }: { control: any }) => (
    <>
      <div className="space-y-4">
        <p className="text-xs font-semibold text-primary uppercase tracking-wider">Biodata Dasar</p>
        <FormField control={control} name="nama" render={({ field }) => (
          <FormItem><FormLabel>Nama Lengkap</FormLabel><FormControl><Input placeholder="Nama ibu hamil" {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <div className="grid grid-cols-2 gap-4">
          <FormField control={control} name="tglLahir" render={({ field }) => (
            <FormItem><FormLabel>Tanggal Lahir</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={control} name="hpht" render={({ field }) => (
            <FormItem>
              <FormLabel>HPHT (Opsional)</FormLabel>
              <FormControl><Input type="date" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
        </div>
        <FormField control={control} name="usiaKandungan" render={({ field }) => (
          <FormItem>
            <FormLabel>Usia Kandungan Saat Ini (Minggu)</FormLabel>
            <FormControl><Input type="number" placeholder="Contoh: 12" {...field} /></FormControl>
            <p className="text-[10px] text-muted-foreground mt-1">Digunakan untuk menghitung HPL jika HPHT kosong.</p>
            <FormMessage />
          </FormItem>
        )} />
        <div className="grid grid-cols-2 gap-4">
          <FormField control={control} name="suami" render={({ field }) => (
            <FormItem><FormLabel>Nama Suami</FormLabel><FormControl><Input placeholder="Nama suami" {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={control} name="noTelepon" render={({ field }) => (
            <FormItem><FormLabel>No. WhatsApp</FormLabel><FormControl><Input placeholder="08..." {...field} /></FormControl><FormMessage /></FormItem>
          )} />
        </div>
        <FormField control={control} name="alamat" render={({ field }) => (
          <FormItem><FormLabel>Alamat Lengkap</FormLabel><FormControl><Input placeholder="Alamat rumah..." {...field} /></FormControl><FormMessage /></FormItem>
        )} />

        <div className="pt-2">
          <div className="bg-muted/30 p-4 rounded-lg border border-border/60">
            <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-3">Hasil Pemeriksaan Hari Ini (Opsional)</p>
            <div className="grid grid-cols-2 gap-3">
              <FormField control={control} name="bb" render={({ field }) => (
                <FormItem><FormLabel className="text-xs text-muted-foreground">BB (kg)</FormLabel><FormControl><Input type="number" step="0.1" placeholder="60" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={control} name="tb" render={({ field }) => (
                <FormItem><FormLabel className="text-xs text-muted-foreground">TB (cm)</FormLabel><FormControl><Input type="number" step="0.1" placeholder="155" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
            </div>
            <div className="grid grid-cols-2 gap-3 mt-3">
              <FormField control={control} name="tfu" render={({ field }) => (
                <FormItem><FormLabel className="text-xs text-muted-foreground">TFU (cm)</FormLabel><FormControl><Input type="number" placeholder="20" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={control} name="djj" render={({ field }) => (
                <FormItem><FormLabel className="text-xs text-muted-foreground">DJJ (x/m)</FormLabel><FormControl><Input type="number" placeholder="140" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
            </div>
            <p className="text-[10px] text-muted-foreground mt-2 italic">Isi kolom di atas jika langsung melakukan penimbangan/pemeriksaan.</p>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Data Ibu Hamil</h1>
          <p className="text-muted-foreground text-sm">Kelola daftar ibu hamil terdaftar di Posyandu Anda.</p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto shadow-sm"><Plus className="w-4 h-4 mr-2" />Pendaftaran Bumil</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Pendaftaran Ibu Hamil Baru</DialogTitle>
              <DialogDescription>Masukkan data ibu hamil beserta HPHT.</DialogDescription>
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
            <DialogDescription>Perbarui data biodata ibu hamil.</DialogDescription>
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
            <Input placeholder="Cari nama ibu hamil..." className="pl-9" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="w-4 h-4 text-muted-foreground hidden sm:block" />
            <select className="flex h-10 w-full sm:w-[180px] rounded-md border border-input bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
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
                <TableHead className="w-[50px]">No</TableHead>
                <TableHead>Identitas</TableHead>
                <TableHead className="hidden sm:table-cell">Usia / HPL</TableHead>
                <TableHead>Pemeriksaan Terakhir</TableHead>
                <TableHead>Status Risiko</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={6} className="text-center h-32 text-muted-foreground">Memuat data...</TableCell></TableRow>
              ) : filteredData.length === 0 ? (
                <TableRow><TableCell colSpan={6} className="text-center h-32 text-muted-foreground">Tidak ada data ibu hamil.</TableCell></TableRow>
              ) : filteredData.map((item, idx) => (
                <TableRow key={item.id} className="hover:bg-muted/30">
                  <TableCell className="text-muted-foreground">{idx + 1}</TableCell>
                  <TableCell>
                    <Link to={`/ibu-hamil/${item.id}`} className="font-semibold hover:text-primary transition-colors">{item.nama}</Link>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell text-sm">
                    <div className="font-medium text-primary">{item.usiaKandungan} Minggu</div>
                    <div className="text-muted-foreground text-xs">HPL: {item.hpl}</div>
                  </TableCell>
                  <TableCell className="text-sm">
                    <div className="flex flex-col gap-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Tensi: {item.tensi}</span>
                        <span className="text-muted-foreground/30">|</span>
                        <span className="font-medium">BB: {item.bb != null ? Number(item.bb).toFixed(1) : '-'} kg</span>
                        <span className="text-muted-foreground/30">|</span>
                        <span className="font-medium">TB: {item.tb != null ? Number(item.tb).toFixed(1) : '-'} cm</span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                        <span>TFU: {item.tfu != null ? `${item.tfu} cm` : '-'}</span>
                        <span className="text-muted-foreground/30">•</span>
                        <span>DJJ: {item.djj != null ? `${item.djj}x/m` : '-'}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`border ${getStatusBadge(item.statusRisiko)}`}>{item.statusRisiko}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Tindakan</DropdownMenuLabel>
                        <DropdownMenuItem asChild>
                          <Link to={`/ibu-hamil/${item.id}`} className="flex w-full cursor-pointer">
                            <Eye className="mr-2 h-4 w-4 text-primary" /><span className="text-primary font-medium">Lihat Kunjungan</span>
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
