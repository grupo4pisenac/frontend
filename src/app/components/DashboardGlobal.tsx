import { Card } from "./ui/card";
import { Users, Clock, CheckCircle, AlertCircle, TrendingUp, BarChart3 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from "recharts";

export function DashboardGlobal() {
  const kpiData = [
    {
      title: "Total de Alunos",
      value: "1.247",
      icon: Users,
      color: "bg-[#002868]",
      trend: "+127 este mês",
      change: "+11%",
    },
    {
      title: "Horas Submetidas",
      value: "8.540h",
      icon: Clock,
      color: "bg-[#0051A2]",
      trend: "+1.240h esta semana",
      change: "+17%",
    },
    {
      title: "Aprovações",
      value: "524",
      icon: CheckCircle,
      color: "bg-green-600",
      trend: "Taxa de 78%",
      change: "+5%",
    },
    {
      title: "Pendências",
      value: "142",
      icon: AlertCircle,
      color: "bg-[#FF9414]",
      trend: "Requer atenção",
      change: "+12",
    },
  ];

  const hoursByCategory = [
    { category: "Pesquisa", hours: 2850, target: 3000 },
    { category: "Extensão", hours: 2340, target: 2500 },
    { category: "Cultura", hours: 1890, target: 2000 },
    { category: "Esportes", hours: 1460, target: 1500 },
  ];

  const monthlyTrends = [
    { month: "Set", alunos: 980, horas: 6200, aprovacoes: 420 },
    { month: "Out", alunos: 1050, horas: 6800, aprovacoes: 465 },
    { month: "Nov", alunos: 1120, horas: 7400, aprovacoes: 485 },
    { month: "Dez", alunos: 1180, horas: 7800, aprovacoes: 502 },
    { month: "Jan", alunos: 1220, horas: 8200, aprovacoes: 518 },
    { month: "Fev", alunos: 1247, horas: 8540, aprovacoes: 524 },
  ];

  const topCourses = [
    { name: "Engenharia da Computação", students: 185, hours: 1520, rate: 92 },
    { name: "Sistemas de Informação", students: 168, hours: 1380, rate: 89 },
    { name: "Administração", students: 154, hours: 1240, rate: 85 },
    { name: "Ciência da Computação", students: 142, hours: 1180, rate: 91 },
    { name: "Engenharia de Software", students: 126, hours: 1050, rate: 88 },
  ];

  return (
    <div className="space-y-8">
      {/* Page Title */}
      <div>
        <h2 className="text-2xl text-[#002868] mb-2" style={{ fontFamily: 'Arvo, serif' }}>
          Visão Global do Sistema
        </h2>
        <p className="text-sm text-gray-600">
          Acompanhe métricas e estatísticas de todas as unidades e cursos
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
                <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  {kpi.change}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-2">{kpi.title}</p>
              <p className="text-3xl text-[#002868] mb-1" style={{ fontFamily: 'Arvo, serif' }}>
                {kpi.value}
              </p>
              <p className="text-xs text-gray-500">{kpi.trend}</p>
            </Card>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart - Hours by Category */}
        <Card className="p-6 bg-white">
          <div className="flex items-center gap-2 mb-6">
            <BarChart3 className="w-5 h-5 text-[#002868]" />
            <h3 className="text-lg text-[#002868]" style={{ fontFamily: 'Arvo, serif' }}>
              Distribuição de Horas por Área
            </h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={hoursByCategory}>
              <CartesianGrid strokeDasharray="3 3" stroke="#EEEEEE" />
              <XAxis dataKey="category" stroke="#666" style={{ fontSize: '12px' }} />
              <YAxis stroke="#666" style={{ fontSize: '12px' }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="hours" fill="#0051A2" name="Horas Realizadas" radius={[8, 8, 0, 0]} />
              <Bar dataKey="target" fill="#EEEEEE" name="Meta" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Total de Horas:</span>
                <span className="ml-2 font-bold text-[#002868]">
                  {hoursByCategory.reduce((sum, cat) => sum + cat.hours, 0).toLocaleString()}h
                </span>
              </div>
              <div>
                <span className="text-gray-600">Meta Total:</span>
                <span className="ml-2 font-bold text-gray-400">
                  {hoursByCategory.reduce((sum, cat) => sum + cat.target, 0).toLocaleString()}h
                </span>
              </div>
            </div>
          </div>
        </Card>

        {/* Line Chart - Monthly Trends */}
        <Card className="p-6 bg-white">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-5 h-5 text-[#002868]" />
            <h3 className="text-lg text-[#002868]" style={{ fontFamily: 'Arvo, serif' }}>
              Evolução Mensal
            </h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyTrends}>
              <CartesianGrid strokeDasharray="3 3" stroke="#EEEEEE" />
              <XAxis dataKey="month" stroke="#666" style={{ fontSize: '12px' }} />
              <YAxis stroke="#666" style={{ fontSize: '12px' }} />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="alunos" 
                stroke="#002868" 
                strokeWidth={2}
                name="Alunos" 
                dot={{ fill: '#002868', r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="aprovacoes" 
                stroke="#FF9414" 
                strokeWidth={2}
                name="Aprovações" 
                dot={{ fill: '#FF9414', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Top Courses Table */}
      <Card className="p-6 bg-white">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg text-[#002868]" style={{ fontFamily: 'Arvo, serif' }}>
            Cursos com Maior Participação
          </h3>
          <a href="/cursos" className="text-sm text-[#FF9414] hover:underline font-medium">
            Ver todos →
          </a>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#EEEEEE]">
              <tr>
                <th className="text-left py-4 px-6 text-sm text-[#002868]" style={{ fontFamily: 'Arvo, serif' }}>
                  Curso
                </th>
                <th className="text-left py-4 px-6 text-sm text-[#002868]" style={{ fontFamily: 'Arvo, serif' }}>
                  Alunos
                </th>
                <th className="text-left py-4 px-6 text-sm text-[#002868]" style={{ fontFamily: 'Arvo, serif' }}>
                  Horas Totais
                </th>
                <th className="text-left py-4 px-6 text-sm text-[#002868]" style={{ fontFamily: 'Arvo, serif' }}>
                  Taxa de Aprovação
                </th>
              </tr>
            </thead>
            <tbody>
              {topCourses.map((course, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#002868] to-[#0051A2] flex items-center justify-center text-white text-xs">
                        {index + 1}
                      </div>
                      <span className="text-sm text-gray-900">{course.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-900">{course.students}</td>
                  <td className="py-4 px-6 text-sm text-gray-900">{course.hours}h</td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 max-w-[100px] bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-[#0051A2] h-2 rounded-full"
                          style={{ width: `${course.rate}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-900 font-medium">{course.rate}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-5 bg-gradient-to-br from-[#002868] to-[#0051A2] text-white">
          <p className="text-sm opacity-90 mb-2">Média de Horas por Aluno</p>
          <p className="text-3xl mb-1" style={{ fontFamily: 'Arvo, serif' }}>6.85h</p>
          <p className="text-xs opacity-75">Acima da meta de 6.0h</p>
        </Card>
        <Card className="p-5 bg-gradient-to-br from-[#0051A2] to-[#FF9414] text-white">
          <p className="text-sm opacity-90 mb-2">Cursos Ativos</p>
          <p className="text-3xl mb-1" style={{ fontFamily: 'Arvo, serif' }}>24</p>
          <p className="text-xs opacity-75">Em 8 unidades diferentes</p>
        </Card>
        <Card className="p-5 bg-gradient-to-br from-[#FF9414] to-[#002868] text-white">
          <p className="text-sm opacity-90 mb-2">Coordenadores Ativos</p>
          <p className="text-3xl mb-1" style={{ fontFamily: 'Arvo, serif' }}>18</p>
          <p className="text-xs opacity-75">Gerenciando o sistema</p>
        </Card>
      </div>
    </div>
  );
}
