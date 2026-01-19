import React, { useState } from 'react';
import { supabase } from './supabaseClient';
import { Plus, Trash2, RefreshCw, Trophy } from 'lucide-react';

const AdminPanel = ({ tournaments, onRefresh }: { tournaments: any[], onRefresh: () => void }) => {
  const [newT, setNewT] = useState({ title: '', game: 'BGMI', entry_fee: '₹0', prize_pool: '₹0', slots: 100 });

  const handleAdd = async () => {
    const { error } = await supabase.from('tournaments').insert([newT]);
    if (!error) {
      alert('Tournament Live Ho Gaya!');
      onRefresh();
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Kya aap ise delete karna chahte hain?')) {
      const { error } = await supabase.from('tournaments').delete().eq('id', id);
      if (!error) onRefresh();
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="bg-white/5 border border-white/10 p-8 rounded-3xl">
        <h2 className="text-2xl font-black mb-6 flex items-center gap-2">
          <Plus className="text-cyan-400" /> ADD NEW TOURNAMENT
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <input type="text" placeholder="Title" className="bg-white/5 border border-white/10 p-3 rounded-xl outline-none focus:border-cyan-500" onChange={e => setNewT({...newT, title: e.target.value})} />
          <input type="text" placeholder="Entry Fee (e.g. ₹50)" className="bg-white/5 border border-white/10 p-3 rounded-xl outline-none focus:border-cyan-500" onChange={e => setNewT({...newT, entry_fee: e.target.value})} />
          <input type="text" placeholder="Prize Pool (e.g. ₹500)" className="bg-white/5 border border-white/10 p-3 rounded-xl outline-none focus:border-cyan-500" onChange={e => setNewT({...newT, prize_pool: e.target.value})} />
          <button onClick={handleAdd} className="lg:col-span-3 bg-cyan-500 py-3 rounded-xl font-bold hover:bg-cyan-400 transition-all">PUBLISH TOURNAMENT</button>
        </div>
      </div>

      <div className="grid gap-4">
        <h2 className="text-xl font-bold">MANAGE ACTIVE SCRIMS</h2>
        {tournaments.map(t => (
          <div key={t.id} className="flex items-center justify-between bg-white/5 p-4 rounded-2xl border border-white/10">
            <div>
              <p className="font-bold">{t.title}</p>
              <p className="text-xs text-gray-500">{t.game} | {t.entry_fee}</p>
            </div>
            <button onClick={() => handleDelete(t.id)} className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all">
              <Trash2 size={18} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminPanel;
