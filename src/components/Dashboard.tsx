import { useEffect, useState } from 'react';
import { erpService } from '../services/erpService';
import { 
  TrendingUp, 
  Package, 
  ArrowRight
} from 'lucide-react';
import { motion } from 'motion/react';

function StatCard({ title, value, color, trend }: any) {
  return (
    <motion.div 
      whileHover={{ y: -2 }}
      className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm transition-all"
    >
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">{title}</p>
      <p className={`text-2xl font-bold tracking-tight font-mono ${color === 'emerald' ? 'text-emerald-700' : 'text-slate-900'}`}>
        {value}
      </p>
      {trend && (
        <p className={`text-[10px] mt-2 font-bold ${trend.startsWith('+') ? 'text-emerald-600' : 'text-amber-600'}`}>
          {trend.startsWith('+') ? '↑' : '↓'} {trend} منذ الفترة الماضية
        </p>
      )}
    </motion.div>
  );
}

export default function Dashboard() {
  const [donors, setDonors] = useState<any[]>([]);
  const [programs, setPrograms] = useState<any[]>([]);
  const [inventory, setInventory] = useState<any[]>([]);

  useEffect(() => {
    const unsubDonors = erpService.subscribeToDonors(setDonors);
    const unsubPrograms = erpService.subscribeToPrograms(setPrograms);
    const unsubInventory = erpService.subscribeToInventory(setInventory);

    return () => {
      unsubDonors();
      unsubPrograms();
      unsubInventory();
    };
  }, []);

  const totalBudget = programs.reduce((acc, p) => acc + (p.budget || 0), 0);
  const totalSpent = programs.reduce((acc, p) => acc + (p.spent || 0), 0);
  const lowStockItems = inventory.filter(item => item.stockLevel < 50);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">نظرة عامة على الإغاثة</h2>
          <p className="text-sm text-slate-500 mt-1">تتبع التدفقات المالية والمواد الإنسانية لحظة بلحظة</p>
        </div>
        <div className="flex gap-2">
           <span className="text-[10px] bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full border border-emerald-100 font-bold uppercase">مركز العمليات نشط</span>
        </div>
      </header>

      {/* KPI Ribbons */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="إجمالي التمويل النشط" 
          value={`$${totalBudget.toLocaleString()}`} 
          color="emerald" 
          trend="+12.5%"
        />
        <StatCard 
          title="إجمالي المانحين" 
          value={donors.length.toString()} 
          color="slate" 
        />
        <StatCard 
          title="البرامج المنفذة" 
          value={programs.length.toString()} 
          color="slate" 
        />
        <StatCard 
          title="كفاءة التوزيع" 
          value="94.2%" 
          color="slate" 
          trend="+2.1%"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-0">
        {/* Project Budget Tracking */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <h3 className="font-bold text-slate-700 text-sm">استهلاك ميزانية البرامج</h3>
            <span className="text-[10px] bg-slate-200 px-2 py-1 rounded font-bold text-slate-500 uppercase tracking-widest">السنة المالية 2024</span>
          </div>
          <div className="p-4 overflow-x-auto">
            <table className="w-full text-right text-sm">
              <thead>
                <tr className="text-slate-400 border-b border-slate-100">
                  <th className="pb-3 pr-2 table-header">اسم البرنامج</th>
                  <th className="pb-3 text-center table-header">الحالة</th>
                  <th className="pb-3 text-center table-header">استهلاك الميزانية</th>
                  <th className="pb-3 pl-2 text-left table-header">المصروف / الإجمالي</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {programs.slice(0, 8).map((program) => (
                  <tr key={program.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-4 pr-2 font-semibold text-slate-700">{program.name}</td>
                    <td className="py-4 text-center">
                       <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                         program.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 
                         program.status === 'Completed' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-500'
                       }`}>
                         {program.status}
                       </span>
                    </td>
                    <td className="py-4 w-48 px-4">
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min(100, (program.spent / program.budget) * 100)}%` }}
                          className={`h-full transition-all duration-1000 ${
                            (program.spent / program.budget) > 0.9 ? 'bg-red-500' : 
                            (program.spent / program.budget) > 0.7 ? 'bg-amber-400' : 'bg-emerald-500'
                          }`}
                        />
                      </div>
                    </td>
                    <td className="py-4 pl-2 text-left font-mono text-xs font-bold text-slate-600">
                      ${(program.spent || 0).toLocaleString()} / ${(program.budget || 0).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-6">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex flex-col h-full">
            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">المخزون الحرج</h3>
            <div className="space-y-4 flex-1">
              {lowStockItems.length > 0 ? (
                lowStockItems.map(item => (
                  <div key={item.id} className="flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-red-50 flex items-center justify-center text-red-600 group-hover:bg-red-100 transition-colors">
                        <Package className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-medium text-slate-700">{item.name}</span>
                    </div>
                    <span className="text-[11px] font-mono font-bold text-red-600 underline decoration-red-200 uppercase">
                      منخفض: {item.stockLevel} {item.unit}
                    </span>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center h-full py-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
                   <Package className="w-8 h-8 text-slate-300 mb-2" />
                   <p className="text-xs text-slate-400 font-medium">لا يوجد مشكلات بالمخزون حالياً</p>
                </div>
              )}
            </div>
            <button className="mt-6 w-full py-2.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-[11px] font-bold text-slate-600 uppercase transition-all">
              تحديث سجل المخزون
            </button>
          </div>

          <div className="bg-slate-900 rounded-xl p-5 text-white flex flex-col gap-4 shadow-lg shadow-slate-900/20">
            <div className="flex items-center justify-between">
               <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">اختصارات إدارية</h3>
               <TrendingUp className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="space-y-2">
              <button className="w-full flex items-center justify-between bg-white/5 hover:bg-white/10 p-3 rounded-lg transition-colors group">
                <span className="text-xs font-bold">إنشاء تقرير المانحين</span>
                <ArrowRight className="w-4 h-4 text-emerald-500 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="w-full flex items-center justify-between bg-white/5 hover:bg-white/10 p-3 rounded-lg transition-colors group">
                <span className="text-xs font-bold">تدقيق الميزانية الإقليمية</span>
                <ArrowRight className="w-4 h-4 text-blue-500 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
            <p className="text-[9px] text-zinc-500 text-center uppercase tracking-tighter mt-2">YEM-ERP-77810-SYNC</p>
          </div>
        </div>
      </div>
    </div>
  );
}
