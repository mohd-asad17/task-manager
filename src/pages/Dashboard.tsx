import React, { useEffect, useState } from 'react';
import api from '../api/api.ts';
import { 
  Briefcase, 
  CheckSquare, 
  Clock, 
  AlertCircle, 
  TrendingUp,
  Activity
} from 'lucide-react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend 
} from 'recharts';
import { motion } from 'motion/react';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get('/api/dashboard/stats');
        setStats(data.data);
      } catch (err) {
        console.error('Error fetching stats', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div>Loading dashboard...</div>;
  if (!stats) return <div>Failed to load stats</div>;

  const statusData = stats.statusDistribution.map((item: any) => ({
    name: item._id.toUpperCase(),
    value: item.count
  }));

  const COLORS = ['#6366f1', '#f59e0b', '#10b981', '#3b82f6'];

  const statCards = [
    { label: 'Total Projects', value: stats.stats.totalProjects, icon: Briefcase, color: 'text-white', glow: 'shadow-white/5' },
    { label: 'Total Tasks', value: stats.stats.totalTasks, icon: CheckSquare, color: 'text-indigo-400', glow: 'shadow-indigo-500/20' },
    { label: 'Completed', value: stats.stats.completedTasks, icon: TrendingUp, color: 'text-emerald-400', glow: 'shadow-emerald-500/20' },
    { label: 'Pending', value: stats.stats.pendingTasks, icon: Clock, color: 'text-amber-400', glow: 'shadow-amber-500/20' },
    { label: 'Overdue', value: stats.stats.overdueTasks, icon: AlertCircle, color: 'text-rose-400', glow: 'shadow-rose-500/20' },
  ];

  return (
    <div className="space-y-16">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-7xl font-black tracking-tight uppercase leading-none italic gradient-text">Overview</h2>
          <p className="text-zinc-500 font-bold mt-4 uppercase tracking-[0.3em] text-[10px] flex items-center gap-2">
            <span className="w-8 h-[1px] bg-indigo-500/50" /> Virtual Core Cluster — Alpha-1
          </p>
        </div>
      </header>

      {/* Stat Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {statCards.map((card, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1, duration: 0.5, ease: "easeOut" }}
            className={`sleek-card group`}
          >
            <div className="flex flex-col h-full justify-between gap-4">
              <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 group-hover:text-zinc-300 transition-colors">{card.label}</p>
              <h3 className={`text-6xl font-black leading-none ${card.color} tracking-tighter`}>{card.value}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Charts */}
        <div className="sleek-card flex flex-col">
          <div className="flex justify-between items-center mb-12">
            <h4 className="font-bold uppercase tracking-widest text-[10px] flex items-center gap-3 text-zinc-400">
              <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400"><Activity size={14} /></span> 
              Allocation Matrix
            </h4>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={100}
                  paddingAngle={8}
                  dataKey="value"
                  stroke="none"
                >
                  {statusData.map((_entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#09090b', 
                    border: '1px solid rgba(255,255,255,0.1)', 
                    borderRadius: '16px', 
                    color: '#fff',
                    fontWeight: '700',
                    textTransform: 'uppercase',
                    fontSize: '10px'
                  }}
                  itemStyle={{ color: '#fff' }}
                />
                <Legend 
                  iconType="circle" 
                  formatter={(value) => <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-2">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="sleek-card flex flex-col !p-0 overflow-hidden">
          <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/2">
            <h4 className="font-bold uppercase tracking-widest text-[10px] text-zinc-400">Event Stream</h4>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span className="text-[10px] font-bold text-emerald-500 tracking-widest">LIVE</span>
            </div>
          </div>
          <div className="flex-1 overflow-x-auto">
             <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-zinc-500">Operation</th>
                  <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-zinc-500">Status</th>
                  <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-zinc-500 text-right">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {stats.recentActivity.map((task: any, idx: number) => (
                  <tr key={idx} className="hover:bg-white/2 transition-colors cursor-pointer group">
                    <td className="px-8 py-6">
                       <p className="text-sm font-bold text-zinc-100 group-hover:text-indigo-400 transition-colors uppercase tracking-tight">{task.title}</p>
                       <p className="text-[10px] text-zinc-500 font-medium uppercase tracking-wider mt-1">{task.projectId?.title}</p>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`badge ${
                        task.status === 'completed' 
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}>
                        {task.status}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right font-mono text-[10px] font-medium text-zinc-500 tracking-wider">
                      {new Date(task.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {stats.recentActivity.length === 0 && (
              <p className="text-center text-gray-400 py-10 font-bold uppercase tracking-widest text-xs">Queue Empty</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
