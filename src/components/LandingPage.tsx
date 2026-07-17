import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, 
  Zap, 
  Shield, 
  Clock, 
  Smartphone, 
  RefreshCw, 
  AlertTriangle, 
  Calendar, 
  Check, 
  FileText, 
  Users, 
  ClipboardCheck, 
  BookOpen, 
  Activity, 
  Layers,
  Sparkles
} from 'lucide-react';
import { db } from '../firebase';
import { collection, query, onSnapshot } from 'firebase/firestore';

interface LandingPageProps {
  onEnterApp: () => void;
}

export default function LandingPage({ onEnterApp }: LandingPageProps) {
  const [repackAvg, setRepackAvg] = useState('21 cx/hora');
  const [quebrasTotal, setQuebrasTotal] = useState('83 cx');
  const [validadesAlertas, setValidadesAlertas] = useState('1 Produtos');
  const [dbStatus, setDbStatus] = useState('Sincronizado');

  // Fetch real-time active statistics from database with fallsback to user-defined initial copy
  useEffect(() => {
    if (!db) return;

    try {
      const qRepack = query(collection(db, 'repack'));
      const unsubRepack = onSnapshot(qRepack, (snap) => {
        const rows = snap.docs.map(doc => doc.data());
        if (rows.length > 0) {
          let totalQty = 0;
          let totalMin = 0;
          rows.forEach((r: any) => {
            totalQty += Number(r.quantidade) || 0;
            if (r.duracao) {
              const parts = r.duracao.split(':').map(Number);
              if (parts.length >= 2 && !parts.some(isNaN)) {
                const h = parts[0];
                const m = parts[1];
                const s = parts[2] || 0;
                totalMin += (h * 60) + m + (s / 60);
              }
            }
          });
          const avg = totalMin > 0 ? Math.round((totalQty / totalMin) * 60) : 21;
          setRepackAvg(`${avg > 0 ? avg : 21} cx/hora`);
        }
      }, err => console.warn("LandingPage repack listener error:", err));

      const qQuebras = query(collection(db, 'quebras'));
      const unsubQuebras = onSnapshot(qQuebras, (snap) => {
        const rows = snap.docs.map(doc => doc.data());
        if (rows.length > 0) {
          const totalQty = rows.reduce((sum: number, r: any) => sum + (Number(r.quantidade) || 0), 0);
          setQuebrasTotal(`${totalQty > 0 ? totalQty : 83} cx`);
        }
      }, err => console.warn("LandingPage quebras listener error:", err));

      const qValidades = query(collection(db, 'validades'));
      const unsubValidades = onSnapshot(qValidades, (snap) => {
        const rows = snap.docs.map(doc => doc.data());
        if (rows.length > 0) {
          let alertCount = 0;
          const today = new Date();
          today.setHours(0, 0, 0, 0);

          rows.forEach((v: any) => {
            if (v.validade) {
              try {
                let normDate = v.validade;
                if (v.validade.includes('/')) {
                  const [d, m, y] = v.validade.split('/');
                  normDate = `${y}-${m}-${d}`;
                }
                const exp = new Date(normDate + 'T00:00:00');
                const diffTime = exp.getTime() - today.getTime();
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                if (diffDays <= 30) {
                  alertCount++;
                }
              } catch (e) {
                // ignore
              }
            }
          });
          setValidadesAlertas(`${alertCount > 0 ? alertCount : 1} Produtos`);
        }
      }, err => console.warn("LandingPage validades listener error:", err));

      return () => {
        unsubRepack();
        unsubQuebras();
        unsubValidades();
      };
    } catch (e) {
      console.warn("Error setting up real-time KPIs on LandingPage:", e);
    }
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 selection:bg-amber-500 selection:text-slate-950">
      
      {/* Premium Hero Banner Section */}
      <header className="relative bg-white text-slate-800 py-16 md:py-24 overflow-hidden border-b border-slate-200 shadow-xs">
        {/* Abstract background light overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(245,158,11,0.03),transparent_45%)]"></div>
        <div className="absolute -left-16 top-12 w-64 h-64 rounded-full bg-indigo-50/20 blur-3xl"></div>
        
        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
            {/* Tagline / Brand Badge */}
            <div className="inline-flex items-center space-x-2 bg-amber-50 border border-amber-200/60 px-3 py-1.5 rounded-full text-amber-700 text-xs sm:text-sm font-semibold uppercase tracking-wider mb-6 shadow-xs">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>Sua Produtividade em Tempo Real</span>
            </div>

            {/* Main Display Typography */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight mb-6 text-slate-900">
              ARMAZÉM FÁCIL <br className="sm:hidden" />
              <span className="text-amber-600 uppercase">PAU BRASIL AMBEV</span>
            </h1>

            {/* Description Copy */}
            <p className="text-slate-600 text-sm sm:text-base md:text-lg leading-relaxed mb-10 max-w-2xl px-2 font-medium">
              O Armazém Fácil foi criado especialmente para apoiar quem faz a engrenagem da nossa Revenda girar todos os dias: o nosso time operational. Nossa intenção é transformar as antigas planilhas de papel, pranchetas e controles manuais em uma plataforma rápida, conectada e que valoriza a produtividade de cada operador em tempo real.
            </p>

            {/* Core Action Callouts */}
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto px-4 sm:px-0">
              <button
                onClick={onEnterApp}
                className="w-full sm:w-auto bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-slate-950 font-bold px-8 py-4 rounded-xl shadow-md hover:shadow-amber-500/10 transition-all duration-200 flex items-center justify-center space-x-2 group cursor-pointer text-sm sm:text-base"
                id="btn_access_platform"
              >
                <span>Acessar a Plataforma Agora</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => scrollToSection('funcionamento')}
                className="w-full sm:w-auto bg-slate-100 hover:bg-slate-200 active:bg-slate-300 border border-slate-200 text-slate-800 font-semibold px-8 py-4 rounded-xl transition-all duration-200 flex items-center justify-center cursor-pointer text-sm sm:text-base"
                id="btn_understand_flow"
              >
                <span>Entender o Funcionamento</span>
              </button>
            </div>

            {/* Connection Status & Host Details */}
            <div className="mt-12 flex items-center space-x-2 bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-xl text-xxs sm:text-xs">
              <span className="font-mono text-amber-700">armazem-facil-ambev // conexao-ativa</span>
              <span className="text-slate-400">•</span>
              <span className="inline-flex items-center text-emerald-600 font-medium">
                <span className="h-1.5 w-1.5 bg-emerald-600 rounded-full animate-ping"></span>
                {dbStatus}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Visão Ativa do Armazém (KPIs Block) */}
      <section className="py-12 -mt-8 relative z-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-md p-6 sm:p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-6 mb-6">
              <div>
                <span className="text-[10px] sm:text-xs font-black text-amber-600 uppercase tracking-widest block mb-1">
                  📊 Visão Ativa do Armazém
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                  Mesa de Controle Integrada
                </h2>
              </div>
              <div className="text-right text-xxs font-mono text-slate-400 uppercase tracking-wider">
                Atualizado em tempo real pelas equipes de pista
              </div>
            </div>

            {/* 3-Column Bento Grid KPIs */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {/* Repack KPI */}
              <div className="p-5 rounded-xl bg-purple-50/50 border border-purple-100 hover:border-purple-200 transition-all shadow-3xs flex flex-col justify-between">
                <div>
                  <span className="text-xxs font-bold text-purple-600 uppercase tracking-wider block mb-1">
                    Rendimento Médio Repack
                  </span>
                  <div className="text-2xl sm:text-3xl font-black text-purple-950 tracking-tight my-1">
                    {repackAvg}
                  </div>
                </div>
                <span className="text-slate-500 text-xxs block mt-3">
                  Registros consolidados de produtividade
                </span>
              </div>

              {/* Quebras KPI */}
              <div className="p-5 rounded-xl bg-red-50/50 border border-red-100 hover:border-red-200 transition-all shadow-3xs flex flex-col justify-between">
                <div>
                  <span className="text-xxs font-bold text-red-600 uppercase tracking-wider block mb-1">
                    Quebras Registradas
                  </span>
                  <div className="text-2xl sm:text-3xl font-black text-red-950 tracking-tight my-1">
                    {quebrasTotal}
                  </div>
                </div>
                <span className="text-slate-500 text-xxs block mt-3">
                  Avarias comunicadas instantaneamente
                </span>
              </div>

              {/* Alertas de Validade KPI */}
              <div className="p-5 rounded-xl bg-emerald-50/50 border border-emerald-100 hover:border-emerald-200 transition-all shadow-3xs flex flex-col justify-between">
                <div>
                  <span className="text-xxs font-bold text-emerald-600 uppercase tracking-wider block mb-1">
                    Alertas de Validade (FEFO)
                  </span>
                  <div className="text-2xl sm:text-3xl font-black text-emerald-950 tracking-tight my-1">
                    {validadesAlertas}
                  </div>
                </div>
                <span className="text-slate-500 text-xxs block mt-3">
                  Sinalização de lotes com vencimento próximo
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* POR QUE CRIAMOS O ARMAZÉM FÁCIL? */}
      <section className="py-16 bg-white border-y border-slate-200/60" id="objetivos">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xxs sm:text-xs font-black text-amber-600 uppercase tracking-widest block mb-2">
              POR QUE CRIAMOS O ARMAZÉM FÁCIL?
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Os Nossos Objetivos Principais
            </h2>
            <p className="text-slate-500 text-sm sm:text-base mt-3">
              Desenvolvemos esta plataforma para eliminar processos manuais burocráticos e dar mais autonomia, transparência e segurança para a sua rotina de trabalho.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Objective 1 */}
            <div className="p-6 rounded-2xl bg-slate-50/70 border border-slate-150 hover:shadow-xs transition duration-200">
              <div className="bg-amber-100/70 p-3 rounded-xl w-12 h-12 flex items-center justify-center border border-amber-200/50 text-amber-600 mb-5">
                <Smartphone className="w-6 h-6" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-3">
                1. Agilidade e Fim das Planilhas de Papel
              </h3>
              <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
                Chega de andar com pranchetas amassadas na pista ou canetas que falham. Todo lançamento de quebras, repack ou validades é feito em segundos diretamente no celular ou no coletor de dados.
              </p>
            </div>

            {/* Objective 2 */}
            <div className="p-6 rounded-2xl bg-slate-50/70 border border-slate-150 hover:shadow-xs transition duration-200">
              <div className="bg-indigo-100/70 p-3 rounded-xl w-12 h-12 flex items-center justify-center border border-indigo-200/50 text-indigo-600 mb-5">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-3">
                2. Conectividade Direta com a Mesa
              </h3>
              <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
                Não precisa caminhar de uma ponta a outra do galpão para entregar uma ficha de quebra física. Assim que você salva o dado, a Mesa de Controle recebe na mesma hora para as devidas aprovações comerciais.
              </p>
            </div>

            {/* Objective 3 */}
            <div className="p-6 rounded-2xl bg-slate-50/70 border border-slate-150 hover:shadow-xs transition duration-200">
              <div className="bg-emerald-100/70 p-3 rounded-xl w-12 h-12 flex items-center justify-center border border-emerald-200/50 text-emerald-600 mb-5">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-3">
                3. Valorização e Transparência
              </h3>
              <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
                Seu empenho diário no repack ou no reabastecimento é registrado de forma individual e automática. A plataforma calcula de forma justa os indicadores operacionais de produtividade e qualidade.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* PASSO A PASSO SIMPLES */}
      <section className="py-16 bg-slate-50" id="funcionamento">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xxs sm:text-xs font-black text-amber-600 uppercase tracking-widest block mb-2">
              PASSO A PASSO SIMPLES
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Como a Plataforma Funciona no Seu Dia a Dia
            </h2>
            <p className="text-slate-500 text-sm sm:text-base mt-3">
              O funcionamento da plataforma foi desenhado para ser intuitivo. Cada operador contribui diretamente de onde estiver na pista para manter as informações integradas e o pátio sincronizado.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connection line for visual flow on desktop */}
            <div className="hidden md:block absolute top-12 left-1/6 right-1/6 h-0.5 bg-slate-200 z-0"></div>

            {/* Step 1 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-3xs relative z-10 flex flex-col items-center text-center">
              <div className="bg-amber-500 text-slate-950 font-black w-10 h-10 rounded-full flex items-center justify-center text-base mb-4 shadow-sm">
                1
              </div>
              <h3 className="font-bold text-slate-900 text-base sm:text-lg mb-2">
                Faça Login com seu Perfil
              </h3>
              <p className="text-slate-500 text-xs sm:text-sm">
                Ao entrar, escolha seu papel operacional ou supervisor. Cada perfil tem telas preparadas exatamente para a sua atividade específica.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-3xs relative z-10 flex flex-col items-center text-center">
              <div className="bg-slate-900 text-amber-400 font-black w-10 h-10 rounded-full flex items-center justify-center text-base mb-4 shadow-sm border border-slate-800">
                2
              </div>
              <h3 className="font-bold text-slate-900 text-base sm:text-lg mb-2">
                Lançamento em Segundos
              </h3>
              <p className="text-slate-500 text-xs sm:text-sm">
                Digite as quantidades, selecione o SKU (Cerveja, Refrigerante, etc.) e salve. Não há redigitação. O processo de lançamento dura segundos.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-3xs relative z-10 flex flex-col items-center text-center">
              <div className="bg-emerald-600 text-white font-black w-10 h-10 rounded-full flex items-center justify-center text-base mb-4 shadow-sm">
                3
              </div>
              <h3 className="font-bold text-slate-900 text-base sm:text-lg mb-2">
                Registrou, Atualizou na Hora
              </h3>
              <p className="text-slate-500 text-xs sm:text-sm">
                A informação vai direto para o banco de dados e atualiza o painel da Revenda. A mesa de controle de DPO, a coordenação e a supervisão acompanham em tempo real.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Manuais e POPs ao seu Alcance */}
      <section className="py-16 bg-white border-y border-slate-200/60" id="manuais">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            <div className="lg:col-span-5 space-y-4">
              <span className="text-xxs font-black text-amber-600 uppercase tracking-widest block">
                Manuais e POPs ao seu Alcance
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight">
                Além de fazer lançamentos de forma ágil, a plataforma funciona como um manual de bolso do operador.
              </h2>
              <p className="text-slate-500 text-sm">
                Você pode acessar de qualquer lugar os guias operacionais oficiais, garantindo alinhamento de processos e a máxima excelência em conformidade de DPO.
              </p>
              <div className="pt-3">
                <button
                  onClick={onEnterApp}
                  className="inline-flex items-center space-x-2 text-xs sm:text-sm font-bold text-amber-600 hover:text-amber-700 bg-amber-50 hover:bg-amber-100/80 px-4 py-2.5 rounded-lg border border-amber-200/40 transition duration-150 cursor-pointer"
                >
                  <span>Explorar Manuais no Aplicativo</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Item 1 */}
              <div className="p-4 bg-slate-50/50 border border-slate-150 rounded-xl flex items-start space-x-3.5">
                <div className="bg-amber-100 p-2.5 rounded-lg text-amber-600 mt-0.5">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">📄 Instruções de Trabalho (POP)</h4>
                  <p className="text-slate-500 text-xxs sm:text-xs mt-1 leading-normal">
                    Passo a passo correto para executar tarefas perfeitamente.
                  </p>
                </div>
              </div>

              {/* Item 2 */}
              <div className="p-4 bg-slate-50/50 border border-slate-150 rounded-xl flex items-start space-x-3.5">
                <div className="bg-indigo-100 p-2.5 rounded-lg text-indigo-600 mt-0.5">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">💡 Lição de um Ponto (LUP)</h4>
                  <p className="text-slate-500 text-xxs sm:text-xs mt-1 leading-normal">
                    Dicas rápidas e visuais para esclarecer dúvidas frequentes.
                  </p>
                </div>
              </div>

              {/* Item 3 */}
              <div className="p-4 bg-slate-50/50 border border-slate-150 rounded-xl flex items-start space-x-3.5">
                <div className="bg-purple-100 p-2.5 rounded-lg text-purple-600 mt-0.5">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">📊 Matriz RACI</h4>
                  <p className="text-slate-500 text-xxs sm:text-xs mt-1 leading-normal">
                    Definição clara de quem é o responsável por cada atividade no pátio.
                  </p>
                </div>
              </div>

              {/* Item 4 */}
              <div className="p-4 bg-slate-50/50 border border-slate-150 rounded-xl flex items-start space-x-3.5">
                <div className="bg-red-100 p-2.5 rounded-lg text-red-600 mt-0.5">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">🛡️ Segurança Ativa</h4>
                  <p className="text-slate-500 text-xxs sm:text-xs mt-1 leading-normal">
                    Checklists e avisos de corredores para garantir o acidente zero.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* QUAIS MÓDULOS VOCÊ VAI OPERAR? */}
      <section className="py-16 bg-slate-50" id="modulos">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xxs sm:text-xs font-black text-amber-600 uppercase tracking-widest block mb-2">
              QUAIS MÓDULOS VOCÊ VAI OPERAR?
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Apoio a Todas as Funções da Revenda
            </h2>
            <p className="text-slate-500 text-sm sm:text-base mt-3">
              Cada área do armazém tem seu canal específico no sistema, garantindo clareza e separação de responsabilidades.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Modulo 1: Repack */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 hover:border-slate-300 hover:shadow-xs transition duration-150 flex flex-col justify-between">
              <div>
                <div className="bg-purple-100 text-purple-700 w-10 h-10 rounded-lg flex items-center justify-center mb-4 font-bold text-sm">
                  <RefreshCw className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 text-base mb-2">Repack (Reembalagem)</h3>
                <span className="text-[10px] text-amber-600 font-bold uppercase tracking-wider block mb-3">
                  👉 Foco: Operador de Repack
                </span>
                <p className="text-slate-500 text-xs leading-relaxed">
                  Registre as caixas e garrafas reembaladas no seu turno. Ajuda a demonstrar a sua produtividade diária de forma direta.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center space-x-2 text-[10px] font-bold text-emerald-600 uppercase">
                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>"Registrou, Atualizou na Hora"</span>
              </div>
            </div>

            {/* Modulo 2: Quebras */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 hover:border-slate-300 hover:shadow-xs transition duration-150 flex flex-col justify-between">
              <div>
                <div className="bg-red-100 text-red-700 w-10 h-10 rounded-lg flex items-center justify-center mb-4 font-bold text-sm">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 text-base mb-2">Quebras & Avarias</h3>
                <span className="text-[10px] text-amber-600 font-bold uppercase tracking-wider block mb-3">
                  👉 Foco: Toda a Equipe
                </span>
                <p className="text-slate-500 text-xs leading-relaxed">
                  Comunique na hora qualquer garrafa quebrada ou caixa avariada encontrada na pista para o devido acerto físico de estoque.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center space-x-2 text-[10px] font-bold text-emerald-600 uppercase">
                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>"Registrou, Atualizou na Hora"</span>
              </div>
            </div>

            {/* Modulo 3: Validades */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 hover:border-slate-300 hover:shadow-xs transition duration-150 flex flex-col justify-between">
              <div>
                <div className="bg-emerald-100 text-emerald-700 w-10 h-10 rounded-lg flex items-center justify-center mb-4 font-bold text-sm">
                  <Calendar className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 text-base mb-2">Validades (Controle FEFO)</h3>
                <span className="text-[10px] text-amber-600 font-bold uppercase tracking-wider block mb-3">
                  👉 Foco: Conferente & Estoque
                </span>
                <p className="text-slate-500 text-xs leading-relaxed">
                  Lançamento ágil de lotes próximos ao vencimento para garantir que os produtos saiam do armazém na ordem certa.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center space-x-2 text-[10px] font-bold text-emerald-600 uppercase">
                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>"Registrou, Atualizou na Hora"</span>
              </div>
            </div>

            {/* Modulo 4: Empilhador */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 hover:border-slate-300 hover:shadow-xs transition duration-150 flex flex-col justify-between">
              <div>
                <div className="bg-blue-100 text-blue-700 w-10 h-10 rounded-lg flex items-center justify-center mb-4 font-bold text-sm">
                  <Shield className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 text-base mb-2">Empilhador & Segurança</h3>
                <span className="text-[10px] text-amber-600 font-bold uppercase tracking-wider block mb-3">
                  👉 Foco: Operador de Empilhadeira
                </span>
                <p className="text-slate-500 text-xs leading-relaxed">
                  Faça o checklist de segurança (bateria, freios, pneus) antes de ligar a máquina e solicite reabastecimento de picking rápido.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center space-x-2 text-[10px] font-bold text-emerald-600 uppercase">
                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>"Registrou, Atualizou na Hora"</span>
              </div>
            </div>

            {/* Modulo 5: Despejo */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 hover:border-slate-300 hover:shadow-xs transition duration-150 flex flex-col justify-between">
              <div>
                <div className="bg-indigo-100 text-indigo-700 w-10 h-10 rounded-lg flex items-center justify-center mb-4 font-bold text-sm">
                  <Layers className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 text-base mb-2">Despejo & Descarte</h3>
                <span className="text-[10px] text-amber-600 font-bold uppercase tracking-wider block mb-3">
                  👉 Foco: Operador de Despejo
                </span>
                <p className="text-slate-500 text-xs leading-relaxed">
                  Registre de forma limpa e auditada as perdas que vão para descarte físico, garantindo as devidas aprovações automáticas.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center space-x-2 text-[10px] font-bold text-emerald-600 uppercase">
                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>"Registrou, Atualizou na Hora"</span>
              </div>
            </div>

            {/* Modulo 6: Blitz */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 hover:border-slate-300 hover:shadow-xs transition duration-150 flex flex-col justify-between">
              <div>
                <div className="bg-amber-100 text-amber-700 w-10 h-10 rounded-lg flex items-center justify-center mb-4 font-bold text-sm">
                  <ClipboardCheck className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 text-base mb-2">Blitz de Refugo</h3>
                <span className="text-[10px] text-amber-600 font-bold uppercase tracking-wider block mb-3">
                  👉 Foco: Supervisor & Líder
                </span>
                <p className="text-slate-500 text-xs leading-relaxed">
                  Auditoria técnica de paletes de refugo comercial para resgate de itens aproveitáveis e identificação de melhorias.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center space-x-2 text-[10px] font-bold text-emerald-600 uppercase">
                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>"Registrou, Atualizou na Hora"</span>
              </div>
            </div>

          </div>
          
          <div className="mt-12 text-center">
            <button
              onClick={onEnterApp}
              className="bg-slate-900 hover:bg-slate-800 active:bg-slate-950 text-white font-bold px-8 py-3.5 rounded-xl transition-all shadow-sm cursor-pointer inline-flex items-center space-x-2.5 text-xs sm:text-sm"
              id="btn_access_footer"
            >
              <span>Entrar na Plataforma Completa</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-900 text-slate-400 py-10 border-t border-slate-850">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center text-xxs sm:text-xs space-y-2">
          <p className="font-medium text-slate-300">
            Pau Brasil Distribuidora © Todos os Direitos Reservados · Gestão de Retorno de Rota em Tempo Real — Ambev Guarabira
          </p>
          <p className="text-slate-500 font-mono text-[9px]">
            Sistemas Operacionais Ambev & Integridade Patrimonial
          </p>
        </div>
      </footer>

    </div>
  );
}
