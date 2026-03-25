"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Zap, Loader2, Lock, Mail } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setCarregando(true);
    setErro("");

    try {
      // 1. Tenta autenticar no Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data?.session) {
        // 2. REGISTRO DE SESSÃO ÚNICA (Derruba o anterior)
        // Criamos ou atualizamos o ID da sessão atual no banco
        await supabase.from('profiles').upsert({
          id: data.session.user.id,
          current_session_id: data.session.access_token.slice(-20)
        });

        // 3. Redirecionamento limpo para o Dashboard
        window.location.replace("/dashboard");
      }
    } catch (err: any) {
      setErro(err.message || "Erro ao tentar acessar o sistema.");
      setCarregando(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-[#f0f0f5] flex items-center justify-center font-sans relative overflow-hidden">
      {/* Grade de fundo igual ao Dashboard */}
      <div className="fixed inset-0 opacity-[0.1] pointer-events-none" 
           style={{ backgroundImage: `linear-gradient(#2a2a35 1px, transparent 1px), linear-gradient(90deg, #2a2a35 1px, transparent 1px)`, backgroundSize: '40px 40px' }}>
      </div>

      <div className="w-full max-w-md p-8 relative z-10">
        <div className="text-center mb-10">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-[#00e5a0] rounded-2xl flex items-center justify-center text-black shadow-[0_0_30px_rgba(0,229,160,0.3)]">
              <Zap size={28} fill="black" />
            </div>
          </div>
          <h1 className="text-3xl font-black tracking-tighter uppercase italic">LEADS<span className="text-[#00e5a0]">HUB</span></h1>
          <p className="text-[#6b6b80] text-[10px] font-mono tracking-[0.3em] mt-2 uppercase">Acesso Restrito ao Terminal</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] text-[#4a4a5e] font-mono uppercase tracking-widest ml-1">E-mail Corporativo</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4a4a5e]" />
              <input 
                type="email" 
                required
                className="w-full bg-[#111118] border border-[#2a2a35] rounded-xl py-3.5 pl-12 pr-4 text-sm outline-none focus:border-[#00e5a0] transition-all"
                placeholder="nome@empresa.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] text-[#4a4a5e] font-mono uppercase tracking-widest ml-1">Senha de Acesso</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4a4a5e]" />
              <input 
                type="password" 
                required
                className="w-full bg-[#111118] border border-[#2a2a35] rounded-xl py-3.5 pl-12 pr-4 text-sm outline-none focus:border-[#00e5a0] transition-all"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {erro && (
            <div className="bg-[#ff475715] border border-[#ff475740] text-[#ff4757] text-[11px] p-3 rounded-lg font-mono text-center">
              ⚠ {erro}
            </div>
          )}

          <button 
            type="submit"
            disabled={carregando}
            className="w-full bg-[#00e5a0] text-black h-[50px] rounded-xl font-black text-xs uppercase tracking-widest hover:bg-[#00ffb3] transition-all shadow-[0_8px_25px_rgba(0,229,160,0.2)] disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {carregando ? <Loader2 className="animate-spin w-5 h-5" /> : "Iniciar Sessão"}
          </button>
        </form>

        <footer className="mt-12 text-center text-[10px] font-mono text-[#2a2a35] uppercase tracking-[0.5em]">
          LeadsHub Intelligence Suite
        </footer>
      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Mono:wght@400;500&display=swap');
        body { font-family: 'Syne', sans-serif; }
      `}</style>
    </div>
  );
}