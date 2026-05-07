import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Briefcase, 
  CheckSquare, 
  Users, 
  User, 
  LogOut, 
  Menu, 
  X,
  Plus
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';
import { motion, AnimatePresence } from 'motion/react';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Projects', path: '/projects', icon: Briefcase },
    { name: 'Tasks', path: '/tasks', icon: CheckSquare },
  ];

  if (user?.role === 'admin') {
    // Optionally add admin specific links here
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-zinc-950 text-zinc-100 font-sans">
      {/* Sidebar */}
      <aside 
        className={`${
          isSidebarOpen ? 'w-72' : 'w-24'
        } transition-all duration-500 ease-in-out bg-zinc-950 border-r border-white/5 flex flex-col z-20`}
      >
        <div className="p-10 flex items-center gap-4">
          <div className="bg-indigo-600 p-2.5 rounded-2xl shadow-lg shadow-indigo-600/20">
            <CheckSquare className="text-white w-6 h-6" />
          </div>
          {isSidebarOpen && (
            <div className="overflow-hidden whitespace-nowrap">
              <h1 className="text-xl font-bold tracking-tight text-white uppercase italic leading-none">TeamSync</h1>
              <p className="text-[10px] text-zinc-500 font-bold mt-1 tracking-widest uppercase">Enterprise</p>
            </div>
          )}
        </div>

        <nav className="flex-1 px-6 py-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 font-bold text-xs uppercase tracking-widest ${
                location.pathname === item.path
                  ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20'
                  : 'text-zinc-500 hover:text-white hover:bg-white/5'
              }`}
            >
              <item.icon className={`w-5 h-5 ${location.pathname === item.path ? 'text-indigo-400' : 'text-zinc-600'}`} />
              {isSidebarOpen && <span>{item.name}</span>}
            </Link>
          ))}
        </nav>

        <div className="p-8 mt-auto border-t border-white/5 space-y-6">
          {isSidebarOpen ? (
            <div className="flex items-center gap-4 p-4 rounded-3xl bg-white/5 border border-white/5">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center font-bold text-sm uppercase text-white shadow-lg shadow-indigo-500/20">
                {user?.name.charAt(0)}
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-white truncate uppercase tracking-tight">{user?.name}</p>
                <p className="text-[10px] text-zinc-500 font-medium uppercase tracking-wider">{user?.role} NODE</p>
              </div>
            </div>
          ) : null}
          <button 
            onClick={handleLogout}
            className={`flex items-center gap-4 w-full px-4 py-3.5 text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-2xl transition-all duration-300 font-bold text-xs uppercase tracking-widest cursor-pointer`}
          >
            <LogOut className="w-5 h-5" />
            {isSidebarOpen && <span>Shut Down</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        <header className="h-24 glass-panel flex items-center justify-between px-12 z-10 sticky top-0">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-white transition-all cursor-pointer"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <div className="flex items-center gap-6">
            <div className="px-4 py-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-500">Live Infrastructure</span>
            </div>
            <div className="h-6 w-[1px] bg-white/10" />
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-white uppercase tracking-tight">{user?.name}</p>
              <p className="text-[10px] text-zinc-500 font-medium uppercase">{user?.role}</p>
            </div>
          </div>
        </header>

        <div className="grow overflow-y-auto p-12 scrollbar-hide bg-[#050505]">

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Layout;
