import React, { useEffect, useState, FormEvent } from 'react';
import { erpService } from '../services/erpService';
import { 
  Plus, 
  Truck, 
  MapPin, 
  Calendar,
  ClipboardList,
  ArrowDownLeft,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Distributions() {
  const [distributions, setDistributions] = useState<any[]>([]);
  const [programs, setPrograms] = useState<any[]>([]);
  const [items, setItems] = useState<any[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newDistribution, setNewDistribution] = useState({
    programId: '',
    itemId: '',
    quantity: 0,
    beneficiaryName: '',
    location: '',
    date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    const unsubDist = erpService.subscribeToDistributions(setDistributions);
    const unsubProg = erpService.subscribeToPrograms(setPrograms);
    const unsubInv = erpService.subscribeToInventory(setItems);

    return () => {
      unsubDist();
      unsubProg();
      unsubInv();
    };
  }, []);

  const handleAdd = async (e: FormEvent) => {
    e.preventDefault();
    await erpService.recordDistribution(newDistribution);
    setIsAdding(false);
    setNewDistribution({
      programId: '',
      itemId: '',
      quantity: 0,
      beneficiaryName: '',
      location: '',
      date: new Date().toISOString().split('T')[0]
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">توزيع المساعدات</h2>
          <p className="text-sm text-slate-500 mt-1">توثيق تسليم المواد الإغاثية للمستفيدين النهائيين</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="btn-primary flex items-center gap-2 shadow-lg shadow-emerald-600/20"
        >
          <Plus className="w-5 h-5" />
          <span>تسجيل عملية توزيع</span>
        </button>
      </header>

      <div className="space-y-4">
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center gap-3 bg-slate-50/50">
            <ClipboardList className="w-5 h-5 text-emerald-600" />
            <h3 className="text-sm font-bold text-slate-700">سجل عمليات التوزيع الميداني الأخير</h3>
          </div>

          <div className="divide-y divide-slate-50">
            <AnimatePresence>
              {distributions.map((log) => {
                const program = programs.find(p => p.id === log.programId);
                const item = items.find(i => i.id === log.itemId);
                return (
                  <motion.div 
                    key={log.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col md:flex-row md:items-center justify-between p-5 hover:bg-slate-50 transition-colors gap-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-lg border border-emerald-100">
                        <ArrowDownLeft className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-800">{log.beneficiaryName}</span>
                          <span className="text-[9px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded font-bold uppercase tracking-wider">مستفيد نهائي</span>
                        </div>
                        <div className="flex items-center gap-4 mt-1.5">
                          <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium">
                            <MapPin className="w-3 h-3" />
                            <span>{log.location}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium">
                            <Calendar className="w-3 h-3" />
                            <span>{new Date(log.date).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-8 md:text-left">
                      <div className="hidden sm:block">
                        <p className="text-[9px] text-slate-400 uppercase font-extrabold tracking-widest mb-1 shadow-sm px-1.5 py-0.5 rounded bg-slate-50 border border-slate-100 inline-block">البرنامج التشغيلي</p>
                        <p className="text-[11px] font-bold text-slate-700 mt-1">{program?.name || '---'}</p>
                      </div>
                      <div className="md:min-w-[140px]">
                        <p className="text-[9px] text-slate-400 uppercase font-extrabold tracking-widest mb-1">المادة الموزعة</p>
                        <p className="text-sm font-mono font-bold text-emerald-700">{log.quantity} {item?.unit} / {item?.name}</p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {distributions.length === 0 && (
              <div className="py-20 text-center text-slate-400 space-y-4">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto border border-dashed border-slate-200">
                  <Truck className="w-8 h-8 opacity-20" />
                </div>
                <p className="text-xs font-bold uppercase tracking-widest">لا يوجد سجلات توزيع حالية</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Modal */}
      {isAdding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-lg bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="text-lg font-bold text-slate-800">تسجيل عملية توزيع</h3>
              <button 
                onClick={() => setIsAdding(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAdd} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">اسم المستفيد</label>
                <input 
                  required
                  type="text" 
                  className="input w-full bg-white" 
                  value={newDistribution.beneficiaryName}
                  onChange={(e) => setNewDistribution({...newDistribution, beneficiaryName: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">الموقع / المديرية</label>
                  <input 
                    required
                    type="text" 
                    className="input w-full bg-white" 
                    value={newDistribution.location}
                    onChange={(e) => setNewDistribution({...newDistribution, location: e.target.value})}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">التاريخ</label>
                  <input 
                    required
                    type="date" 
                    className="input w-full bg-white" 
                    value={newDistribution.date}
                    onChange={(e) => setNewDistribution({...newDistribution, date: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">البرنامج المرتبط</label>
                <select 
                  required
                  className="input w-full bg-white"
                  value={newDistribution.programId}
                  onChange={(e) => setNewDistribution({...newDistribution, programId: e.target.value})}
                >
                  <option value="">اختر البرنامج</option>
                  {programs.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">المادة الإغاثية</label>
                  <select 
                    required
                    className="input w-full bg-white"
                    value={newDistribution.itemId}
                    onChange={(e) => setNewDistribution({...newDistribution, itemId: e.target.value})}
                  >
                    <option value="">اختر المادة</option>
                    {items.map(i => (
                      <option key={i.id} value={i.id}>{i.name} ({i.stockLevel} {i.unit})</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">الكمية الموزعة</label>
                  <input 
                    required
                    type="number" 
                    className="input w-full bg-white" 
                    value={newDistribution.quantity}
                    onChange={(e) => setNewDistribution({...newDistribution, quantity: Number(e.target.value)})}
                  />
                </div>
              </div>
              <div className="pt-4">
                <button type="submit" className="btn-primary w-full py-3.5 font-bold shadow-lg shadow-emerald-600/10">تأكيد التوزيع</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
