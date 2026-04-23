import React, { useEffect, useState, FormEvent } from 'react';
import { erpService } from '../services/erpService';
import { 
  Plus, 
  Search, 
  User2, 
  Building2, 
  Mail, 
  Phone, 
  MapPin,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Donors() {
  const [donors, setDonors] = useState<any[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [newDonor, setNewDonor] = useState({
    name: '',
    type: 'Individual',
    email: '',
    phone: '',
    country: 'Yemen'
  });

  useEffect(() => {
    return erpService.subscribeToDonors(setDonors);
  }, []);

  const handleAdd = async (e: FormEvent) => {
    e.preventDefault();
    await erpService.addDonor(newDonor);
    setIsAdding(false);
    setNewDonor({ name: '', type: 'Individual', email: '', phone: '', country: 'Yemen' });
  };

  const filteredDonors = donors.filter(d => 
    d.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">إدارة المانحين</h2>
          <p className="text-sm text-slate-500 mt-1">قاعدة بيانات الشركاء والداعمين للعمليات الإنسانية</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          <span>إضافة مانح جديد</span>
        </button>
      </header>

      <div className="relative">
        <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
        <input 
          type="text" 
          placeholder="بحث في سجل المانحين..." 
          className="input w-full pr-12 h-12 text-sm bg-white"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredDonors.map((donor) => (
            <motion.div 
              key={donor.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-lg ${donor.type === 'Organization' ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'}`}>
                    {donor.type === 'Organization' ? <Building2 className="w-5 h-5" /> : <User2 className="w-5 h-5" />}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 leading-none">{donor.name}</h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase mt-1 tracking-wider">{donor.type === 'Organization' ? 'منظمة دولية' : 'متبرع فرد'}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2.5 mt-6 pt-6 border-t border-slate-50">
                <div className="flex items-center gap-3 text-xs text-slate-600">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span className="truncate">{donor.email || 'غير متوفر'}</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-600">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{donor.phone || 'غير متوفر'}</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-600">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{donor.country}</span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-50 flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-300 uppercase tracking-tighter">السجل منذ {new Date(donor.createdAt).getFullYear()}</span>
                <button className="text-[10px] font-bold text-emerald-600 uppercase hover:underline">عرض الملف الكامل</button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
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
              <h3 className="text-lg font-bold text-slate-800">إضافة مانح جديد</h3>
              <button 
                onClick={() => setIsAdding(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAdd} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">اسم المانح</label>
                <input 
                  required
                  type="text" 
                  className="input w-full bg-white" 
                  value={newDonor.name}
                  onChange={(e) => setNewDonor({...newDonor, name: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">النوع</label>
                  <select 
                    className="input w-full bg-white"
                    value={newDonor.type}
                    onChange={(e) => setNewDonor({...newDonor, type: e.target.value})}
                  >
                    <option value="Individual">فرد</option>
                    <option value="Organization">منظمة</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">الدولة</label>
                  <input 
                    type="text" 
                    className="input w-full bg-white" 
                    value={newDonor.country}
                    onChange={(e) => setNewDonor({...newDonor, country: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">البريد الإلكتروني</label>
                <input 
                  type="email" 
                  className="input w-full bg-white" 
                  value={newDonor.email}
                  onChange={(e) => setNewDonor({...newDonor, email: e.target.value})}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">رقم الهاتف</label>
                <input 
                  type="text" 
                  className="input w-full bg-white" 
                  value={newDonor.phone}
                  onChange={(e) => setNewDonor({...newDonor, phone: e.target.value})}
                />
              </div>
              <div className="pt-4">
                <button type="submit" className="btn-primary w-full py-3.5 font-bold shadow-lg shadow-emerald-600/10">حفظ المانح</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
