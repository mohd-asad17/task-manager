import React, { useEffect, useState } from 'react';
import api from '../api/api.ts';
import { useAuth } from '../context/AuthContext.tsx';
import { Briefcase, Plus, MoreVertical, Trash2, Edit2, Users, CheckCircle, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const Projects: React.FC = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('active');
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);

  const fetchProjects = async () => {
    try {
      const { data } = await api.get('/api/projects');
      setProjects(data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const { data } = await api.get('/api/dashboard/users');
      setTeamMembers(data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProjects();
    if (isAdmin) fetchUsers();
  }, [isAdmin]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/api/projects', {
        title,
        description,
        status,
        teamMembers: selectedMembers
      });
      fetchProjects();
      setShowModal(false);
      resetForm();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this project? All associated tasks will be removed.')) {
      try {
        await api.delete(`/api/projects/${id}`);
        fetchProjects();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setStatus('active');
    setSelectedMembers([]);
  };

  if (loading) return <div>Loading projects...</div>;

  return (
    <div className="space-y-16">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-7xl font-black tracking-tight uppercase leading-none italic gradient-text">Projects</h2>
          <p className="text-zinc-500 font-bold mt-4 uppercase tracking-[0.3em] text-[10px] flex items-center gap-2">
            <span className="w-8 h-[1px] bg-indigo-500/50" /> Management Hub — Core Registry
          </p>
        </div>
        {isAdmin && (
          <button 
            onClick={() => setShowModal(true)}
            className="button-primary flex items-center gap-2"
          >
            <Plus size={18} />
            Initialize Project
          </button>
        )}
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((project) => (
          <motion.div 
            layout
            key={project._id}
            className="sleek-card group"
          >
            <div className="flex flex-col h-full">
              <div className="flex justify-between items-start mb-8">
                <span className={`badge ${
                  project.status === 'active' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 
                  project.status === 'completed' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : 
                  'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                }`}>{project.status}</span>
                {isAdmin && (
                  <button 
                    onClick={() => handleDelete(project._id)}
                    className="p-2 text-zinc-600 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
              
              <h3 className="text-3xl font-black text-white uppercase tracking-tighter mb-4 italic group-hover:text-indigo-400 transition-colors">{project.title}</h3>
              <p className="text-sm font-medium text-zinc-500 line-clamp-3 mb-10 leading-relaxed italic border-l border-zinc-800 pl-4">{project.description}</p>

              <div className="mt-auto pt-8 border-t border-white/5 flex items-center justify-between">
                <div className="flex -space-x-3">
                  {project.teamMembers.slice(0, 4).map((m: any, idx: number) => (
                    <div key={idx} className="w-9 h-9 bg-zinc-800 border-2 border-zinc-950 rounded-xl flex items-center justify-center text-[10px] font-black text-zinc-300 uppercase italic" title={m.name}>
                      {m.name.charAt(0)}
                    </div>
                  ))}
                  {project.teamMembers.length > 4 && (
                    <div className="w-9 h-9 bg-indigo-600 border-2 border-zinc-950 rounded-xl flex items-center justify-center text-[10px] font-black text-white italic">
                      +{project.teamMembers.length - 4}
                    </div>
                  )}
                </div>
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-600">ID: {project._id.slice(-6)}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

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
              className="relative glass-panel rounded-[2.5rem] w-full max-w-xl max-h-[90vh] overflow-y-auto p-12 shadow-2xl custom-scrollbar"
            >
              <div className="sticky -top-12 -mx-12 mb-10 px-12 pt-12 pb-6 bg-zinc-900/80 backdrop-blur-md z-10">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500" />
                <h2 className="text-4xl font-black uppercase tracking-tighter italic gradient-text">New Project</h2>
              </div>
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Project Identifier</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="sleek-input"
                    placeholder="E.G. NEURAL NETWORK REDESIGN"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Architecture Specs</label>
                  <textarea
                    required
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="sleek-input"
                    placeholder="DEFINE GOALS AND CORE INFRASTRUCTURE..."
                  />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Operational Status</label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="sleek-input appearance-none bg-zinc-900/50"
                    >
                      <option value="active">ACTIVE</option>
                      <option value="completed">COMPLETED</option>
                      <option value="on-hold">ON HOLD</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Personnel Deployment</label>
                  <div className="max-h-40 overflow-y-auto p-6 bg-zinc-950/50 border border-white/5 rounded-2xl space-y-3 custom-scrollbar">
                    {teamMembers.map((m) => (
                      <label key={m._id} className="flex items-center gap-4 cursor-pointer group p-2 hover:bg-white/2 rounded-xl transition-all">
                        <input
                          type="checkbox"
                          checked={selectedMembers.includes(m._id)}
                          onChange={(e) => {
                            if (e.target.checked) setSelectedMembers([...selectedMembers, m._id]);
                            else setSelectedMembers(selectedMembers.filter(id => id !== m._id));
                          }}
                          className="w-5 h-5 rounded-lg border-white/10 bg-zinc-900 text-indigo-500 focus:ring-0 cursor-pointer"
                        />
                        <div className="flex flex-col">
                          <span className={`text-[11px] font-black uppercase tracking-wider ${selectedMembers.includes(m._id) ? 'text-indigo-400' : 'text-zinc-400'}`}>{m.name}</span>
                          <span className="text-[9px] text-zinc-600 font-bold uppercase">{m.role}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="flex gap-6 pt-10">
                  <button 
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 button-secondary"
                  >
                    Discard
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 button-primary"
                  >
                    Initialize
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

export default Projects;
