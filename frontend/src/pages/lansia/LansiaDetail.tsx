import { useNavigate } from "react-router-dom";
import { ArrowLeft, HeartPulse } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function LansiaDetail() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => navigate("/lansia")}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <h1 className="text-2xl font-bold">Detail Screening PTM Lansia</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center"><HeartPulse className="mr-2 text-destructive" /> Mock Riwayat Kesehatan</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Tampilan untuk mengontrol tensi, asam urat, gula darah, dan deteksi dini komplikasi PTM.</p>
        </CardContent>
      </Card>
    </div>
  );
}
