import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Plus, Calendar as CalendarIcon, HeartPulse, Activity, CheckCircle2 } from "lucide-react";
import axios from "axios";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const getStatusBadge = (status: string) => {
  switch (status) {
    case "Risiko Rendah": return "bg-amber-100 text-amber-700 border-amber-200";
    case "Risiko Tinggi": return "bg-red-100 text-red-700 border-red-200";
    default: return "bg-green-100 text-green-700 border-green-200"; // Normal
  }
};

export default function IbuHamilDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Form State
  const [bb, setBb] = useState("");
  const [tb, setTb] = useState("");
  const [tensiSistolik, setTensiSistolik] = useState("");
  const [tensiDiastolik, setTensiDiastolik] = useState("");
  const [lila, setLila] = useState("");
  const [tfu, setTfu] = useState("");
  const [djj, setDjj] = useState("");
  const [keluhan, setKeluhan] = useState("");
  const [usiaKandunganInput, setUsiaKandunganInput] = useState("");
  const [statusRisiko, setStatusRisiko] = useState<"Normal" | "Risiko Rendah" | "Risiko Tinggi" | "">("");

  const fetchDetail = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/api/v1/ibu-hamil/${id}`);
      setProfile(res.data.data);
    } catch (error) {
      console.error("Gagal memuat data ibu hamil:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (id) fetchDetail(); }, [id]);

  const resetForm = () => {
    setBb(""); setTb(""); setTensiSistolik(""); setTensiDiastolik("");
    setLila(""); setTfu(""); setDjj(""); setKeluhan("");
    setUsiaKandunganInput("");
    setStatusRisiko(""); setSubmitError(""); setSubmitSuccess(false);
  };

  const calculateUsiaKandungan = (hphtDate: string) => {
    if (!hphtDate) return 0;
    const hpht = new Date(hphtDate);
    const now = new Date();
    const diffTime = now.getTime() - hpht.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, Math.floor(diffDays / 7));
  };

  const calculateHPL = (hphtDate: string) => {
    if (!hphtDate) return "-";
    const hpht = new Date(hphtDate);
    const hplDate = new Date(hpht.getTime());
    hplDate.setDate(hplDate.getDate() + 280);
    return hplDate.toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const onSubmitPemeriksaan = async () => {
    if (!statusRisiko) {
      setSubmitError("Status Risiko wajib dipilih.");
      return;
    }
    try {
      setSubmitting(true);
      setSubmitError("");
      const uk = parseInt(usiaKandunganInput);
      if (isNaN(uk) || uk <= 0) {
        setSubmitError("Usia kandungan harus berupa angka valid.");
        setSubmitting(false);
        return;
      }
      const payload: any = { usiaKandungan: uk, statusRisiko };
      if (bb.trim() !== "") payload.bb = parseFloat(bb);
      if (tb.trim() !== "") payload.tb = parseFloat(tb);
      if (tensiSistolik.trim() !== "") payload.tensiSistolik = parseInt(tensiSistolik);
      if (tensiDiastolik.trim() !== "") payload.tensiDiastolik = parseInt(tensiDiastolik);
      if (lila.trim() !== "") payload.lila = parseFloat(lila);
      if (tfu.trim() !== "") payload.tfu = parseInt(tfu);
      if (djj.trim() !== "") payload.djj = parseInt(djj);
      if (keluhan.trim()) payload.keluhan = keluhan.trim();

      await axios.post(`/api/v1/ibu-hamil/${id}/pemeriksaan`, payload);
      setSubmitSuccess(true);
      setTimeout(() => { setIsModalOpen(false); resetForm(); fetchDetail(); }, 1000);
    } catch (error: any) {
      const msg = error?.response?.data?.errors?.[0]?.message || "Gagal menyimpan. Coba lagi.";
      setSubmitError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-muted animate-pulse rounded-md" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-64 bg-muted animate-pulse rounded-xl" />
          <div className="md:col-span-2 h-64 bg-muted animate-pulse rounded-xl" />
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="space-y-6">
        <Button variant="outline" onClick={() => navigate("/ibu-hamil")}><ArrowLeft className="w-4 h-4 mr-2" /> Kembali</Button>
        <div className="flex items-center justify-center min-h-[50vh]"><p className="text-destructive">Data Ibu Hamil tidak ditemukan.</p></div>
      </div>
    );
  }

  const latestP = profile.pemeriksaan?.length > 0 ? profile.pemeriksaan[0] : null;
  const currentRisk = latestP?.statusRisiko ?? "Belum Dievaluasi";
  
  let usiaKandungan = 0;
  if (latestP && latestP.usiaKandungan) {
    const checkupDate = new Date(latestP.tglPeriksa || latestP.createdAt);
    const diffTimeP = new Date().getTime() - checkupDate.getTime();
    const diffWeeksP = Math.floor(diffTimeP / (1000 * 60 * 60 * 24 * 7));
    usiaKandungan = latestP.usiaKandungan + diffWeeksP;
  } else if (profile.hpht) {
    usiaKandungan = calculateUsiaKandungan(profile.hpht);
  }

  return (
    <div className="space-y-6 pb-20 sm:pb-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigate("/ibu-hamil")}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{profile.nama}</h1>
            <p className="text-muted-foreground text-sm flex items-center gap-1">
              <CalendarIcon className="w-3 h-3" />
              HPL: <span className="font-semibold text-foreground ml-1">{profile.hpht ? calculateHPL(profile.hpht) : '-'}</span>
              <span className="mx-2">•</span>
              <span className="font-semibold text-primary">{usiaKandungan} Minggu</span>
            </p>
          </div>
        </div>

        <Dialog open={isModalOpen} onOpenChange={(open) => { 
          setIsModalOpen(open); 
          if (!open) {
            resetForm();
          } else if (profile?.hpht) {
            setUsiaKandunganInput(calculateUsiaKandungan(profile.hpht).toString());
          }
        }}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto">
              <Plus className="w-4 h-4 mr-2" />
              Kunjungan Baru
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[560px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Input Pemeriksaan Kehamilan</DialogTitle>
              <DialogDescription>
                Data kunjungan ANC (Antenatal Care). <span className="text-destructive">*</span> wajib diisi.
              </DialogDescription>
            </DialogHeader>

            {submitSuccess ? (
              <div className="flex flex-col items-center justify-center py-8 gap-3 text-green-600">
                <CheckCircle2 className="w-12 h-12" />
                <p className="font-semibold text-lg">Kunjungan berhasil dicatat!</p>
              </div>
            ) : (
              <div className="space-y-4 py-2">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Ukuran Vital</p>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label className="text-sm">Berat Badan (kg)</Label>
                    <Input type="number" step="0.1" placeholder="Contoh: 62.5" value={bb} onChange={e => setBb(e.target.value)} />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-sm">Tinggi Badan (cm)</Label>
                    <Input type="number" step="0.1" placeholder="Contoh: 155" value={tb} onChange={e => setTb(e.target.value)} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label className="text-sm">LILA (cm) <span className="text-xs text-muted-foreground">Lingkar Lengan Atas</span></Label>
                    <Input type="number" step="0.1" placeholder="Normal: ≥23.5 cm" value={lila} onChange={e => setLila(e.target.value)} />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-sm">Tensi Sistolik (mmHg)</Label>
                    <Input type="number" placeholder="Normal: 120" value={tensiSistolik} onChange={e => setTensiSistolik(e.target.value)} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label className="text-sm">Tensi Diastolik (mmHg)</Label>
                    <Input type="number" placeholder="Normal: 80" value={tensiDiastolik} onChange={e => setTensiDiastolik(e.target.value)} />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-sm">TFU (cm) <span className="text-xs text-muted-foreground">Tinggi Fundus Uteri</span></Label>
                    <Input type="number" placeholder="Sesuai usia kehamilan" value={tfu} onChange={e => setTfu(e.target.value)} />
                  </div>
                </div>

                <div className="space-y-1">
                  <Label className="text-sm">DJJ (x/mnt) <span className="text-xs text-muted-foreground">Denyut Jantung Janin</span></Label>
                  <Input type="number" placeholder="Normal: 120–160" value={djj} onChange={e => setDjj(e.target.value)} />
                </div>

                <div className="space-y-1">
                  <Label className="text-sm font-semibold">Usia Kandungan (Minggu) <span className="text-destructive">*</span></Label>
                  <Input 
                    type="number" 
                    placeholder="Contoh: 12" 
                    value={usiaKandunganInput} 
                    onChange={e => setUsiaKandunganInput(e.target.value)} 
                    className="border-primary/50 focus:ring-primary"
                  />
                  <p className="text-[10px] text-muted-foreground italic">Diisi otomatis dari HPHT, silakan ubah jika tidak sesuai.</p>
                </div>

                <div className="space-y-1">
                  <Label className="text-sm">Status Risiko <span className="text-destructive">*</span></Label>
                  <Select value={statusRisiko} onValueChange={(v) => setStatusRisiko(v as any)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih status risiko kehamilan..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Normal">✅ Normal</SelectItem>
                      <SelectItem value="Risiko Rendah">⚠️ Risiko Rendah</SelectItem>
                      <SelectItem value="Risiko Tinggi">🔴 Risiko Tinggi</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <Label className="text-sm">Keluhan / Catatan</Label>
                  <Textarea
                    placeholder="Contoh: Pusing, mual, bengkak pada kaki. Diberikan tablet FE dan kalsium."
                    value={keluhan}
                    onChange={e => setKeluhan(e.target.value)}
                    rows={3}
                  />
                </div>

                {submitError && (
                  <p className="text-sm text-destructive bg-destructive/10 rounded-md px-3 py-2">{submitError}</p>
                )}

                <div className="flex justify-end gap-3 pt-2">
                  <Button variant="outline" onClick={() => { setIsModalOpen(false); resetForm(); }}>Batal</Button>
                  <Button onClick={onSubmitPemeriksaan} disabled={submitting}>
                    {submitting ? "Menyimpan..." : "Simpan Kunjungan"}
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Info Box */}
        <Card className="md:col-span-1 border-border/60 shadow-sm">
          <CardHeader className="bg-muted/30 pb-4 border-b border-border/40">
            <CardTitle className="text-lg flex items-center">
              <Activity className="w-5 h-5 mr-2 text-primary" />
              Status Kehamilan
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-3 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Status Risiko</span>
              <Badge variant="outline" className={`border ${getStatusBadge(currentRisk)}`}>{currentRisk}</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Usia Kandungan</span>
              <span className="font-semibold text-primary">{usiaKandungan} Minggu</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">HPHT</span>
              <span className="font-medium">{profile.hpht ? new Date(profile.hpht).toLocaleDateString('id-ID') : '-'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Nama Suami</span>
              <span className="font-medium">{profile.suami || "-"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">No. Telepon</span>
              <span className="font-medium">{profile.noTelepon || "-"}</span>
            </div>
            {latestP && (
              <>
                <div className="pt-4 mt-2 border-t border-dashed border-border/60 space-y-4">
                  <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest text-center">Hasil Pemeriksaan Terakhir</p>
                  <div className="space-y-3.5">
                    <div className="flex justify-between items-end border-b border-dashed border-border/30 pb-1.5">
                      <span className="text-muted-foreground text-[10px] uppercase font-bold">Tensi</span>
                      <span className="font-bold text-sm">
                        {latestP.tensiSistolik ? `${latestP.tensiSistolik}/${latestP.tensiDiastolik}` : '-'} <span className="text-[10px] font-normal text-muted-foreground ml-1">mmHg</span>
                      </span>
                    </div>
                    <div className="flex justify-between items-end border-b border-dashed border-border/30 pb-1.5">
                      <span className="text-muted-foreground text-[10px] uppercase font-bold">LILA</span>
                      <span className="font-bold text-sm">
                        {latestP.lila != null ? `${Number(latestP.lila).toFixed(1)} cm` : '-'}
                      </span>
                    </div>
                    <div className="flex justify-between items-end border-b border-dashed border-border/30 pb-1.5">
                      <span className="text-muted-foreground text-[10px] uppercase font-bold">Resiko & Klinis</span>
                      <span className="font-bold text-sm text-primary">
                        TFU: {latestP.tfu || '-'} cm <span className="mx-1 text-muted-foreground">•</span> DJJ: {latestP.djj || '-'} x/m
                      </span>
                    </div>
                    <div className="flex justify-between items-end">
                      <span className="text-muted-foreground text-[10px] uppercase font-bold">Berat & Tinggi</span>
                      <span className="font-bold text-sm">
                        BB: {latestP.bb != null ? Number(latestP.bb).toFixed(1) : '-'} kg <span className="mx-1 text-muted-foreground">|</span> TB: {latestP.tb != null ? Number(latestP.tb).toFixed(1) : '-'} cm
                      </span>
                    </div>
                  </div>
                </div>
              </>
            )}
            <div className="pt-2 border-t border-border/50">
              <p className="text-muted-foreground text-xs mb-1">Alamat</p>
              <p className="font-medium">{profile.alamat || "-"}</p>
            </div>
          </CardContent>
        </Card>

        {/* Riwayat Kunjungan */}
        <Card className="md:col-span-2 border-border/60 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center">
              <HeartPulse className="w-5 h-5 mr-2 text-destructive" />
              Riwayat Kunjungan ANC
            </CardTitle>
            <CardDescription>Catatan pemeriksaan antenatal pada setiap kunjungan Posyandu.</CardDescription>
          </CardHeader>
          <CardContent className="p-0 overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>UK (mgg)</TableHead>
                  <TableHead>Tensi</TableHead>
                  <TableHead>BB / TB / LILA</TableHead>
                  <TableHead>TFU / DJJ</TableHead>
                  <TableHead>Status Risiko</TableHead>
                  <TableHead>Keluhan</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {profile.pemeriksaan?.length > 0 ? (
                  profile.pemeriksaan.map((r: any) => (
                    <TableRow key={r.id} className="hover:bg-muted/30">
                      <TableCell className="font-medium whitespace-nowrap">
                        {new Date(r.tglPeriksa || r.createdAt).toLocaleDateString('id-ID')}
                      </TableCell>
                      <TableCell>{r.usiaKandungan} mgg</TableCell>
                      <TableCell>
                        {r.tensiSistolik ? (
                          <span className={r.tensiSistolik >= 140 ? "text-destructive font-bold" : ""}>
                            {r.tensiSistolik}/{r.tensiDiastolik}
                          </span>
                        ) : '-'}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{r.bb != null ? `${Number(r.bb).toFixed(1)} kg` : '-'}</div>
                          <div className="text-muted-foreground">{r.tb != null ? `${Number(r.tb).toFixed(1)} cm` : ''}</div>
                          <div className="text-muted-foreground">{r.lila != null ? `LILA: ${Number(r.lila).toFixed(1)} cm` : ''}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{r.tfu ? `TFU: ${r.tfu} cm` : '-'}</div>
                          <div className="text-muted-foreground">{r.djj ? `DJJ: ${r.djj}x/mnt` : ''}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`border ${getStatusBadge(r.statusRisiko)}`}>
                          {r.statusRisiko}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground max-w-[160px] truncate">
                        {r.keluhan || '-'}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center h-24 text-muted-foreground">
                      Belum ada riwayat kunjungan. Klik "Kunjungan Baru" untuk memulai.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
