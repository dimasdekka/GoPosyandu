import { useEffect, useState } from "react";
import { Calendar as CalendarIcon, MapPin, Plus, Clock, Trash2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";

const jadwalSchema = z.object({
  judul: z.string().min(2, "Judul kegaitan wajib diisi"),
  tanggal: z.string().min(1, "Tanggal wajib diisi"),
  waktuMulai: z.string().min(1, "Waktu mulai wajib diisi"),
  waktuSelesai: z.string().min(1, "Waktu selesai wajib diisi"),
  lokasi: z.string().min(1, "Lokasi wajib diisi"),
});

export default function JadwalList() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);
  const [viewTarget, setViewTarget] = useState<any | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<z.infer<typeof jadwalSchema>>({
    resolver: zodResolver(jadwalSchema),
    defaultValues: { judul: "", tanggal: "", waktuMulai: "08:00", waktuSelesai: "12:00", lokasi: "" },
  });

  useEffect(() => {
    fetchJadwal();
  }, []);

  const fetchJadwal = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/v1/jadwal');
      setData(response.data.data || []);
    } catch (error) {
      console.error("Failed to fetch jadwal:", error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (values: z.infer<typeof jadwalSchema>) => {
    try {
      setSubmitting(true);
      await axios.post('/api/v1/jadwal', {
        tema: values.judul,
        tanggal: new Date(values.tanggal).toISOString(),
        waktu: `${values.waktuMulai} - ${values.waktuSelesai}`,
        lokasi: values.lokasi
      });
      setIsModalOpen(false);
      form.reset();
      fetchJadwal();
    } catch (error) {
      console.error("Failed to add jadwal:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const onDelete = async () => {
    if (!deleteTarget) return;
    try {
      await axios.delete(`/api/v1/jadwal/${deleteTarget}`);
      setDeleteTarget(null);
      fetchJadwal();
    } catch (error) {
      console.error("Failed to delete jadwal:", error);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "Tanggal tidak tersedia";
    try {
      const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Format tanggal salah";
      return date.toLocaleDateString('id-ID', options);
    } catch (e) {
      return "Gagal memproses tanggal";
    }
  };

  const getStatus = (dateString: string) => {
    if (!dateString) return { label: "Unknown", color: "bg-muted text-muted-foreground" };
    const eventDate = new Date(dateString);
    if (isNaN(eventDate.getTime())) return { label: "Invalid Date", color: "bg-muted text-muted-foreground" };
    
    eventDate.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (eventDate < today) return { label: "Selesai", color: "bg-muted text-muted-foreground" };
    if (eventDate.getTime() === today.getTime()) return { label: "Hari Ini", color: "bg-red-100 text-red-600 border-red-200 animate-pulse" };
    return { label: "Akan Datang", color: "bg-green-100 text-green-700 border-green-200" };
  };

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">Jadwal Agenda Posyandu</h1>
          <p className="text-muted-foreground text-sm">Kelola jadwal kunjungan dan kegiatan kesehatan rutin.</p>
        </div>
        
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button className="shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95">
              <Plus className="w-4 h-4 mr-2" />
              Buat Agenda Baru
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Tambah Agenda Posyandu</DialogTitle>
              <DialogDescription>Pastikan lokasi dan waktu sudah sesuai rencana.</DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
                <FormField control={form.control} name="judul" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama Kegiatan / Tema</FormLabel>
                    <FormControl><Input placeholder="Contoh: Imunisasi Campak & Polio" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="tanggal" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tanggal Pelaksanaan</FormLabel>
                    <FormControl><Input type="date" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <div className="grid grid-cols-2 gap-4">
                  <FormField control={form.control} name="waktuMulai" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Waktu Mulai</FormLabel>
                      <FormControl><Input type="time" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="waktuSelesai" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Waktu Selesai</FormLabel>
                      <FormControl><Input type="time" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
                <FormField control={form.control} name="lokasi" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lokasi / Tempat</FormLabel>
                    <FormControl><Input placeholder="Contoh: Balai Warga RW 08" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <Button type="submit" className="w-full mt-2" disabled={submitting}>
                  {submitting ? "Menyimpan..." : "Posting Agenda"}
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3].map(i => (
            <div key={i} className="h-48 bg-muted animate-pulse rounded-xl" />
          ))}
        </div>
      ) : data.length === 0 ? (
        <Card className="border-dashed border-2 py-12 flex flex-col items-center justify-center text-muted-foreground bg-muted/20">
          <CalendarIcon className="w-12 h-12 mb-4 opacity-20" />
          <p>Belum ada jadwal kegiatan terdaftar.</p>
          <Button variant="link" onClick={() => setIsModalOpen(true)}>Klik di sini untuk membuat agenda pertama</Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.map((jadwal) => {
            const status = getStatus(jadwal.tanggal);
            return (
              <Card key={jadwal.id} className="group overflow-hidden border-border/50 shadow-sm hover:shadow-xl hover:border-primary/30 transition-all duration-300 transform hover:-translate-y-1 bg-gradient-to-b from-card to-muted/10">
                <CardHeader className="pb-3 relative">
                  <div className="flex justify-between items-center mb-1">
                    <Badge variant="outline" className={`border ${status.color}`}>
                      {status.label}
                    </Badge>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 -mr-2"
                      onClick={() => setDeleteTarget(jadwal.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <CardTitle className="text-xl leading-tight group-hover:text-primary transition-colors line-clamp-2">
                    {jadwal.tema || jadwal.judul}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center text-sm font-medium bg-muted/40 p-2 rounded-lg">
                    <CalendarIcon className="w-4 h-4 mr-3 text-primary" />
                    {formatDate(jadwal.tanggal)}
                  </div>
                  
                  <div className="space-y-3 text-sm text-foreground/80">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-3 text-muted-foreground" />
                      {jadwal.waktu ? `${jadwal.waktu} WIB` : "Jam belum diatur"}
                    </div>
                    <div className="flex items-start">
                      <MapPin className="w-4 h-4 mr-3 text-muted-foreground flex-shrink-0 mt-0.5" />
                      <span className="line-clamp-2">{jadwal.lokasi}</span>
                    </div>
                  </div>

                  <div 
                    className="pt-2 border-t border-border/40 flex justify-end items-center text-xs text-primary font-semibold cursor-pointer"
                    onClick={() => setViewTarget(jadwal)}
                  >
                    <span>Detail Agenda</span>
                    <ArrowRight className="w-4 h-4 ml-1 transition-all transform translate-x-0 group-hover:translate-x-1" />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Detail Modal */}
      <Dialog open={!!viewTarget} onOpenChange={o => !o && setViewTarget(null)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-2xl">{viewTarget?.tema || viewTarget?.judul}</DialogTitle>
            <DialogDescription>Rincian kegiatan Posyandu</DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 pt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-muted/50 p-3 rounded-xl border border-border/50">
                <p className="text-xs text-muted-foreground mb-1 font-semibold uppercase tracking-wider">Tanggal</p>
                <div className="flex items-center text-sm font-medium">
                  <CalendarIcon className="w-4 h-4 mr-2 text-primary" />
                  {viewTarget && formatDate(viewTarget.tanggal)}
                </div>
              </div>
              <div className="bg-muted/50 p-3 rounded-xl border border-border/50">
                <p className="text-xs text-muted-foreground mb-1 font-semibold uppercase tracking-wider">Waktu</p>
                <div className="flex items-center text-sm font-medium">
                  <Clock className="w-4 h-4 mr-2 text-primary" />
                  {viewTarget?.waktu || "Jam belum diatur"}
                </div>
              </div>
            </div>

            <div className="bg-muted/50 p-4 rounded-xl border border-border/50">
              <p className="text-xs text-muted-foreground mb-2 font-semibold uppercase tracking-wider">Lokasi / Tempat</p>
              <div className="flex items-start text-sm font-medium leading-relaxed">
                <MapPin className="w-4 h-4 mr-3 text-primary flex-shrink-0 mt-0.5" />
                {viewTarget?.lokasi}
              </div>
            </div>

            <div className="p-4 rounded-xl border-2 border-dashed border-primary/20 bg-primary/5">
              <p className="text-xs text-primary/70 mb-1 font-bold">Catatan Kegiatan</p>
              <p className="text-sm italic text-muted-foreground">
                Dihimbau semua warga yang memiliki balita/lansia untuk hadir tepat waktu. Jangan lupa membawa buku KIA.
              </p>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => setViewTarget(null)}>Tutup</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteTarget} onOpenChange={o => !o && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Jadwal Kegiatan?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan. Jadwal akan dihapus permanen dari sistem.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={onDelete} className="bg-destructive hover:bg-destructive/90">
              Hapus Sekarang
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
