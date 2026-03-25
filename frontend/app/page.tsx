"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Zap, Shield, Search, Database, ChevronRight, Loader2, Target, Smartphone } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function LandingPage() {
  const router = useRouter();
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
      <Loader2 className="animate-spin text-[#00e5a0]" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-[#f0f0f5] font-sans relative overflow-x-hidden selection:bg-[#00e5a0] selection:text-black">
      {/* Background Grid FX */}
      <div className="fixed inset-0 opacity-[0.1] pointer-events-none" 
           style={{ backgroundImage: `linear-gradient(#2a2a35 1px, transparent 1px), linear-gradient(90deg, #2a2a35 1px, transparent 1px)`, backgroundSize: '50px 50px' }}>
      </div>

      {/* Navbar Superior */}
      <nav className="fixed top-0 w-full z-50 bg-[#0a0a0f90] backdrop-blur-md border-b border-[#2a2a35] px-6 py-4">
        <div className="container mx-auto flex justify-between items-center max-w-6xl">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#00e5a0] rounded-lg flex items-center justify-center text-black shadow-[0_0_15px_#00e5a030]">
              <Zap size={18} fill="black" />
            </div>
            <span className="text-lg font-black tracking-tighter italic uppercase">LEADS<span className="text-[#00e5a0]">HUB</span></span>
          </div>
          
          <button 
            onClick={() => router.push(session ? "/dashboard" : "/login")}
            className="bg-[#00e5a0] text-black px-6 py-2 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-[#00ffb3] transition-all shadow-[0_5px_15px_rgba(0,229,160,0.2)]"
          >
            {session ? "Acessar Painel" : "Entrar no Sistema"}
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="inline-block bg-[#00e5a010] border border-[#00e5a030] text-[#00e5a0] px-4 py-1.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-[0.2em] mb-6">
            Prospecção B2B Inteligente
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6 leading-tight">
            Acelere suas vendas com <span className="text-[#00e5a0]">dados reais</span> da Receita.
          </h1>
          <p className="text-[#6b6b80] text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
            O LeadsHub filtra, organiza e valida milhares de empresas para o seu time de vendas focar apenas no fechamento.
          </p>
          
          <div className="flex flex-col md:flex-row justify-center gap-4">
            <button 
              onClick={() => router.push("/login")}
              className="group bg-[#00e5a0] text-black px-8 py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-3 hover:scale-105 transition-all shadow-xl shadow-[#00e5a020]"
            >
              COMEÇAR AGORA <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-6 border-t border-[#2a2a3520] relative z-10">
        <div className="container mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="bg-[#111118] border border-[#2a2a35] p-8 rounded-3xl hover:border-[#00e5a040] transition-colors group">
            <div className="w-12 h-12 bg-[#18181f] border border-[#2a2a35] rounded-xl flex items-center justify-center text-[#00e5a0] mb-6 group-hover:bg-[#00e5a0] group-hover:text-black transition-all">
              <Database size={24} />
            </div>
            <h3 className="text-xl font-bold mb-4">Base de Dados Real</h3>
            <p className="text-[#6b6b80] text-sm leading-relaxed">
              Acesso direto aos dados da Receita Federal. Sem informações defasadas ou "leads frios".
            </p>
          </div>

          <div className="bg-[#111118] border border-[#2a2a35] p-8 rounded-3xl hover:border-[#00e5a040] transition-colors group">
            <div className="w-12 h-12 bg-[#18181f] border border-[#2a2a35] rounded-xl flex items-center justify-center text-[#00e5a0] mb-6 group-hover:bg-[#00e5a0] group-hover:text-black transition-all">
              <Target size={24} />
            </div>
            <h3 className="text-xl font-bold mb-4">Filtros de Nicho</h3>
            <p className="text-[#6b6b80] text-sm leading-relaxed">
              Filtre por Gastronomia, Saúde, Automotivo e mais. Ataque exatamente onde seu consórcio brilha.
            </p>
          </div>

          <div className="bg-[#111118] border border-[#2a2a35] p-8 rounded-3xl hover:border-[#00e5a040] transition-colors group">
            <div className="w-12 h-12 bg-[#18181f] border border-[#2a2a35] rounded-xl flex items-center justify-center text-[#00e5a0] mb-6 group-hover:bg-[#00e5a0] group-hover:text-black transition-all">
              <Search size={24} />
            </div>
            <h3 className="text-xl font-bold mb-4">Radar Google</h3>
            <p className="text-[#6b6b80] text-sm leading-relaxed">
              Investigue o site, fachada e avaliações da empresa em um clique antes mesmo da primeira ligação.
            </p>
          </div>

        </div>
      </section>

      {/* "Trust" Section */}
      <section className="py-20 bg-[#11111850] border-y border-[#2a2a3530] text-center">
        <div className="container mx-auto px-6 max-w-2xl">
          <Shield className="mx-auto text-[#00e5a0] mb-6" size={40} />
          <h2 className="text-3xl font-bold mb-4">Segurança de Sessão Única</h2>
          <p className="text-[#6b6b80] text-sm leading-relaxed">
            Proteção avançada contra compartilhamento de contas. 
            O acesso é exclusivo e monitorado em tempo real pelo terminal.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-[#2a2a3520] text-center">
        <p className="text-[10px] font-mono text-[#4a4a5e] uppercase tracking-[0.4em]">
          LeadsHub Engine © 2026 // B2B Growth Terminal
        </p>
      </footer>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Mono:wght@400;500&display=swap');
        body { font-family: 'Syne', sans-serif; }
      `}</style>
    </div>
  );
}