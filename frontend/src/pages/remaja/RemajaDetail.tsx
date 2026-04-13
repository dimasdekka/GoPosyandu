import { useNavigate } from "react-router-dom";
import { ArrowLeft, Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function RemajaDetail() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => navigate("/remaja")}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <h1 className="text-2xl font-bold">Detail Profil Remaja</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center"><Activity className="mr-2" /> Mock Detail Remaja</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Ini adalah halaman skeleton untuk riwayat kesehatan remaja, mencakup catatan edukasi NAPZA, Reproduksi, dan pengecekan Anemia.</p>
        </CardContent>
      </Card>
    </div>
  );
}
