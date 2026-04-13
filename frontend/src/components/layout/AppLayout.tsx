import { Activity, Baby, Calendar, Users, Menu, LogOut, FileText } from "lucide-react";
import { Link, useNavigate, Outlet, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    navigate("/login");
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-muted/30 flex flex-col md:flex-row">
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-card border-r border-border fixed h-full z-10 shadow-sm">
        <div className="p-6 flex items-center gap-3 border-b border-border/50">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Activity className="w-6 h-6 text-primary" />
          </div>
          <span className="font-Fraunces font-bold text-xl text-foreground">SIPosyandu</span>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link to="/dashboard" className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${isActive('/dashboard') ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}>
            <Activity className="w-5 h-5" />
            Dashboard
          </Link>
          <Link to="/balita" className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${isActive('/balita') || location.pathname.startsWith('/balita/') ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}>
            <Baby className="w-5 h-5" />
            Data Balita
          </Link>
          <Link to="#" className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:bg-muted hover:text-foreground rounded-xl font-medium transition-colors">
            <Users className="w-5 h-5" />
            Ibu Hamil
          </Link>
          <Link to="#" className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:bg-muted hover:text-foreground rounded-xl font-medium transition-colors">
            <Calendar className="w-5 h-5" />
            Jadwal
          </Link>
          <Link to="#" className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:bg-muted hover:text-foreground rounded-xl font-medium transition-colors">
            <FileText className="w-5 h-5" />
            Laporan
          </Link>
        </nav>
        <div className="p-4 border-t border-border/50">
          <Button variant="ghost" className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10" onClick={handleLogout}>
            <LogOut className="w-5 h-5 mr-3" />
            Keluar
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 md:ml-64 p-4 md:p-8 pb-24 md:pb-8 flex flex-col space-y-6">
        {/* Header Mobile */}
        <div className="md:hidden flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Activity className="w-6 h-6 text-primary" />
            <span className="font-Fraunces font-bold text-lg">SIPosyandu</span>
          </div>
          <Button variant="ghost" size="icon">
            <Menu className="w-6 h-6" />
          </Button>
        </div>
        
        {/* Outline of actual pages */}
        <Outlet />
      </main>

      {/* Mobile Bottom Nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border flex justify-around p-3 z-50 shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
        <Link to="/dashboard" className={`flex flex-col items-center gap-1 ${isActive('/dashboard') ? 'text-primary' : 'text-muted-foreground'}`}>
          <Activity className="w-6 h-6" />
          <span className="text-[10px] font-medium">Beranda</span>
        </Link>
        <Link to="/balita" className={`flex flex-col items-center gap-1 ${isActive('/balita') || location.pathname.startsWith('/balita/') ? 'text-primary' : 'text-muted-foreground'}`}>
          <Baby className="w-6 h-6" />
          <span className="text-[10px] font-medium">Balita</span>
        </Link>
        <Link to="#" className="flex flex-col items-center gap-1 text-muted-foreground">
          <Calendar className="w-6 h-6" />
          <span className="text-[10px] font-medium">Jadwal</span>
        </Link>
        <button onClick={handleLogout} className="flex flex-col items-center gap-1 text-destructive">
          <LogOut className="w-6 h-6" />
          <span className="text-[10px] font-medium">Keluar</span>
        </button>
      </div>
    </div>
  );
}
