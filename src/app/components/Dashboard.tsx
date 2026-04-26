import { Card } from "./ui/card";
import { TrendingUp, Users, CheckCircle, Clock } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";

export function Dashboard() {
  const kpiData = [
    {
      title: "Pendentes de Análise",
      value: "24",
      icon: Clock,
      color: "bg-[#ff6b35]",
      trend: "+12% esta semana",
    },
    {
      title: "Total de Alunos",
      value: "487",
      icon: Users,
      color: "bg-[#0f3460]",
      trend: "+8 novos alunos",
    },
    {
      title: "Taxa de Aprovação",
      value: "87%",
      icon: CheckCircle,
      color: "bg-green-600",
      trend: "+5% vs mês anterior",
    },
  ];

  const hoursByCategory = [
    { name: "Pesquisa", value: 1250, color: "#0f3460" },
    { name: "Extensão", value: 980, color: "#ff6b35" },
    { name: "Cultura", value: 720, color: "#16213e" },
    { name: "Eventos", value: 540, color: "#1a1a2e" },
  ];

  const monthlyData = [
    { month: "Jan", submissions: 45, approved: 38 },
    { month: "Fev", submissions: 52, approved: 44 },
    { month: "Mar", submissions: 48, approved: 42 },
    { month: "Abr", submissions: 61, approved: 53 },
    { month: "Mai", submissions: 55, approved: 48 },
    { month: "Jun", submissions: 58, approved: 51 },
  ];

  const recentSubmissions = [
    {
      student: "João Pedro Santos",
      course: "Engenharia da Computação",
      category: "Pesquisa",
      hours: 20,
      status: "pending",
    },
    {
      student: "Ana Carolina Oliveira",
      course: "Sistemas de Informação",
      category: "Extensão",
      hours: 15,
      status: "pending",
    },
    {
      student: "Lucas Almeida Costa",
      course: "Ciência da Computação",
      category: "Cultura",
      hours: 10,
      status: "approved",
    },
    {
      student: "Beatriz Fernandes Lima",
      course: "Engenharia de Software",
      category: "Pesquisa",
      hours: 25,
      status: "pending",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Page Title */}
      <div>
        <h2 className="text-2xl text-gray-900 mb-2">Visão Geral do Sistema</h2>
        <p className="text-sm text-gray-600">
          Acompanhe as métricas e estatísticas das atividades complementares
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {kpiData.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-2">{kpi.title}</p>
                  <p className="text-3xl text-gray-900 mb-1">{kpi.value}</p>
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3 text-green-600" />
                    {kpi.trend}
                  </p>
                </div>
                <div className={`${kpi.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <Card className="p-6">
          <h3 className="text-lg text-gray-900 mb-4">Distribuição de Horas por Área</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={hoursByCategory}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {hoursByCategory.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 grid grid-cols-2 gap-4">
            {hoursByCategory.map((category, index) => (
              <div key={index} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: category.color }}
                />
                <span className="text-sm text-gray-600">
                  {category.name}: {category.value}h
                </span>
              </div>
            ))}
          </div>
        </Card>

        {/* Bar Chart */}
        <Card className="p-6">
          <h3 className="text-lg text-gray-900 mb-4">Submissões vs Aprovações (6 meses)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip />
              <Legend />
              <Bar dataKey="submissions" fill="#0f3460" name="Submetidas" radius={[4, 4, 0, 0]} />
              <Bar dataKey="approved" fill="#ff6b35" name="Aprovadas" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Recent Submissions Table */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg text-gray-900">Submissões Recentes</h3>
          <a href="/submissoes" className="text-sm text-[#ff6b35] hover:underline">
            Ver todas →
          </a>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm text-gray-600">Aluno</th>
                <th className="text-left py-3 px-4 text-sm text-gray-600">Curso</th>
                <th className="text-left py-3 px-4 text-sm text-gray-600">Categoria</th>
                <th className="text-left py-3 px-4 text-sm text-gray-600">Horas</th>
                <th className="text-left py-3 px-4 text-sm text-gray-600">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentSubmissions.map((submission, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm text-gray-900">{submission.student}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">{submission.course}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">{submission.category}</td>
                  <td className="py-3 px-4 text-sm text-gray-900">{submission.hours}h</td>
                  <td className="py-3 px-4">
                    {submission.status === "pending" ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs bg-yellow-100 text-yellow-800">
                        Pendente
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs bg-green-100 text-green-800">
                        Aprovado
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
