import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Search, FileText, Download, Filter } from "lucide-react";
import { useState } from "react";

export function AnalisarSubmissoes() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const submissions = [
    {
      id: 1,
      studentName: "João Pedro Santos",
      course: "Engenharia da Computação",
      category: "Pesquisa",
      hoursRequested: 20,
      date: "2026-03-10",
      status: "pending",
      description: "Participação em projeto de Inteligência Artificial",
    },
    {
      id: 2,
      studentName: "Ana Carolina Oliveira",
      course: "Sistemas de Informação",
      category: "Extensão",
      hoursRequested: 15,
      date: "2026-03-12",
      status: "pending",
      description: "Workshop de desenvolvimento web para comunidade",
    },
    {
      id: 3,
      studentName: "Lucas Almeida Costa",
      course: "Ciência da Computação",
      category: "Cultura",
      hoursRequested: 10,
      date: "2026-03-08",
      status: "approved",
      description: "Participação em evento cultural da universidade",
    },
    {
      id: 4,
      studentName: "Beatriz Fernandes Lima",
      course: "Engenharia de Software",
      category: "Pesquisa",
      hoursRequested: 25,
      date: "2026-03-14",
      status: "pending",
      description: "Artigo científico publicado em conferência internacional",
    },
    {
      id: 5,
      studentName: "Carlos Eduardo Souza",
      course: "Engenharia da Computação",
      category: "Extensão",
      hoursRequested: 12,
      date: "2026-03-11",
      status: "rejected",
      description: "Curso de programação para jovens",
    },
    {
      id: 6,
      studentName: "Mariana Santos Pereira",
      course: "Sistemas de Informação",
      category: "Pesquisa",
      hoursRequested: 18,
      date: "2026-03-15",
      status: "pending",
      description: "Iniciação científica em Machine Learning",
    },
    {
      id: 7,
      studentName: "Rafael Oliveira Cruz",
      course: "Ciência da Computação",
      category: "Eventos",
      hoursRequested: 8,
      date: "2026-03-13",
      status: "approved",
      description: "Palestra sobre Cloud Computing",
    },
    {
      id: 8,
      studentName: "Juliana Costa Martins",
      course: "Engenharia de Software",
      category: "Extensão",
      hoursRequested: 20,
      date: "2026-03-09",
      status: "pending",
      description: "Desenvolvimento de aplicativo para ONG local",
    },
  ];

  const filteredSubmissions = submissions.filter((submission) => {
    const matchesSearch =
      submission.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      submission.course.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || submission.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs bg-yellow-100 text-yellow-800">
            Pendente
          </span>
        );
      case "approved":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs bg-green-100 text-green-800">
            Aprovado
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs bg-red-100 text-red-800">
            Rejeitado
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl text-gray-900 mb-2">Analisar Submissões</h2>
          <p className="text-sm text-gray-600">
            Revise e aprove solicitações de horas complementares dos alunos
          </p>
        </div>
        <Button className="bg-[#0f3460] hover:bg-[#0f3460]/90 text-white">
          <Download className="w-4 h-4 mr-2" />
          Exportar Relatório
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4">
          <p className="text-sm text-gray-600">Total de Submissões</p>
          <p className="text-2xl text-gray-900 mt-1">{submissions.length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-600">Pendentes</p>
          <p className="text-2xl text-yellow-600 mt-1">
            {submissions.filter((s) => s.status === "pending").length}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-600">Aprovadas</p>
          <p className="text-2xl text-green-600 mt-1">
            {submissions.filter((s) => s.status === "approved").length}
          </p>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Buscar por nome do aluno ou curso..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-4">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filtrar por status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Status</SelectItem>
                <SelectItem value="pending">Pendente</SelectItem>
                <SelectItem value="approved">Aprovado</SelectItem>
                <SelectItem value="rejected">Rejeitado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Submissions Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr className="border-b border-gray-200">
                <th className="text-left py-4 px-6 text-sm text-gray-600">Nome do Aluno</th>
                <th className="text-left py-4 px-6 text-sm text-gray-600">Curso</th>
                <th className="text-left py-4 px-6 text-sm text-gray-600">Categoria</th>
                <th className="text-left py-4 px-6 text-sm text-gray-600">Horas Solicitadas</th>
                <th className="text-left py-4 px-6 text-sm text-gray-600">Data</th>
                <th className="text-left py-4 px-6 text-sm text-gray-600">Status</th>
                <th className="text-left py-4 px-6 text-sm text-gray-600">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredSubmissions.map((submission) => (
                <tr key={submission.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0f3460] to-[#ff6b35] flex items-center justify-center text-white text-xs">
                        {submission.studentName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .slice(0, 2)}
                      </div>
                      <div>
                        <p className="text-sm text-gray-900">{submission.studentName}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-600">{submission.course}</td>
                  <td className="py-4 px-6 text-sm text-gray-600">{submission.category}</td>
                  <td className="py-4 px-6 text-sm text-gray-900">{submission.hoursRequested}h</td>
                  <td className="py-4 px-6 text-sm text-gray-600">
                    {new Date(submission.date).toLocaleDateString("pt-BR")}
                  </td>
                  <td className="py-4 px-6">{getStatusBadge(submission.status)}</td>
                  <td className="py-4 px-6">
                    {submission.status === "pending" ? (
                      <Button
                        size="sm"
                        className="bg-[#ff6b35] hover:bg-[#ff6b35]/90 text-white"
                      >
                        <FileText className="w-3 h-3 mr-1" />
                        Avaliar
                      </Button>
                    ) : (
                      <Button size="sm" variant="outline" className="text-gray-600">
                        <FileText className="w-3 h-3 mr-1" />
                        Detalhes
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredSubmissions.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Nenhuma submissão encontrada</p>
          </div>
        )}
      </Card>
    </div>
  );
}
