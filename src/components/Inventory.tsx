import React, { useEffect, useState, FormEvent } from 'react';
import { erpService } from '../services/erpService';
import { 
  Plus, 
  Package, 
  AlertTriangle,
  Layers,
  History,
  CheckCircle2,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Inventory() {
  const [items, setItems] = useState<any[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newItem, setNewItem] = useState({
    name: '',
    category: 'Food',
    stockLevel: 0,
    unit: 'Box'
  });

  useEffect(() => {
    return erpService.subscribeToInventory(setItems);
  }, []);

  const handleAdd = async (e: FormEvent) => {
    e.preventDefault();
    await erpService.addItem(newItem);
    setIsAdding(false);
    setNewItem({ name: '', category: 'Food', stockLevel: 0, unit: 'Box' });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">إدارة المخزون الإغاثي</h2>
          <p className="text-sm text-slate-500 mt-1">تتبع مستويات المواد الأساسية وسلاسل الإمداد</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          <span>إضافة مواد</span>
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="font-bold text-slate-700 text-sm">قائمة الجرد الميداني</h3>
              <div className="flex gap-2">
                <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded font-bold uppercase">الإجمالي: {items.length}</span>
                <span className="text-[10px] bg-red-50 text-red-600 px-2 py-0.5 rounded font-bold uppercase border border-red-100">تنبيه منخفض: {items.filter(i => i.stockLevel < 50).length}</span>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-right text-sm">
                <thead>
                  <tr className="text-slate-400 border-b border-slate-100">
                    <th className="p-4 table-header">المادة / الصنف</th>
                    <th className="p-4 text-center table-header">التصنيف</th>
                    <th className="p-4 text-center table-header">الرصيد الحالي</th>
                    <th className="p-4 text-center table-header">الوحدة</th>
                    <th className="p-4 text-left table-header">الحالة التشغيلية</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {items.map((item) => (
                    <tr key={item.id} className="group hover:bg-slate-50 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-slate-50 rounded-lg group-hover:bg-white border border-slate-100 group-hover:border-slate-200 transition-all">
                            <Package className="w-4 h-4 text-slate-400" />
                          </div>
                          <span className="font-semibold text-slate-700">{item.name}</span>
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <span className="text-[10px] font-bold text-slate-500 uppercase px-2 py-1 bg-slate-100 rounded">{item.category}</span>
                      </td>
                      <td className="p-4 text-center font-mono font-bold text-slate-700">{item.stockLevel.toLocaleString()}</td>
                      <td className="p-4 text-center text-slate-400 text-xs font-bold uppercase tracking-tighter">{item.unit}</td>
                      <td className="p-4 text-left">
                        {item.stockLevel < 50 ? (
                          <div className="flex items-center gap-2 text-red-600 text-[10px] font-bold justify-end uppercase tracking-tighter">
                            <AlertTriangle className="w-3 h-3" />
                            <span>تجهيز طلب جديد</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 text-emerald-600 text-[10px] font-bold justify-end uppercase tracking-tighter">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>مستوى آمن</span>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <Layers className="w-5 h-5 text-blue-600" />
              <h3 className="font-bold text-slate-800 text-sm">مراقبة الجودة والتوفر</h3>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed mb-6">
              يتم تحديث البيانات لحظياً عبر نظام Firestore لضمان دقة الرصيد المخزني لفرق التوزيع الميداني.
            </p>
            <button className="w-full bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-transform active:scale-[0.98]">
              <History className="w-4 h-4" />
              <span>عرض سجل التوريد</span>
            </button>
          </div>

          <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-5 shadow-sm">
            <h4 className="text-[10px] font-extrabold text-emerald-700 uppercase tracking-widest mb-4">ملخص الأصول العينية</h4>
            <div className="space-y-4">
              <div className="flex justify-between items-center bg-white/40 p-2 rounded border border-white/60">
                <span className="text-[11px] font-bold text-emerald-800">إجمالي الوحدات المسجلة</span>
                <span className="font-mono font-bold text-emerald-900">{items.reduce((acc, i) => acc + i.stockLevel, 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center bg-white/40 p-2 rounded border border-white/60">
                <span className="text-[11px] font-bold text-emerald-800">النمو المخزني (أسبوعي)</span>
                <span className="font-mono font-bold text-emerald-900 text-xs">+4.2%</span>
              </div>
            </div>
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
              <h3 className="text-lg font-bold text-slate-800">إضافة مادة إغاثية</h3>
              <button 
                onClick={() => setIsAdding(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAdd} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">اسم المادة</label>
                <input 
                  required
                  type="text" 
                  className="input w-full bg-white" 
                  value={newItem.name}
                  onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">التصنيف</label>
                  <select 
                    className="input w-full bg-white"
                    value={newItem.category}
                    onChange={(e) => setNewItem({...newItem, category: e.target.value})}
                  >
                    <option value="Food">سلة غذائية</option>
                    <option value="Medical">لوازم طبية</option>
                    <option value="Shelter">مواد إيواء</option>
                    <option value="Water">مياه وإصحاح</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">الوحدة</label>
                  <input 
                    type="text" 
                    className="input w-full bg-white" 
                    value={newItem.unit}
                    onChange={(e) => setNewItem({...newItem, unit: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">الكمية الافتتاحية</label>
                <input 
                  required
                  type="number" 
                  className="input w-full bg-white" 
                  value={newItem.stockLevel}
                  onChange={(e) => setNewItem({...newItem, stockLevel: Number(e.target.value)})}
                />
              </div>
              <div className="pt-4">
                <button type="submit" className="btn-primary w-full py-3.5 font-bold shadow-lg shadow-emerald-600/10">تسجيل المادة</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
