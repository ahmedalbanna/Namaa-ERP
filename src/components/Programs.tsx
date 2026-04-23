import React, { useEffect, useState, FormEvent } from 'react';
import { erpService } from '../services/erpService';
import { 
  Briefcase, 
  Calendar, 
  Activity,
  Plus,
  CheckCircle2,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Programs() {
  const [programs, setPrograms] = useState<any[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newProgram, setNewProgram] = useState({
    name: '',
    description: '',
    budget: 0,
    currency: 'USD',
    status: 'Planned'
  });

  useEffect(() => {
    return erpService.subscribeToPrograms(setPrograms);
  }, []);

  const handleAdd = async (e: FormEvent) => {
    e.preventDefault();
    await erpService.addProgram(newProgram);
    setIsAdding(false);
    setNewProgram({ name: '', description: '', budget: 0, currency: 'USD', status: 'Planned' });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">البرامج الإغاثية</h2>
          <p className="text-sm text-slate-500 mt-1">تتبع الخطط التشغيلية والالتزامات المالية</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          <span>إنشاء برنامج</span>
        </button>
      </header>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h3 className="font-bold text-slate-700 text-sm">حالة الميزانيات التشغيلية</h3>
          <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-1 rounded font-bold uppercase tracking-widest">تحديث مباشر</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-right text-sm">
            <thead>
              <tr className="text-slate-400 border-b border-slate-100">
                <th className="p-4 table-header">اسم البرنامج</th>
                <th className="p-4 text-center table-header">الحالة</th>
                <th className="p-4 text-center table-header">استهلاك الميزانية</th>
                <th className="p-4 text-left table-header">المصروف / المخطط</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {programs.map((program) => (
                <tr key={program.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="p-4 font-semibold text-slate-700">{program.name}</td>
                  <td className="p-4 text-center">
                    <span className={`text-[10px] px-2 py-1 rounded font-bold uppercase ${
                      program.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 
                      program.status === 'Completed' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {program.status}
                    </span>
                  </td>
                  <td className="p-4 w-64">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min(100, (program.spent / program.budget) * 100)}%` }}
                          className={`h-full ${
                            (program.spent / program.budget) > 0.9 ? 'bg-red-500' : 
                            (program.spent / program.budget) > 0.7 ? 'bg-amber-400' : 'bg-emerald-500'
                          }`}
                        />
                      </div>
                      <span className="text-[10px] font-bold text-slate-400 font-mono">{((program.spent / program.budget) * 100).toFixed(0)}%</span>
                    </div>
                  </td>
                  <td className="p-4 text-left font-mono text-[11px] font-bold text-slate-600">
                    {program.currency} {(program.spent || 0).toLocaleString()} / {(program.budget || 0).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
              <h3 className="text-lg font-bold text-slate-800">إنشاء برنامج إغاثي</h3>
              <button 
                onClick={() => setIsAdding(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAdd} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">اسم البرنامج</label>
                <input 
                  required
                  type="text" 
                  className="input w-full bg-white" 
                  value={newProgram.name}
                  onChange={(e) => setNewProgram({...newProgram, name: e.target.value})}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">وصف التدخل</label>
                <textarea 
                  className="input w-full bg-white min-h-[100px]" 
                  value={newProgram.description}
                  onChange={(e) => setNewProgram({...newProgram, description: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">الميزانية التقديرية</label>
                  <input 
                    required
                    type="number" 
                    className="input w-full bg-white" 
                    value={newProgram.budget}
                    onChange={(e) => setNewProgram({...newProgram, budget: Number(e.target.value)})}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">الحالة</label>
                  <select 
                    className="input w-full bg-white"
                    value={newProgram.status}
                    onChange={(e) => setNewProgram({...newProgram, status: e.target.value})}
                  >
                    <option value="Planned">مخطط له</option>
                    <option value="Active">نشط</option>
                    <option value="Completed">مكتمل</option>
                  </select>
                </div>
              </div>
              <div className="pt-4">
                <button type="submit" className="btn-primary w-full py-3.5 font-bold shadow-lg shadow-emerald-600/10">حفظ البرنامج</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
