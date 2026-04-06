"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, Download, Loader2, Zap, Filter, Globe, LogOut, User, Phone, MapPin } from "lucide-react";
import * as XLSX from "xlsx";
import { supabase } from "@/lib/supabase";

export default function Dashboard() {
  const router = useRouter();
  const [leads, setLeads] = useState<any[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [busca, setBusca] = useState("");
  const [nichoAtivo, setNichoAtivo] = useState("TODOS");

  // 1. Monitorar Autenticação e Carregar Dados
  useEffect(() => {
    const validarAcesso = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      // Se não tem sessão, manda pro login direto
      if (!session) {
        window.location.replace("/login");
        return;
      }

      try {
        // Checa se este dispositivo é o dono da sessão ativa no banco
        const { data: profile } = await supabase
          .from('profiles')
          .select('current_session_id')
          .eq('id', session.user.id)
          .single();

        const meuTokenCurto = session.access_token.slice(-20);

        // Se o ID no banco for diferente do meu, significa que outro dispositivo logou
        if (profile && profile.current_session_id !== meuTokenCurto) {
          alert("Acesso encerrado: Esta conta foi conectada em outro lugar.");
          handleLogout();
          return;
        }

        // Se passou em tudo, carrega os dados
        const { data: leadsData } = await supabase.from('leads').select('*').order('razaosocial');
        if (leadsData) setLeads(leadsData);
        
      } catch (err) {
        console.error("Erro de validação:", err);
      } finally {
        setCarregando(false);
      }
    };

    validarAcesso();
  }, []);

  // 2. Função de Sair (Logout)
    const handleLogout = async () => {
    try {
      // Desloga no Supabase
      await supabase.auth.signOut();
      
      // Limpa TUDO do navegador para evitar o erro de "muitos redirecionamentos"
      localStorage.clear();
      sessionStorage.clear();

      // O "replace" é melhor que o "push" aqui porque ele deleta o Dashboard do histórico
      window.location.replace("/login");
    } catch (error) {
      console.error("Erro ao deslogar:", error);
      window.location.replace("/login"); // Força mesmo com erro
    }
  };

  // 3. Inteligência de Nichos (Mapeador)
  const traduzirNicho = (cnae: string) => {
    if (!cnae) return "OUTROS";
    const c = cnae.toLowerCase();
    if (c.includes("alimento") || c.includes("restaurante") || c.includes("padaria") || c.includes("bebidas")) return "GASTRONOMIA";
    if (c.includes("elétrica") || c.includes("climatização") || c.includes("ar condicionado")) return "ELÉTRICA/AC";
    if (c.includes("reforma") || c.includes("construção") || c.includes("obras")) return "CONSTRUÇÃO";
    if (c.includes("beleza") || c.includes("estética") || c.includes("barbe") || c.includes("cabeleireiro")) return "ESTÉTICA/BELEZA";
    if (c.includes("odont") || c.includes("médico") || c.includes("clínica") || c.includes("saúde")) return "SAÚDE";
    if (c.includes("mecânic") || c.includes("oficina") || c.includes("peças") || c.includes("veículos")) return "AUTOMOTIVO";
    if (c.includes("loja") || c.includes("comércio") || c.includes("varejo")) return "VAREJO";
    return "SERVIÇOS";
  };

  // 4. Limpeza de Nome de Sócio (MEI)
  const limparNome = (razao: string, socio: string) => {
    if (socio && socio.trim() !== "" && socio !== "0") return socio;
    return razao.replace(/^[\d.\s/-]+/, "").trim();
  };

  // 5. Lógica de Filtros
  const leadsFiltrados = leads.filter(l => {
    const matchesBusca = `${l.razaosocial} ${l.municipio} ${l.cnpj}`.toLowerCase().includes(busca.toLowerCase());
    const matchesNicho = nichoAtivo === "TODOS" || traduzirNicho(l.cnaeprincipal) === nichoAtivo;
    return matchesBusca && matchesNicho;
  });

  const botoesNicho = ["TODOS", "GASTRONOMIA", "AUTOMOTIVO", "CONSTRUÇÃO", "ESTÉTICA/BELEZA", "SAÚDE", "ELÉTRICA/AC", "VAREJO", "SERVIÇOS"];

  if (carregando) return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f]">
      <Loader2 className="animate-spin text-[#00e5a0] w-10 h-10 shadow-[0_0_20px_#00e5a040]" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-[#f0f0f5] font-sans selection:bg-[#00e5a0] selection:text-black">
      {/* Grid Background Effect */}
      <div className="fixed inset-0 opacity-[0.1] pointer-events-none" 
           style={{ backgroundImage: `linear-gradient(#2a2a35 1px, transparent 1px), linear-gradient(90deg, #2a2a35 1px, transparent 1px)`, backgroundSize: '40px 40px' }}>
      </div>

      <div className="container mx-auto max-w-[1200px] px-6 py-8 relative z-10">
        
        {/* TOPBAR */}
        <header className="flex justify-between items-center mb-10 bg-[#111118] border border-[#2a2a35] p-5 rounded-2xl shadow-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#00e5a0] rounded-xl flex items-center justify-center text-black shadow-[0_0_15px_#00e5a030]">
              <Zap size={20} fill="black" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tighter uppercase italic">LEADS<span className="text-[#00e5a0]">HUB</span></h1>
              <p className="text-[9px] font-mono text-[#4a4a5e] tracking-[0.2em]">TERMINAL DE INTELIGÊNCIA B2B</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 text-[#6b6b80] hover:text-[#ff4757] transition-colors font-mono text-[10px] font-bold uppercase tracking-widest border border-[#2a2a35] px-4 py-2 rounded-lg bg-[#0a0a0f]"
            >
              <LogOut size={14} /> Sair do Sistema
            </button>
          </div>
        </header>

        {/* NICHOS DINÂMICOS */}
        <div className="mb-8 space-y-3">
          <div className="flex items-center gap-2 text-[#4a4a5e] font-mono text-[10px] uppercase tracking-widest">
            <Filter size={12} className="text-[#00e5a0]" /> Filtrar Frequência de Nicho
          </div>
          <div className="flex flex-wrap gap-2">
            {botoesNicho.map((n) => (
              <button
                key={n}
                onClick={() => setNichoAtivo(n)}
                className={`px-4 py-2 rounded-lg font-mono text-[10px] font-bold transition-all border ${
                  nichoAtivo === n 
                  ? "bg-[#00e5a015] text-[#00e5a0] border-[#00e5a0] shadow-[0_0_10px_#00e5a020]" 
                  : "bg-[#111118] text-[#4a4a5e] border-[#2a2a35] hover:border-[#4a4a5e]"
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        {/* BUSCA E EXPORTAÇÃO */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="md:col-span-3 relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4a4a5e] group-focus-within:text-[#00e5a0]" />
            <input 
              type="text"
              className="w-full bg-[#111118] border border-[#2a2a35] rounded-xl py-3.5 pl-12 pr-4 text-sm outline-none focus:border-[#00e5a0] transition-all"
              placeholder="PESQUISAR RAZÃO SOCIAL, CNPJ OU CIDADE..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
          </div>
          <button 
            onClick={() => {
              const ws = XLSX.utils.json_to_sheet(leadsFiltrados);
              const wb = XLSX.utils.book_new();
              XLSX.utils.book_append_sheet(wb, ws, "Leads");
              XLSX.writeFile(wb, `LeadsHub_${nichoAtivo}.xlsx`);
            }}
            className="bg-[#00e5a0] text-black rounded-xl font-black text-[11px] flex items-center justify-center gap-2 hover:bg-[#00ffb3] transition-all shadow-[0_8px_20px_rgba(0,229,160,0.2)]"
          >
            <Download size={16} /> EXPORTAR .XLSX
          </button>
        </div>

        {/* TABELA DE DADOS */}
        <div className="bg-[#111118] border border-[#2a2a35] rounded-2xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#18181f] border-b border-[#2a2a35]">
                  <th className="p-5 font-mono text-[10px] text-[#4a4a5e] uppercase tracking-widest">Identificação / Radar</th>
                  <th className="p-5 font-mono text-[10px] text-[#4a4a5e] uppercase tracking-widest">Sócio</th>
                  <th className="p-5 font-mono text-[10px] text-[#4a4a5e] uppercase tracking-widest">Segmento</th>
                  <th className="p-5 font-mono text-[10px] text-[#4a4a5e] uppercase tracking-widest">Cidade/UF</th>
                  <th className="p-5 font-mono text-[10px] text-[#4a4a5e] uppercase tracking-widest text-right">Contato</th>
                </tr>
              </thead>
              <tbody className="text-[13px]">
                {leadsFiltrados.map((l) => (
                  <tr key={l.id} className="border-b border-[#2a2a3530] hover:bg-[#ffffff03] transition-colors group">
                    <td className="p-5">
                      <div className="font-bold text-[#f0f0f5] group-hover:text-[#00e5a0] transition-colors">{l.razaosocial}</div>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-[10px] font-mono text-[#4a4a5e]">{l.cnpj}</span>
                        <a 
                          href={`https://www.google.com/search?q=CNPJ+${l.cnpj}+${l.razaosocial}`}
                          target="_blank"
                          className="bg-[#18181f] border border-[#2a2a35] text-[#6b6b80] text-[9px] font-bold px-2 py-0.5 rounded hover:border-[#00e5a0] hover:text-[#00e5a0] transition-all flex items-center gap-1"
                        >
                          <Globe size={10} /> RADAR
                        </a>
                      </div>
                    </td>
                    <td className="p-5 text-[#8a8680]">
                      {limparNome(l.razaosocial, l.socios)}
                    </td>
                    
                    {/* COLUNA SEGMENTO ATUALIZADA AQUI */}
                    <td className="p-5">
                      <div className="flex flex-col items-start gap-2">
                        <span className="bg-[#00e5a010] text-[#00e5a0] border border-[#00e5a030] px-2 py-1 rounded-[4px] text-[10px] font-bold font-mono uppercase">
                          {traduzirNicho(l.cnaeprincipal)}
                        </span>
                        <span className="text-[10px] text-[#6b6b80] font-mono leading-tight max-w-[200px]" title={l.cnaeprincipal}>
                          {l.cnaeprincipal ? l.cnaeprincipal.toUpperCase() : "RAMO NÃO ESPECIFICADO"}
                        </span>
                      </div>
                    </td>
                    {/* FIM DA ATUALIZAÇÃO */}

                    <td className="p-5 text-[#6b6b80] font-medium uppercase text-[11px]">
                      {l.municipio} / {l.uf}
                    </td>
                    <td className="p-5 text-right">
                      {l.telefone_1 ? (
                        <a 
                          href={`https://wa.me/55${l.telefone_1.replace(/\D/g,'')}`} 
                          target="_blank"
                          className="inline-flex items-center gap-2 bg-[#25d36620] text-[#25d366] border border-[#25d36640] px-4 py-2 rounded-xl text-[10px] font-black hover:bg-[#25d366] hover:text-black transition-all shadow-[0_5px_15px_rgba(37,211,102,0.1)]"
                        >
                          <Phone size={12} /> WHATSAPP
                        </a>
                      ) : (
                        <span className="text-[10px] font-mono text-[#2a2a35]">SEM TEL</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <footer className="mt-12 text-center text-[10px] font-mono text-[#4a4a5e] uppercase tracking-[0.4em]">
          LeadsHub Intelligence Suite // {leadsFiltrados.length} Registros Filtrados
        </footer>
      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Mono:wght@400;500&display=swap');
        body { font-family: 'Syne', sans-serif; }
      `}</style>
    </div>
  );
}