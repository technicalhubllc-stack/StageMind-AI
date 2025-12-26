import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Monitor, 
  Activity, 
  Ticket, 
  Tags, 
  Database, 
  Users, 
  User, 
  Target, 
  Rocket, 
  TrendingUp,
  MonitorPlay,
  Bell,
  Search,
  Zap,
  ChevronDown,
  LogOut,
  Settings,
  Star,
  ArrowUpRight,
  ArrowDownRight,
  Info,
  AlertTriangle,
  Maximize2,
  RefreshCw,
  LayoutDashboard,
  CheckCircle2,
  X,
  Plus,
  MoreVertical,
  Loader2,
  History,
  ShieldCheck,
  DollarSign,
  PieChart as LucidePieChart
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  LineChart,
  Line,
  PieChart as RePieChart,
  Pie
} from 'recharts';
import { useToast } from '../App';
// Import DashboardPreview to resolve the missing component reference
import DashboardPreview from './DashboardPreview';

interface DashboardPageProps {
  onLogout: () => void;
}

interface SeatData {
  id: string;
  heat: number;
  occupied: boolean;
  status: 'available' | 'booked' | 'premium';
}

interface TheatreZone {
  id: string;
  name: string;
  occupancy: number;
  revenue: string;
  heat: number;
  capacity: number;
  seats: SeatData[];
}

interface ClickedSeatInfo {
  seat: SeatData;
  x: number;
  y: number;
  zoneName: string;
  row: number;
  col: number;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#0F172A]/95 border border-white/10 p-6 rounded-[32px] shadow-2xl backdrop-blur-3xl text-right min-w-[200px]">
        <p className="text-[10px] font-black text-gray-500 mb-4 uppercase tracking-[0.3em] font-plex">{label}</p>
        <div className="space-y-3">
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center justify-between gap-8 flex-row-reverse">
              <div className="flex items-center gap-3 flex-row-reverse">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color || entry.fill }} />
                <span className="text-xs font-black text-gray-300 font-plex">{entry.name}</span>
              </div>
              <span className="text-sm font-black text-white tracking-tight font-plex">
                {entry.value}%
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

const KPICard: React.FC<{ 
  label: string; 
  val: string; 
  target: string;
  change: string; 
  icon: React.ReactNode; 
  themeColor: 'teal' | 'gold' | 'blue' | 'purple';
  data: { v: number }[];
  highlight?: boolean;
}> = ({ label, val, target, change, icon, themeColor, data, highlight }) => {
  const themes = {
    teal: { text: 'text-electric-teal', bg: 'bg-electric-teal/10', border: 'border-electric-teal/20', accent: '#64FFDA' },
    gold: { text: 'text-amber-gold', bg: 'bg-amber-gold/10', border: 'border-amber-gold/20', accent: '#FFB400' },
    blue: { text: 'text-blue-400', bg: 'bg-blue-400/10', border: 'border-blue-400/20', accent: '#60A5FA' },
    purple: { text: 'text-purple-400', bg: 'bg-purple-400/10', border: 'border-purple-400/20', accent: '#A78BFA' }
  };
  const theme = themes[themeColor];
  const isUp = change.includes('+');

  return (
    <div className={`glass-card p-8 rounded-[48px] border flex flex-col group hover:border-white/10 transition-all duration-700 shadow-3xl relative overflow-hidden h-full cursor-default text-right ${highlight ? 'border-amber-gold/30 shadow-[0_0_40px_rgba(255,180,0,0.1)]' : 'border-white/5'}`}>
      <div className="absolute inset-x-0 bottom-0 h-32 opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <Area type="monotone" dataKey="v" stroke={theme.accent} strokeWidth={4} fill={theme.accent} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="flex items-start justify-between mb-8 flex-row-reverse relative z-10">
        <div className={`w-14 h-14 rounded-[22px] flex items-center justify-center transition-all group-hover:scale-110 border shadow-2xl ${theme.bg} ${theme.text} ${theme.border}`}>{icon}</div>
        <div className={`px-3 py-1 rounded-full border border-white/5 font-black text-[10px] font-plex flex items-center gap-2 ${isUp ? 'text-green-400 bg-green-500/5' : 'text-blue-400 bg-blue-500/5'}`}>{isUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}{change}</div>
      </div>
      <div className="relative z-10 mb-6">
        <p className="text-gray-500 font-black text-[10px] uppercase tracking-[0.3em] mb-2 font-plex">{label}</p>
        <h3 className={`text-3xl md:text-5xl font-black tracking-tighter font-plex group-hover:scale-105 transition-all duration-500 origin-right whitespace-nowrap ${highlight ? 'text-amber-gold animate-pulse' : 'text-white'}`}>{val}</h3>
      </div>
      <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between flex-row-reverse relative z-10">
        <div className="text-right">
          <p className="text-[9px] text-slate-400 font-bold font-plex uppercase tracking-widest">المستهدف اليومي</p>
          <p className="text-sm font-black text-white/80 font-plex">{target}</p>
        </div>
        {highlight && (
          <div className="flex items-center gap-2 bg-amber-gold/10 px-2 py-0.5 rounded-full border border-amber-gold/20">
             <Star className="w-2.5 h-2.5 text-amber-gold fill-amber-gold" />
             <span className="text-[8px] font-black text-amber-gold font-plex uppercase">AI Optimized</span>
          </div>
        )}
      </div>
    </div>
  );
};

const DashboardPage: React.FC<DashboardPageProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('الرئيسية');
  const [heatmapMode, setHeatmapMode] = useState<'demand' | 'revenue'>('demand');
  const [clickedSeat, setClickedSeat] = useState<ClickedSeatInfo | null>(null);
  const [isDynamicPricingActive, setIsDynamicPricingActive] = useState(false);
  const { addToast } = useToast();

  const menuItems = [
    { label: 'الرئيسية', icon: <Monitor className="w-5 h-5" /> },
    { label: 'تفاعل الجمهور', icon: <Activity className="w-5 h-5" /> },
    { label: 'إدارة العروض', icon: <Ticket className="w-5 h-5" /> },
    { label: 'التسعير الديناميكي', icon: <Rocket className="w-5 h-5" /> },
    { label: 'مركز الأرباح', icon: <TrendingUp className="w-5 h-5" /> },
  ];

  const generateSeats = (count: number, baseHeat: number, zoneId: string) => {
    return Array.from({ length: count }).map((_, i) => {
      const heat = Math.min(1, Math.max(0.1, baseHeat + (Math.random() * 0.4 - 0.2)));
      const occupied = Math.random() < heat;
      let status: 'available' | 'booked' | 'premium' = occupied ? 'booked' : 'available';
      if (!occupied && (zoneId.startsWith('v') || (zoneId === 'o1' && i < 15))) {
        status = 'premium';
      }
      return { id: `${zoneId}-s-${i}`, heat, occupied, status };
    });
  };

  const theatreZones: TheatreZone[] = useMemo(() => [
    { id: 'v1', name: 'الجناح الملكي 1', occupancy: 100, revenue: '$12,400', heat: 0.95, capacity: 12, seats: generateSeats(12, 0.95, 'v1') },
    { id: 'v2', name: 'الجناح الملكي 2', occupancy: 92, revenue: '$11,200', heat: 0.88, capacity: 12, seats: generateSeats(12, 0.92, 'v2') },
    { id: 'o1', name: 'الأوركسترا - الصفوف الأولى', occupancy: 98, revenue: '$45,000', heat: 0.98, capacity: 64, seats: generateSeats(64, 0.98, 'o1') },
    { id: 'o2', name: 'الأوركسترا - وسط', occupancy: 84, revenue: '$38,500', heat: 0.72, capacity: 120, seats: generateSeats(120, 0.84, 'o2') },
    { id: 'o3', name: 'الأوركسترا - خلفية', occupancy: 70, revenue: '$22,000', heat: 0.55, capacity: 160, seats: generateSeats(160, 0.70, 'o3') },
  ], []);

  const handleSeatClick = (seat: SeatData, x: number, y: number, zoneName: string, row: number, col: number) => {
    if (clickedSeat?.seat.id === seat.id) {
      setClickedSeat(null);
    } else {
      setClickedSeat({ seat, x, y, zoneName, row, col });
    }
  };

  const SeatGrid: React.FC<{ 
    seats: SeatData[]; 
    cols: number; 
    size?: 'sm' | 'md' | 'lg'; 
    zoneName: string;
    onSeatClick: (seat: SeatData, x: number, y: number, zoneName: string, row: number, col: number) => void;
    heatmapMode: 'demand' | 'revenue';
  }> = ({ seats, cols, size = 'md', zoneName, onSeatClick, heatmapMode }) => {
    return (
      <div className={`grid p-1 ${size === 'sm' ? 'gap-1' : size === 'lg' ? 'gap-3' : 'gap-2'}`} style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
        {seats.map((seat, index) => {
          const val = heatmapMode === 'demand' ? seat.heat : (seat.heat * 0.8 + (seat.status === 'premium' ? 0.2 : 0));
          let colorClass = "bg-slate-700/30";
          let glowClass = "";
          
          if (val >= 0.9) {
            colorClass = "bg-red-500";
            glowClass = "shadow-[0_0_10px_rgba(239,68,68,0.5)]";
          } else if (val >= 0.7) {
            colorClass = "bg-orange-500";
          } else if (val >= 0.4) {
            colorClass = "bg-amber-400";
          } else {
            colorClass = "bg-emerald-400";
          }

          const isSelected = clickedSeat?.seat.id === seat.id;
          const rowNum = Math.floor(index / cols) + 1;
          const colNum = (index % cols) + 1;

          return (
            <button 
              key={seat.id} 
              onClick={(e) => {
                e.stopPropagation();
                const rect = e.currentTarget.getBoundingClientRect();
                onSeatClick(seat, rect.left + rect.width / 2, rect.top, zoneName, rowNum, colNum);
              }}
              className={`
                ${size === 'sm' ? 'w-2 h-2' : size === 'lg' ? 'w-6 h-6' : 'w-4 h-4'} 
                rounded-full transition-all duration-300 relative
                ${colorClass} ${glowClass}
                ${isSelected ? 'scale-[2] z-30 ring-2 ring-white' : 'hover:scale-[1.5] hover:z-20'}
              `}
            >
              {seat.occupied && !isSelected && <div className="absolute inset-1 rounded-full bg-black/30" />}
            </button>
          );
        })}
      </div>
    );
  };

  useEffect(() => {
    const handleGlobalClick = () => setClickedSeat(null);
    window.addEventListener('click', handleGlobalClick);
    return () => window.removeEventListener('click', handleGlobalClick);
  }, []);

  const kpiData = Array.from({ length: 7 }).map(() => ({ v: 40 + Math.random() * 50 }));

  return (
    <div className="flex h-screen bg-[#0A192F] overflow-hidden font-plex">
      {/* Sidebar */}
      <aside className="w-80 bg-slate-900 border-l border-white/5 flex flex-col p-8 transition-all duration-500 z-50">
        <div className="flex items-center gap-4 mb-16 flex-row-reverse">
          <div className="bg-electric-teal/10 p-3 rounded-2xl">
            <Activity className="w-8 h-8 text-electric-teal" />
          </div>
          <div className="text-right">
            <h1 className="text-2xl font-black text-white">StageMind</h1>
            <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.3em]">Conductor OS 3.1</p>
          </div>
        </div>

        <nav className="space-y-3 flex-1">
          {menuItems.map((item) => (
            <button 
              key={item.label}
              onClick={() => setActiveTab(item.label)}
              className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all group ${
                activeTab === item.label 
                  ? 'bg-electric-teal/10 text-electric-teal border border-electric-teal/20' 
                  : 'text-gray-500 hover:text-white hover:bg-white/5'
              }`}
            >
              {activeTab === item.label && <div className="w-1.5 h-1.5 rounded-full bg-electric-teal animate-pulse" />}
              <div className="flex items-center gap-4 flex-row-reverse">
                <span className="font-bold">{item.label}</span>
                {item.icon}
              </div>
            </button>
          ))}
        </nav>

        <div className="pt-8 border-t border-white/5">
          <button onClick={onLogout} className="w-full flex items-center justify-end gap-4 p-4 text-gray-500 hover:text-red-400 transition-colors">
            <span className="font-bold">تسجيل الخروج</span>
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-y-auto custom-scrollbar relative">
        <header className="p-8 border-b border-white/5 flex items-center justify-between sticky top-0 bg-[#0A192F]/80 backdrop-blur-3xl z-40">
           <div className="flex items-center gap-6">
              <div className="flex items-center gap-4 bg-white/5 px-4 py-2 rounded-2xl border border-white/10">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">محرك التحليلات: نشط</span>
              </div>
              <button className="p-3 bg-white/5 rounded-2xl border border-white/10 text-gray-400 hover:text-white transition-colors relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-electric-teal rounded-full" />
              </button>
           </div>
           
           <div className="flex-1 max-w-xl mx-8 relative group">
             <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
             <input 
               type="text" 
               placeholder="البحث السريع في القواعد والبيانات..."
               className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pr-12 pl-6 text-sm text-white focus:outline-none focus:border-electric-teal/50 transition-all text-right"
             />
           </div>

           <div className="flex items-center gap-4 flex-row-reverse">
             <div className="text-right">
               <p className="text-sm font-black text-white">إدارة دار الأوبرا</p>
               <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">حساب متميز</p>
             </div>
             <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-electric-teal to-blue-500 p-0.5 shadow-xl">
               <div className="w-full h-full rounded-[14px] bg-slate-900 flex items-center justify-center">
                 <User className="text-electric-teal w-6 h-6" />
               </div>
             </div>
           </div>
        </header>

        <div className="p-8 md:p-12 space-y-12">
          {activeTab === 'الرئيسية' ? (
            <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                <KPICard label="مبيعات اليوم" val="$24,842" target="$22,000" change="+12.4%" icon={<DollarSign />} themeColor="teal" data={kpiData} highlight />
                <KPICard label="الحضور النشط" val="2,842" target="3,000" change="+8.1%" icon={<Users />} themeColor="blue" data={kpiData} />
                <KPICard label="متوسط سعر التذكرة" val="$64.50" target="$60.00" change="+4.2%" icon={<Tags />} themeColor="purple" data={kpiData} />
                <KPICard label="معدل الإشغال" val="94.2%" target="90%" change="+2.4%" icon={<MonitorPlay />} themeColor="gold" data={kpiData} />
              </div>
              <DashboardPreview />
            </div>
          ) : activeTab === 'تفاعل الجمهور' ? (
            <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700 text-right">
              <div className="glass-card p-10 md:p-14 rounded-[64px] border border-white/5 relative overflow-hidden group shadow-3xl min-h-[800px]">
                <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-8 flex-row-reverse relative z-10">
                  <div className="text-right">
                    <h3 className="text-4xl font-black text-white tracking-tight">خريطة الإشغال والحرارة التفاعلية</h3>
                    <p className="text-gray-500 text-sm font-bold mt-2 uppercase tracking-[0.3em] opacity-60">Strategic Seat Heatmap & Dynamic Revenue Control</p>
                  </div>
                  <div className="flex bg-white/5 p-1.5 rounded-[22px] border border-white/10">
                    <button 
                      onClick={() => setHeatmapMode('demand')}
                      className={`px-8 py-3 rounded-[16px] text-xs font-black transition-all ${heatmapMode === 'demand' ? 'bg-electric-teal text-[#0A192F] shadow-lg' : 'text-gray-500 hover:text-white'}`}
                    >
                      كثافة الطلب
                    </button>
                    <button 
                      onClick={() => setHeatmapMode('revenue')}
                      className={`px-8 py-3 rounded-[16px] text-xs font-black transition-all ${heatmapMode === 'revenue' ? 'bg-amber-gold text-[#0A192F] shadow-lg' : 'text-gray-500 hover:text-white'}`}
                    >
                      توقع العائد
                    </button>
                  </div>
                </div>

                <div className="relative bg-[#070D17]/60 rounded-[56px] border border-white/5 p-12 md:p-24 aspect-[16/10] flex flex-col items-center justify-start overflow-hidden shadow-2xl overflow-y-auto">
                   <div className="w-3/4 h-16 bg-gradient-to-b from-slate-800/20 to-transparent rounded-b-[100px] mb-24 relative flex items-center justify-center border-t border-slate-700/40">
                      <span className="text-[12px] font-black text-slate-500 uppercase tracking-[1em]">THE STAGE / خشبة المسرح</span>
                   </div>

                   <div className="space-y-20 w-full max-w-6xl">
                      <div className="flex justify-center gap-20">
                        {theatreZones.slice(0, 2).map((zone) => (
                          <div key={zone.id} className="p-6 rounded-[32px] border border-white/5 bg-white/[0.02] flex flex-col items-center gap-4">
                            <span className="text-[10px] font-black text-amber-gold uppercase tracking-widest">{zone.name}</span>
                            <SeatGrid seats={zone.seats} cols={4} size="md" zoneName={zone.name} onSeatClick={handleSeatClick} heatmapMode={heatmapMode} />
                          </div>
                        ))}
                      </div>

                      <div className="flex flex-col items-center gap-12">
                        {theatreZones.slice(2).map((zone, idx) => (
                          <div key={zone.id} className={`rounded-[48px] border border-white/5 bg-white/[0.01] flex flex-col items-center p-10 hover:bg-white/[0.04] transition-all ${idx === 0 ? 'scale-110' : ''}`}>
                             <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6">{zone.name}</span>
                             <SeatGrid 
                               seats={zone.seats} 
                               cols={zone.id === 'o1' ? 8 : zone.id === 'o2' ? 12 : 16} 
                               size={zone.id === 'o1' ? 'lg' : 'md'} 
                               zoneName={zone.name} 
                               onSeatClick={handleSeatClick} 
                               heatmapMode={heatmapMode}
                             />
                          </div>
                        ))}
                      </div>
                   </div>

                   {/* Inspector Tooltip */}
                   {clickedSeat && (
                     <div 
                       className="fixed z-50 bg-[#0F172A]/98 backdrop-blur-3xl border border-white/10 rounded-[32px] p-8 shadow-3xl text-right min-w-[320px] animate-in zoom-in duration-200"
                       style={{ left: clickedSeat.x + 40, top: clickedSeat.y - 100 }}
                       onClick={(e) => e.stopPropagation()}
                     >
                       <div className="flex items-center justify-between mb-6 flex-row-reverse border-b border-white/5 pb-4">
                          <div className="flex items-center gap-3">
                            <div className={`p-3 rounded-xl ${clickedSeat.seat.status === 'premium' ? 'bg-amber-gold/20 text-amber-gold' : 'bg-electric-teal/20 text-electric-teal'}`}>
                              <Maximize2 className="w-5 h-5" />
                            </div>
                            <div className="text-right">
                               <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">تفاصيل المقعد</p>
                               <h4 className="text-lg font-black text-white">{clickedSeat.zoneName}</h4>
                            </div>
                          </div>
                          <button onClick={() => setClickedSeat(null)} className="p-2 hover:bg-white/5 rounded-full transition-colors"><X className="w-4 h-4" /></button>
                       </div>
                       
                       <div className="grid grid-cols-2 gap-4 mb-8">
                          <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                             <p className="text-[10px] text-gray-500 font-bold mb-1">الصف / المقعد</p>
                             <p className="text-lg font-black text-white">{clickedSeat.row} / {clickedSeat.col}</p>
                          </div>
                          <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                             <p className="text-[10px] text-gray-500 font-bold mb-1">الحالة</p>
                             <p className={`text-lg font-black ${clickedSeat.seat.occupied ? 'text-red-400' : 'text-green-400'}`}>
                               {clickedSeat.seat.occupied ? 'محجوز' : 'متاح'}
                             </p>
                          </div>
                       </div>

                       <div className="space-y-4">
                          <div className="flex justify-between items-center flex-row-reverse">
                             <span className="text-xs text-gray-400 font-bold">السعر الديناميكي الحالي</span>
                             <span className="text-xl font-black text-amber-gold font-plex">${clickedSeat.seat.status === 'premium' ? '180' : '85'}</span>
                          </div>
                          <div className="flex justify-between items-center flex-row-reverse">
                             <span className="text-xs text-gray-400 font-bold">مؤشر الطلب AI</span>
                             <div className="flex items-center gap-2">
                               <div className="w-24 h-2 bg-white/5 rounded-full overflow-hidden">
                                  <div className="h-full bg-electric-teal" style={{ width: `${clickedSeat.seat.heat * 100}%` }} />
                               </div>
                               <span className="text-xs font-black text-white">{Math.floor(clickedSeat.seat.heat * 100)}%</span>
                             </div>
                          </div>
                          <div className="pt-4 border-t border-white/5">
                             <div className="flex justify-between items-center mb-2 flex-row-reverse">
                                <span className="text-xs text-gray-400 font-bold">رفع العائد المتوقع</span>
                                <span className="text-sm font-black text-green-400">+{(clickedSeat.seat.heat * 15).toFixed(1)}%</span>
                             </div>
                             <p className="text-[9px] text-gray-600 font-bold leading-relaxed text-right">
                               بناءً على خوارزمية StageMind، يتوقع رفع السعر بمعدل 12% خلال الساعات القادمة لزيادة المردود.
                             </p>
                          </div>
                       </div>
                     </div>
                   )}
                </div>

                <div className="mt-12 flex items-center justify-center gap-12 flex-row-reverse border-t border-white/5 pt-10">
                  <div className="flex items-center gap-3"><div className="w-4 h-4 rounded-full bg-red-500" /><span className="text-xs font-black text-gray-400">ذروة</span></div>
                  <div className="flex items-center gap-3"><div className="w-4 h-4 rounded-full bg-orange-500" /><span className="text-xs font-black text-gray-400">مرتفع</span></div>
                  <div className="flex items-center gap-3"><div className="w-4 h-4 rounded-full bg-amber-400" /><span className="text-xs font-black text-gray-400">متوسط</span></div>
                  <div className="flex items-center gap-3"><div className="w-4 h-4 rounded-full bg-emerald-400" /><span className="text-xs font-black text-gray-400">مستقر</span></div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-40 text-center space-y-8 animate-in zoom-in duration-500">
               <div className="bg-white/5 p-10 rounded-[48px] border border-white/5 relative">
                  <div className="absolute inset-0 bg-electric-teal/10 blur-[60px] rounded-full animate-pulse" />
                  <Loader2 className="w-20 h-20 text-electric-teal animate-spin relative z-10" />
               </div>
               <div className="space-y-3">
                  <h3 className="text-4xl font-black text-white font-plex">قسم "{activeTab}" قيد التحميل</h3>
                  <p className="text-gray-500 text-xl font-bold max-w-lg mx-auto leading-relaxed">جاري مزامنة البيانات السحابية مع محرك StageMind AI لتقديم تقارير دقيقة بالثواني.</p>
               </div>
               <button onClick={() => setActiveTab('الرئيسية')} className="bg-white/5 border border-white/10 px-10 py-4 rounded-2xl text-gray-400 hover:text-white transition-all font-black text-sm uppercase tracking-widest">العودة للوحة التحكم</button>
            </div>
          )}
        </div>
      </main>

      <style>{`
        .shadow-3xl {
          box-shadow: 0 40px 100px -20px rgba(0, 0, 0, 0.7);
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-float {
          animation: float 5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default DashboardPage;