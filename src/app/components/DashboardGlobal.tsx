import { Card } from "./ui/card";
import { Users, Clock, CheckCircle, AlertCircle, TrendingUp, BarChart3, GraduationCap } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { useState, useEffect } from "react";
import { api } from "../../services/api";

// ─── Tipos ───────────────────────────────────────────────────────────────────

interface Curso {
  id: number;
  nome: string;
  coordenadorNome: string | null;
  totalHorasExigidas: number;
  areas: { area: string; limiteHoras: number }[];
}

interface Solicitacao {
  id: number;
  status: string;
  area: string;
  horasSolicitadas: number;
  nomeAluno: string;
}

const COLORS = ["#002868", "#0051A2", "#FF9414", "#22c55e", "#ef4444", "#8b5cf6"];

// ─── Componente ───────────────────────────────────────────────────────────────

export function DashboardGlobal() {
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [totalAlunos, setTotalAlunos] = useState(0);
  const [totalCoordenadores, setTotalCoordenadores] = useState(0);
  const [todasSolicitacoes, setTodasSolicitacoes] = useState<Solicitacao[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDados = async () => {
      try {
        setLoading(true);

        const [cursosRes, alunosRes, coordRes] = await Promise.all([
          api.get('/cursos'),
          api.get('/usuarios/alunos').catch(() => ({ data: [] })),
          api.get('/usuarios/coordenadores').catch(() => ({ data: [] })),
        ]);

        const cursosData: Curso[] = cursosRes.data;
        setCursos(cursosData);
        setTotalAlunos(alunosRes.data.length);
        setTotalCoordenadores(coordRes.data.length);

        // Buscar solicitações de todos os cursos em paralelo
        const solicitacoesPromises = cursosData.map((c: Curso) =>
          api.get(`/solicitacoes/curso/${c.id}`).then(r => r.data).catch(() => [])
        );
        const todasRes = await Promise.all(solicitacoesPromises);
        setTodasSolicitacoes(todasRes.flat());

      } catch (error) {
        console.error("Erro ao carregar dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDados();
  }, []);

  // ── Métricas calculadas ──────────────────────────────────────────────────────

  const totalPendentes = todasSolicitacoes.filter(s => s.status === "PENDENTE").length;
  const totalAprovadas = todasSolicitacoes.filter(s => s.status === "APROVADA").length;
  const totalHorasAprovadas = todasSolicitacoes
    .filter(s => s.status === "APROVADA")
    .reduce((sum, s) => sum + s.horasSolicitadas, 0);
  const taxaAprovacao = todasSolicitacoes.length > 0
    ? Math.round((totalAprovadas / todasSolicitacoes.length) * 100)
    : 0;

  // ── Horas por área ───────────────────────────────────────────────────────────

  const horasPorArea = todasSolicitacoes
    .filter(s => s.status === "APROVADA")
    .reduce((acc: Record<string, number>, s) => {
      acc[s.area] = (acc[s.area] || 0) + s.horasSolicitadas;
      return acc;
    }, {});

  const horasPorAreaData = Object.entries(horasPorArea).map(([area, horas]) => ({
    area,
    horas,
  }));

  // ── Distribuição de status (pizza) ───────────────────────────────────────────

  const statusData = [
    { name: "Pendentes", value: totalPendentes, color: "#FF9414" },
    { name: "Aprovadas", value: totalAprovadas, color: "#22c55e" },
    { name: "Reprovadas", value: todasSolicitacoes.filter(s => s.status === "REPROVADA").length, color: "#ef4444" },
  ].filter(d => d.value > 0);

  // ── KPIs ─────────────────────────────────────────────────────────────────────

  const kpiData = [
    {
      title: "Total de Alunos",
      value: totalAlunos,
      icon: Users,
      color: "bg-[#002868]",
      sub: `${cursos.length} cursos ativos`,
    },
    {
      title: "Horas Aprovadas",
      value: `${totalHorasAprovadas}h`,
      icon: Clock,
      color: "bg-[#0051A2]",
      sub: `Em ${todasSolicitacoes.length} submissões`,
    },
    {
      title: "Aprovações",
      value: totalAprovadas,
      icon: CheckCircle,
      color: "bg-green-600",
      sub: `Taxa de ${taxaAprovacao}%`,
    },
    {
      title: "Pendências",
      value: totalPendentes,
      icon: AlertCircle,
      color: "bg-[#FF9414]",
      sub: "Requer atenção",
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-gray-500 text-sm">Carregando dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">

      {/* Título */}
      <div>
        <h2 className="text-2xl text-[#002868] mb-2" style={{ fontFamily: 'Arvo, serif' }}>
          Visão Global do Sistema
        </h2>
        <p className="text-sm text-gray-600">
          Acompanhe métricas e estatísticas de todos os cursos
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiData.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <Card key={index} className="p-6 hover:shadow-xl transition-shadow bg-white">
              <div className="flex items-start justify-between mb-4">
                <div className={`${kpi.color} p-3 rounded-lg shadow-md`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-2">{kpi.title}</p>
              <p className="text-3xl text-[#002868] mb-1" style={{ fontFamily: 'Arvo, serif' }}>
                {kpi.value}
              </p>
              <p className="text-xs text-gray-500">{kpi.sub}</p>
            </Card>
          );
        })}
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Horas por Área */}
        <Card className="p-6 bg-white">
          <div className="flex items-center gap-2 mb-6">
            <BarChart3 className="w-5 h-5 text-[#002868]" />
            <h3 className="text-lg text-[#002868]" style={{ fontFamily: 'Arvo, serif' }}>
              Horas Aprovadas por Área
            </h3>
          </div>
          {horasPorAreaData.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-16">Nenhuma hora aprovada ainda.</p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={horasPorAreaData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#EEEEEE" />
                <XAxis dataKey="area" stroke="#666" style={{ fontSize: '12px' }} />
                <YAxis stroke="#666" style={{ fontSize: '12px' }} />
                <Tooltip />
                <Bar dataKey="horas" fill="#0051A2" name="Horas Aprovadas" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </Card>

        {/* Distribuição de Status */}
        <Card className="p-6 bg-white">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-5 h-5 text-[#002868]" />
            <h3 className="text-lg text-[#002868]" style={{ fontFamily: 'Arvo, serif' }}>
              Distribuição de Submissões
            </h3>
          </div>
          {statusData.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-16">Nenhuma submissão ainda.</p>
          ) : (
            <div className="flex flex-col items-center">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex gap-6 mt-2">
                {statusData.map((entry, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
                    <span className="text-xs text-gray-600">{entry.name}: {entry.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* Tabela de Cursos */}
      <Card className="p-6 bg-white">
        <div className="flex items-center gap-2 mb-6">
          <GraduationCap className="w-5 h-5 text-[#002868]" />
          <h3 className="text-lg text-[#002868]" style={{ fontFamily: 'Arvo, serif' }}>
            Cursos Cadastrados
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#EEEEEE]">
              <tr>
                <th className="text-left py-4 px-6 text-sm text-[#002868]" style={{ fontFamily: 'Arvo, serif' }}>Curso</th>
                <th className="text-left py-4 px-6 text-sm text-[#002868]" style={{ fontFamily: 'Arvo, serif' }}>Coordenador</th>
                <th className="text-left py-4 px-6 text-sm text-[#002868]" style={{ fontFamily: 'Arvo, serif' }}>Horas Exigidas</th>
                <th className="text-left py-4 px-6 text-sm text-[#002868]" style={{ fontFamily: 'Arvo, serif' }}>Áreas</th>
              </tr>
            </thead>
            <tbody>
              {cursos.map((curso, index) => (
                <tr key={curso.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#002868] to-[#0051A2] flex items-center justify-center text-white text-xs font-bold">
                        {index + 1}
                      </div>
                      <span className="text-sm text-gray-900">{curso.nome}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-600">
                    {curso.coordenadorNome ?? "Não atribuído"}
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-900">
                    {curso.totalHorasExigidas}h
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-600">
                    {curso.areas?.length > 0
                      ? curso.areas.map(a => a.area).join(", ")
                      : "Sem áreas configuradas"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {cursos.length === 0 && (
            <p className="text-sm text-gray-400 text-center py-8">Nenhum curso cadastrado.</p>
          )}
        </div>
      </Card>

      {/* Cards resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-5 bg-gradient-to-br from-[#002868] to-[#0051A2] text-white">
          <p className="text-sm opacity-90 mb-2">Coordenadores Ativos</p>
          <p className="text-3xl mb-1" style={{ fontFamily: 'Arvo, serif' }}>{totalCoordenadores}</p>
          <p className="text-xs opacity-75">Gerenciando o sistema</p>
        </Card>
        <Card className="p-5 bg-gradient-to-br from-[#0051A2] to-[#FF9414] text-white">
          <p className="text-sm opacity-90 mb-2">Cursos Ativos</p>
          <p className="text-3xl mb-1" style={{ fontFamily: 'Arvo, serif' }}>{cursos.length}</p>
          <p className="text-xs opacity-75">No sistema</p>
        </Card>
        <Card className="p-5 bg-gradient-to-br from-[#FF9414] to-[#002868] text-white">
          <p className="text-sm opacity-90 mb-2">Taxa de Aprovação</p>
          <p className="text-3xl mb-1" style={{ fontFamily: 'Arvo, serif' }}>{taxaAprovacao}%</p>
          <p className="text-xs opacity-75">Das submissões avaliadas</p>
        </Card>
      </div>

    </div>
  );
}