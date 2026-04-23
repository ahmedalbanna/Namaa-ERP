import { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { 
  LayoutDashboard, 
  Users, 
  Briefcase, 
  Package, 
  Truck, 
  LogOut, 
  Plus,
  ArrowUpRight,
  TrendingUp,
  Heart
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Sub-components
import Dashboard from './components/Dashboard';
import Donors from './components/Donors';
import Programs from './components/Programs';
import Inventory from './components/Inventory';
import Distributions from './components/Distributions';

type Tab = 'dashboard' | 'donors' | 'programs' | 'inventory' | 'distributions';

function Navigation({ activeTab, setActiveTab }: { activeTab: Tab, setActiveTab: (t: Tab) => void }) {
  const { user, isAdmin, logout } = useAuth();

  const navItems = [
    { id: 'dashboard' as Tab, label: 'لوحة التحكم', icon: LayoutDashboard },
    { id: 'donors' as Tab, label: 'المانحون', icon: Users },
    { id: 'programs' as Tab, label: 'البرامج الإغاثية', icon: Briefcase },
    { id: 'inventory' as Tab, label: 'المخزون', icon: Package },
    { id: 'distributions' as Tab, label: 'التوزيع', icon: Truck },
  ];

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0 shadow-sm z-50">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center">
          <Heart className="text-white w-6 h-6" />
        </div>
        <span className="text-xl font-bold text-slate-900 font-display">نماء اليمن</span>
      </div>
      
      <nav className="flex gap-8 text-sm font-medium text-slate-600 h-full">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex items-center gap-2 px-1 transition-all h-full relative ${
              activeTab === item.id 
                ? 'text-emerald-600' 
                : 'hover:text-emerald-600'
            }`}
          >
            <item.icon className="w-4 h-4" />
            <span className="rtl">{item.label}</span>
            {activeTab === item.id && (
              <motion.div 
                layoutId="nav-underline"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600"
              />
            )}
          </button>
        ))}
      </nav>

      <div className="flex items-center gap-4">
        <div className="text-left">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{isAdmin ? 'ADMIN AUTHENTICATED' : 'STAFF ACCESS'}</p>
          <p className="text-sm font-bold text-slate-700">{user?.displayName}</p>
        </div>
        <button 
          onClick={logout}
          className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors"
          title="تسجيل الخروج"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}

function MainApp() {
  const { user, login, loading } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-white border border-slate-200 p-8 rounded-2xl text-center shadow-xl"
        >
          <div className="w-20 h-20 bg-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-600/20">
            <Heart className="text-white w-10 h-10" />
          </div>
          <h1 className="text-3xl font-bold mb-4 text-slate-900">نماء للإغاثة</h1>
          <p className="text-slate-500 mb-8 leading-relaxed">
            نظام متطور لإدارة التبرعات والعمليات الإغاثية في اليمن. يرجى تسجيل الدخول للوصول إلى لوحة التحكم.
          </p>
          <button 
            onClick={login}
            className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-3 hover:bg-slate-800 transition-colors shadow-lg"
          >
            <ArrowUpRight className="w-5 h-5 text-emerald-400" />
            <span>تسجيل الدخول عبر Google</span>
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-slate-50 text-slate-800 overflow-hidden" dir="rtl">
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 overflow-y-auto p-8 relative flex flex-col min-h-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.15 }}
            className="max-w-7xl mx-auto w-full flex-1 flex flex-col"
          >
            {activeTab === 'dashboard' && <Dashboard />}
            {activeTab === 'donors' && <Donors />}
            {activeTab === 'programs' && <Programs />}
            {activeTab === 'inventory' && <Inventory />}
            {activeTab === 'distributions' && <Distributions />}
          </motion.div>
        </AnimatePresence>
      </main>

      <footer className="h-12 bg-slate-100 border-t border-slate-200 px-8 flex items-center justify-between text-[11px] font-bold text-slate-500 shrink-0">
        <div className="flex gap-6">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>نظام نماء متصل: Firestore US-West-1 Active</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-slate-300"></span>
            <span>إصدار النظام v1.0.4 - YemenAid ERP</span>
          </div>
        </div>
        <div className="flex gap-4">
          <span className="text-slate-400 tracking-tighter">NGO-ID: YEM-ERP-77810-FBASE</span>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
