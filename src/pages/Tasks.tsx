import React, { useEffect, useState } from 'react';
import api from '../api/api.ts';
import { useAuth } from '../context/AuthContext.tsx';
import { 
  CheckSquare, 
  Plus, 
  Trash2, 
  Filter, 
  ChevronDown, 
  Clock, 
  AlertCircle,
  MoreVertical,
  CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const Tasks: React.FC = () => {
  const [tasks, setTasks] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  // Filters
  const [filterProjectId, setFilterProjectId] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterPriority, setFilterPriority] = useState('');

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [projectId, setProjectId] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState('');

  const fetchTasks = async () => {
    try {
      const params: any = {};
      if (filterProjectId) params.projectId = filterProjectId;
      if (filterStatus) params.status = filterStatus;
      if (filterPriority) params.priority = filterPriority;

      const { data } = await api.get('/api/tasks', { params });
      setTasks(data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchDropdowns = async () => {
    try {
      const [{ data: projData }, { data: userData }] = await Promise.all([
        api.get('/api/projects'),
        api.get('/api/dashboard/users')
      ]);
      setProjects(projData.data);
      setUsers(userData.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [filterProjectId, filterStatus, filterPriority]);

  useEffect(() => {
    fetchDropdowns();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/api/tasks', {
        title,
        description,
        projectId,
        assignedTo,
        priority,
        dueDate
      });
      fetchTasks();
      setShowModal(false);
      resetForm();
    } catch (err) {
      console.error(err);
    }
  };

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    try {
      await api.put(`/api/tasks/${id}`, { status: newStatus });
      setTasks(tasks.map(t => t._id === id ? { ...t, status: newStatus } : t));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await api.delete(`/api/tasks/${id}`);
        fetchTasks();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setProjectId('');
    setAssignedTo('');
    setPriority('medium');
    setDueDate('');
  };

  const getPriorityColor = (p: string) => {
    switch(p) {
      case 'high': return 'bg-rose-100 text-rose-600';
      case 'medium': return 'bg-amber-100 text-amber-600';
      case 'low': return 'bg-emerald-100 text-emerald-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  if (loading) return <div>Loading tasks...</div>;

  return (
    <div className="space-y-16">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-7xl font-black tracking-tight uppercase leading-none italic gradient-text">Task Stream</h2>
          <p className="text-zinc-500 font-bold mt-4 uppercase tracking-[0.3em] text-[10px] flex items-center gap-2">
            <span className="w-8 h-[1px] bg-indigo-500/50" /> Action Registry — Real-time Queue
          </p>
        </div>
        {isAdmin && (
          <button 
            onClick={() => setShowModal(true)}
            className="button-primary flex items-center gap-2"
          >
            <Plus size={18} />
            Append Task
          </button>
        )}
      </header>

      {/* Filters Bar */}
      <div className="sleek-card !p-6 flex flex-wrap gap-8 items-center">
        <div className="flex items-center gap-3 text-zinc-400">
          <Filter size={14} className="text-indigo-400" />
          <span className="text-[10px] font-black uppercase tracking-widest">Filter Matrix:</span>
        </div>
        
        <div className="flex flex-wrap gap-4">
          <select 
            value={filterProjectId} 
            onChange={(e) => setFilterProjectId(e.target.value)}
            className="bg-zinc-950 border border-white/5 px-5 py-2.5 rounded-xl text-[10px] font-bold uppercase outline-none focus:border-indigo-500 transition-all text-zinc-300"
          >
            <option value="">All Regions</option>
            {projects.map(p => <option key={p._id} value={p._id}>{p.title.toUpperCase()}</option>)}
          </select>

          <select 
            value={filterStatus} 
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-zinc-950 border border-white/5 px-5 py-2.5 rounded-xl text-[10px] font-bold uppercase outline-none focus:border-indigo-500 transition-all text-zinc-300"
          >
            <option value="">All Statuses</option>
            <option value="todo">Todo</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Task Table */}
      <div className="sleek-card flex flex-col !p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5 bg-white/2">
                <th className="px-10 py-6 text-[10px] font-bold uppercase tracking-widest text-zinc-500">Tier</th>
                <th className="px-10 py-6 text-[10px] font-bold uppercase tracking-widest text-zinc-500">Task Specs</th>
                <th className="px-10 py-6 text-[10px] font-bold uppercase tracking-widest text-zinc-500">Host</th>
                <th className="px-10 py-6 text-[10px] font-bold uppercase tracking-widest text-zinc-500 text-center">Status</th>
                <th className="px-10 py-6 text-[10px] font-bold uppercase tracking-widest text-zinc-500 text-right">Terminal Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 italic">
              {tasks.map((task) => (
                <tr key={task._id} className="hover:bg-white/2 transition-all group cursor-pointer">
                   <td className="px-10 py-8">
                    <span className={`badge ${
                      task.priority === 'high' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
                      task.priority === 'medium' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                      'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    }`}>
                      {task.priority}
                    </span>
                  </td>
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-4">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStatusUpdate(task._id, task.status === 'completed' ? 'in-progress' : 'completed');
                        }}
                        className={`w-6 h-6 flex-shrink-0 rounded-lg border border-white/10 flex items-center justify-center transition-all ${
                          task.status === 'completed' ? 'bg-indigo-600 text-white border-indigo-500' : 'bg-transparent text-transparent hover:border-indigo-500/50'
                        }`}
                      >
                        <CheckCircle2 size={14} />
                      </button>
                      <div className="overflow-hidden">
                        <p className={`text-sm font-bold uppercase tracking-tight transition-all ${task.status === 'completed' ? 'opacity-30 line-through' : 'text-white group-hover:text-indigo-400'}`}>{task.title}</p>
                        <p className="text-[10px] text-zinc-500 font-medium uppercase tracking-wider mt-1">{task.assignedTo?.name}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 bg-zinc-950 px-3 py-1.5 rounded-lg border border-white/5">{task.projectId?.title}</span>
                  </td>
                  <td className="px-10 py-8">
                     <select 
                      value={task.status} 
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => handleStatusUpdate(task._id, e.target.value)}
                      className={`mx-auto block text-[9px] font-black uppercase py-1.5 px-4 rounded-xl border border-white/5 outline-none appearance-none cursor-pointer transition-all ${
                        task.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                        task.status === 'in-progress' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' : 
                        'bg-zinc-900 text-zinc-500'
                      }`}
                    >
                      <option value="todo">Todo</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                  </td>
                  <td className="px-10 py-8 text-right font-mono text-[11px] font-medium text-zinc-500 group-hover:text-indigo-400 transition-colors tracking-widest uppercase">
                    {new Date(task.dueDate).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {tasks.length === 0 && (
          <div className="py-32 flex flex-col items-center justify-center text-zinc-700">
            <CheckSquare size={80} className="mb-6 opacity-5" />
            <p className="font-bold uppercase tracking-[0.4em] text-xs">Registry Empty</p>
          </div>
        )}
      </div>

       {/* Modal */}
       <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative glass-panel rounded-[2.5rem] w-full max-w-xl p-12 shadow-2xl overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-indigo-500 to-red-500" />
              <h2 className="text-4xl font-black uppercase tracking-tighter italic mb-10 gradient-text">Define Task</h2>
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Operation Header</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="sleek-input"
                    placeholder="E.G. DATA CLUSTER REFACTOR"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Task Payload Specs</label>
                  <textarea
                    required
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="sleek-input font-mono italic"
                    placeholder="ENTER SPECIFICATIONS AND REQUIREMENTS..."
                  />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Target Host</label>
                    <select
                      required
                      value={projectId}
                      onChange={(e) => setProjectId(e.target.value)}
                      className="sleek-input bg-zinc-900/50 appearance-none"
                    >
                      <option value="">CHOOSE HOST</option>
                      {projects.map(p => <option key={p._id} value={p._id}>{p.title.toUpperCase()}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Deploy Personnel</label>
                    <select
                      required
                      value={assignedTo}
                      onChange={(e) => setAssignedTo(e.target.value)}
                      className="sleek-input bg-zinc-900/50 appearance-none"
                    >
                      <option value="">CHOOSE AGENT</option>
                      {users.map(u => <option key={u._id} value={u._id}>{u.name.toUpperCase()}</option>)}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Priority Level</label>
                    <select
                      value={priority}
                      onChange={(e) => setPriority(e.target.value)}
                      className="sleek-input bg-zinc-900/50 appearance-none"
                    >
                      <option value="low">LOW URGENCY</option>
                      <option value="medium">STANDARD</option>
                      <option value="high">CRITICAL</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Deadline Offset</label>
                    <input
                      type="date"
                      required
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      className="sleek-input"
                    />
                  </div>
                </div>
                <div className="flex gap-6 pt-10">
                  <button 
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 button-secondary"
                  >
                    Abort
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 button-primary"
                  >
                    Commit
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>

  );
};

export default Tasks;
