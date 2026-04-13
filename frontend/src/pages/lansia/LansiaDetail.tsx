import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Plus, HeartPulse, User, CheckCircle2 } from "lucide-react";
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

const getResikoBadge = (resiko: string) => {
  switch (resiko) {
    case "Rendah": return "bg-green-100 text-green-700 border-green-200";
    case "Sedang": return "bg-amber-100 text-amber-700 border-amber-200";
    case "Tinggi": return "bg-red-100 text-red-700 border-red-200";
    default: return "bg-muted text-muted-foreground border-border";
  }
};

export default function LansiaDetail() {
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
  const [gulaDarah, setGulaDarah] = useState("");
  const [asamUrat, setAsamUrat] = useState("");
  const [kolesterol, setKolesterol] = useState("");
  const [keluhan, setKeluhan] = useState("");
  const [resikoPTM, setResikoPTM] = useState<"Rendah" | "Sedang" | "Tinggi" | "">("");

  const fetchDetail = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/api/v1/lansia/${id}`);
      setProfile(res.data.data);
    } catch (error) {
      console.error("Gagal memuat data lansia:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (id) fetchDetail(); }, [id]);

  const resetForm = () => {
    setBb(""); setTb(""); setTensiSistolik(""); setTensiDiastolik("");
    setGulaDarah(""); setAsamUrat(""); setKolesterol(""); setKeluhan("");
    setResikoPTM(""); setSubmitError(""); setSubmitSuccess(false);
  };

  const onSubmitPemeriksaan = async () => {
    if (!resikoPTM) {
      setSubmitError("Risiko PTM wajib dipilih.");
      return;
    }
    try {
      setSubmitting(true);
      setSubmitError("");
      const payload: any = { resikoPTM };
      if (parseFloat(bb) > 0) payload.bb = parseFloat(bb);
      if (parseFloat(tb) > 0) payload.tb = parseFloat(tb);
      if (parseInt(tensiSistolik) > 0) payload.tensiSistolik = parseInt(tensiSistolik);
      if (parseInt(tensiDiastolik) > 0) payload.tensiDiastolik = parseInt(tensiDiastolik);
      if (parseInt(gulaDarah) > 0) payload.gulaDarah = parseInt(gulaDarah);
      if (parseFloat(asamUrat) > 0) payload.asamUrat = parseFloat(asamUrat);
      if (parseInt(kolesterol) > 0) payload.kolesterol = parseInt(kolesterol);
      if (keluhan.trim()) payload.keluhan = keluhan.trim();

      await axios.post(`/api/v1/lansia/${id}/pemeriksaan`, payload);
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
        <Button variant="outline" onClick={() => navigate("/lansia")}><ArrowLeft className="w-4 h-4 mr-2" /> Kembali</Button>
        <div className="flex items-center justify-center min-h-[50vh]"><p className="text-destructive">Data Lansia tidak ditemukan.</p></div>
      </div>
    );
  }

  const latestP = profile.pemeriksaan?.length > 0 ? profile.pemeriksaan[0] : null;
  const currentResiko = latestP?.resikoPTM ?? "Belum Dievaluasi";

  return (
    <div className="space-y-6 pb-20 sm:pb-0">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigate("/lansia")}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{profile.nama}</h1>
              <Badge variant="outline" className={`border ${getResikoBadge(currentResiko)}`}>{currentResiko}</Badge>
            </div>
            <p className="text-muted-foreground text-sm flex items-center gap-1">
              <User className="w-3 h-3" /> {profile.umur} Tahun
            </p>
          </div>
        </div>

        <Dialog open={isModalOpen} onOpenChange={(open) => { setIsModalOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto">
              <Plus className="w-4 h-4 mr-2" />
              Screening PTM Baru
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[560px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Screening Penyakit Tidak Menular (PTM)</DialogTitle>
              <DialogDescription>
                Catat hasil screening kesehatan lansia. <span className="text-destructive">*</span> wajib diisi.
              </DialogDescription>
            </DialogHeader>

            {submitSuccess ? (
              <div className="flex flex-col items-center justify-center py-8 gap-3 text-green-600">
                <CheckCircle2 className="w-12 h-12" />
                <p className="font-semibold text-lg">Screening berhasil dicatat!</p>
              </div>
            ) : (
              <div className="space-y-4 py-2">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Data Fisik</p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label className="text-sm">Berat Badan (kg)</Label>
                    <Input type="number" step="0.1" placeholder="Contoh: 58.0" value={bb} onChange={e => setBb(e.target.value)} />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-sm">Tinggi Badan (cm)</Label>
                    <Input type="number" step="0.1" placeholder="Contoh: 160.0" value={tb} onChange={e => setTb(e.target.value)} />
                  </div>
                </div>

                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide pt-2">Tekanan Darah</p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label className="text-sm">Sistolik (mmHg)</Label>
                    <Input type="number" placeholder="Normal: &lt;130" value={tensiSistolik} onChange={e => setTensiSistolik(e.target.value)} />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-sm">Diastolik (mmHg)</Label>
                    <Input type="number" placeholder="Normal: &lt;80" value={tensiDiastolik} onChange={e => setTensiDiastolik(e.target.value)} />
                  </div>
                </div>

                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide pt-2">Laboratorium Darah</p>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <Label className="text-sm">Gula Darah (mg/dL)</Label>
                    <Input type="number" placeholder="Normal: &lt;140" value={gulaDarah} onChange={e => setGulaDarah(e.target.value)} />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-sm">Asam Urat (mg/dL)</Label>
                    <Input type="number" step="0.1" placeholder="N: ≤6 (P) / ≤7 (L)" value={asamUrat} onChange={e => setAsamUrat(e.target.value)} />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-sm">Kolesterol (mg/dL)</Label>
                    <Input type="number" placeholder="Normal: &lt;200" value={kolesterol} onChange={e => setKolesterol(e.target.value)} />
                  </div>
                </div>

                <div className="space-y-1">
                  <Label className="text-sm">Risiko PTM <span className="text-destructive">*</span></Label>
                  <Select value={resikoPTM} onValueChange={(v) => setResikoPTM(v as any)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih tingkat risiko PTM..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Rendah">✅ Rendah — Tidak ada faktor risiko</SelectItem>
                      <SelectItem value="Sedang">⚠️ Sedang — 1-2 faktor risiko</SelectItem>
                      <SelectItem value="Tinggi">🔴 Tinggi — &gt;2 faktor risiko / sudah PTM</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <Label className="text-sm">Keluhan / Catatan Tindak Lanjut</Label>
                  <Textarea
                    placeholder="Contoh: Mengeluh pusing dan nyeri lutut. Dirujuk ke Puskesmas untuk pemeriksaan lanjutan. Diberikan edukasi LSBS."
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
                    {submitting ? "Menyimpan..." : "Simpan Screening"}
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1 border-border/60 shadow-sm">
          <CardHeader className="bg-muted/30 pb-4 border-b border-border/40">
            <CardTitle className="text-lg flex items-center">
              <HeartPulse className="w-5 h-5 mr-2 text-destructive" />
              Info Lansia
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Usia</span>
              <span className="font-medium">{profile.umur} Tahun</span>
            </div>
            {latestP && (
              <div className="pt-2 border-t border-border/50 space-y-2">
                <p className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">Hasil Screening Terakhir</p>
                <div className="flex justify-between"><span className="text-muted-foreground">BB / TB</span><span>{latestP.bb ? `${latestP.bb} kg` : '-'} / {latestP.tb ? `${latestP.tb} cm` : '-'}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Tensi</span><span className={latestP.tensiSistolik >= 130 ? "text-destructive font-bold" : ""}>{latestP.tensiSistolik ? `${latestP.tensiSistolik}/${latestP.tensiDiastolik}` : '-'}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Gula Darah</span><span className={latestP.gulaDarah >= 140 ? "text-destructive font-bold" : ""}>{latestP.gulaDarah ? `${latestP.gulaDarah} mg/dL` : '-'}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Asam Urat</span><span>{latestP.asamUrat ? `${latestP.asamUrat} mg/dL` : '-'}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Kolesterol</span><span className={latestP.kolesterol >= 200 ? "text-destructive font-bold" : ""}>{latestP.kolesterol ? `${latestP.kolesterol} mg/dL` : '-'}</span></div>
              </div>
            )}
            <div className="pt-2 border-t border-border/50">
              <p className="text-muted-foreground text-xs mb-1">Alamat</p>
              <p className="font-medium">{profile.alamat || "-"}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2 border-border/60 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center">Riwayat Screening PTM</CardTitle>
            <CardDescription>Pengecekan Tensi, Gula Darah, Asam Urat, dan Kolesterol.</CardDescription>
          </CardHeader>
          <CardContent className="p-0 overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>BB / TB</TableHead>
                  <TableHead>Tensi</TableHead>
                  <TableHead>Gula Darah</TableHead>
                  <TableHead>Asam Urat</TableHead>
                  <TableHead>Kolesterol</TableHead>
                  <TableHead>Risiko PTM</TableHead>
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
                      <TableCell className="text-sm">
                        <div>{r.bb ? `${r.bb} kg` : '-'}</div>
                        <div className="text-muted-foreground">{r.tb ? `${r.tb} cm` : ''}</div>
                      </TableCell>
                      <TableCell>
                        {r.tensiSistolik ? (
                          <span className={r.tensiSistolik >= 130 ? "text-destructive font-bold" : ""}>
                            {r.tensiSistolik}/{r.tensiDiastolik}
                          </span>
                        ) : '-'}
                      </TableCell>
                      <TableCell>
                        {r.gulaDarah ? (
                          <span className={r.gulaDarah >= 140 ? "text-destructive font-bold" : ""}>{r.gulaDarah}</span>
                        ) : '-'}
                      </TableCell>
                      <TableCell>{r.asamUrat ?? '-'}</TableCell>
                      <TableCell>
                        {r.kolesterol ? (
                          <span className={r.kolesterol >= 200 ? "text-destructive font-bold" : ""}>{r.kolesterol}</span>
                        ) : '-'}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`border ${getResikoBadge(r.resikoPTM)}`}>
                          {r.resikoPTM}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground max-w-[160px] truncate">
                        {r.keluhan || '-'}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center h-24 text-muted-foreground">
                      Belum ada riwayat screening. Klik "Screening PTM Baru" untuk memulai.
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
