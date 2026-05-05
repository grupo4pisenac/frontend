import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog";
import { Search, FileText, Filter, CheckCircle, XCircle, ExternalLink } from "lucide-react";
import { useState, useEffect } from "react";
import { api } from "../../services/api";

// ─── Tipos alinhados com SolicitacaoResponse.java ────────────────────────────

interface Solicitacao {
  id: number;
  descricao: string;
  area: string;
  horasSolicitadas: number;
  status: "PENDENTE" | "APROVADA" | "REPROVADA";
  dataCriacao: string;
  nomeAluno: string;
  urlArquivo: string | null;
  semestre: number | null;
}

interface CursoResumo {
  id: number;
  nome: string;
}

// ─── Componente ───────────────────────────────────────────────────────────────

export function AnalisarSubmissoes() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Cursos e seleção
  const [cursos, setCursos] = useState<CursoResumo[]>([]);
  const [cursoSelecionadoId, setCursoSelecionadoId] = useState<number | "">("");

  // Solicitações
  const [solicitacoes, setSolicitacoes] = useState<Solicitacao[]>([]);
  const [loading, setLoading] = useState(false);

  // Modal de avaliação
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [solicitacaoSelecionada, setSolicitacaoSelecionada] = useState<Solicitacao | null>(null);
  const [salvando, setSalvando] = useState(false);

  // ── Buscar cursos ────────────────────────────────────────────────────────────

  const fetchCursos = async () => {
    try {
      const response = await api.get('/cursos');
      setCursos(response.data);
    } catch (error) {
      console.error("Erro ao buscar cursos:", error);
    }
  };

  useEffect(() => {
    fetchCursos();
  }, []);

  // ── Buscar solicitações do curso selecionado ─────────────────────────────────

  const fetchSolicitacoes = async (cursoId: number) => {
    try {
      setLoading(true);
      const response = await api.get(`/solicitacoes/curso/${cursoId}`);
      setSolicitacoes(response.data);
    } catch (error) {
      console.error("Erro ao buscar solicitações:", error);
      alert("Não foi possível carregar as solicitações.");
    } finally {
      setLoading(false);
    }
  };

  const handleCursoChange = (value: string) => {
    const id = Number(value);
    setCursoSelecionadoId(id);
    setSolicitacoes([]);
    fetchSolicitacoes(id);
  };

  // ── Filtro de busca ──────────────────────────────────────────────────────────

  const filteredSolicitacoes = solicitacoes.filter((s) => {
    const matchesSearch =
      s.nomeAluno?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.area?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // ── Aprovar ou Reprovar ──────────────────────────────────────────────────────

  const handleAtualizarStatus = async (status: "APROVADA" | "REPROVADA") => {
    if (!solicitacaoSelecionada) return;
    try {
      setSalvando(true);
      await api.patch(`/solicitacoes/${solicitacaoSelecionada.id}/status?status=${status}`);
      setIsModalOpen(false);
      setSolicitacaoSelecionada(null);
      if (cursoSelecionadoId !== "") fetchSolicitacoes(Number(cursoSelecionadoId));
    } catch (error: any) {
      const mensagem = error?.response?.data?.message || "Erro ao atualizar status.";
      alert(mensagem);
    } finally {
      setSalvando(false);
    }
  };

  // ── Badge de status ──────────────────────────────────────────────────────────

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDENTE":
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs bg-yellow-100 text-yellow-800">Pendente</span>;
      case "APROVADA":
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs bg-green-100 text-green-800">Aprovado</span>;
      case "REPROVADA":
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs bg-red-100 text-red-800">Reprovado</span>;
      default:
        return null;
    }
  };

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6">

      {/* Cabeçalho */}
      <div>
        <h2 className="text-2xl text-[#002868] mb-2" style={{ fontFamily: 'Arvo, serif' }}>
          Analisar Submissões
        </h2>
        <p className="text-sm text-gray-600">
          Revise e aprove solicitações de horas complementares dos alunos
        </p>
      </div>

      {/* Seleção de Curso */}
      <Card className="p-6">
        <label className="block text-sm font-bold text-[#002868] mb-2">
          Selecionar Curso
        </label>
        <Select
          value={cursoSelecionadoId === "" ? "" : String(cursoSelecionadoId)}
          onValueChange={handleCursoChange}
        >
          <SelectTrigger className="w-full md:w-96">
            <SelectValue placeholder="Selecione um curso para ver as submissões" />
          </SelectTrigger>
          <SelectContent>
            {cursos.map((curso) => (
              <SelectItem key={curso.id} value={String(curso.id)}>
                {curso.nome}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Card>

      {/* Cards de resumo */}
      {cursoSelecionadoId !== "" && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="p-4">
            <p className="text-sm text-gray-600">Total</p>
            <p className="text-2xl text-gray-900 mt-1">{solicitacoes.length}</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-gray-600">Pendentes</p>
            <p className="text-2xl text-yellow-600 mt-1">
              {solicitacoes.filter(s => s.status === "PENDENTE").length}
            </p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-gray-600">Aprovadas</p>
            <p className="text-2xl text-green-600 mt-1">
              {solicitacoes.filter(s => s.status === "APROVADA").length}
            </p>
          </Card>
        </div>
      )}

      {/* Filtros */}
      {cursoSelecionadoId !== "" && (
        <Card className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Buscar por nome do aluno ou área..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filtrar por status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="PENDENTE">Pendente</SelectItem>
                <SelectItem value="APROVADA">Aprovado</SelectItem>
                <SelectItem value="REPROVADA">Reprovado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>
      )}

      {/* Tabela */}
      {cursoSelecionadoId !== "" && (
        <Card className="overflow-hidden">
          {loading ? (
            <p className="text-sm text-gray-500 text-center py-12">Carregando submissões...</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-4 px-6 text-sm text-gray-600">Aluno</th>
                    <th className="text-left py-4 px-6 text-sm text-gray-600">Área</th>
                    <th className="text-left py-4 px-6 text-sm text-gray-600">Horas</th>
                    <th className="text-left py-4 px-6 text-sm text-gray-600">Semestre</th>
                    <th className="text-left py-4 px-6 text-sm text-gray-600">Data</th>
                    <th className="text-left py-4 px-6 text-sm text-gray-600">Status</th>
                    <th className="text-left py-4 px-6 text-sm text-gray-600">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSolicitacoes.map((s) => (
                    <tr key={s.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#002868] to-[#FF9414] flex items-center justify-center text-white text-xs font-bold">
                            {s.nomeAluno?.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
                          </div>
                          <p className="text-sm text-gray-900">{s.nomeAluno}</p>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-600">{s.area}</td>
                      <td className="py-4 px-6 text-sm text-gray-900">{s.horasSolicitadas}h</td>
                      <td className="py-4 px-6 text-sm text-gray-600">{s.semestre ?? "-"}º</td>
                      <td className="py-4 px-6 text-sm text-gray-600">
                        {s.dataCriacao ? new Date(s.dataCriacao).toLocaleDateString("pt-BR") : "-"}
                      </td>
                      <td className="py-4 px-6">{getStatusBadge(s.status)}</td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            onClick={() => { setSolicitacaoSelecionada(s); setIsModalOpen(true); }}
                            className="bg-[#002868] hover:bg-[#001a4d] text-white"
                          >
                            <FileText className="w-3 h-3 mr-1" />
                            {s.status === "PENDENTE" ? "Avaliar" : "Detalhes"}
                          </Button>
                          {s.urlArquivo && (
                            <a
                              href={s.urlArquivo}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 text-gray-500 hover:text-[#002868] hover:bg-gray-100 rounded transition-colors"
                              title="Ver certificado"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredSolicitacoes.length === 0 && (
                <div className="text-center py-12">
                  <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Nenhuma submissão encontrada</p>
                </div>
              )}
            </div>
          )}
        </Card>
      )}

      {/* Modal de Avaliação */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-xl text-[#002868] font-bold" style={{ fontFamily: 'Arvo, serif' }}>
              {solicitacaoSelecionada?.status === "PENDENTE" ? "Avaliar Submissão" : "Detalhes da Submissão"}
            </DialogTitle>
          </DialogHeader>

          {solicitacaoSelecionada && (
            <div className="py-2 space-y-3">
              <div>
                <p className="text-xs text-gray-500 uppercase font-semibold">Aluno</p>
                <p className="text-sm text-gray-900">{solicitacaoSelecionada.nomeAluno}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase font-semibold">Área</p>
                <p className="text-sm text-gray-900">{solicitacaoSelecionada.area}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase font-semibold">Horas Solicitadas</p>
                <p className="text-sm text-gray-900">{solicitacaoSelecionada.horasSolicitadas}h</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase font-semibold">Semestre</p>
                <p className="text-sm text-gray-900">{solicitacaoSelecionada.semestre ?? "-"}º</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase font-semibold">Descrição</p>
                <p className="text-sm text-gray-900">{solicitacaoSelecionada.descricao}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase font-semibold">Status atual</p>
                {getStatusBadge(solicitacaoSelecionada.status)}
              </div>
              {solicitacaoSelecionada.urlArquivo && (
                <div>
                  <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Certificado</p>
                  <a
                    href={solicitacaoSelecionada.urlArquivo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-[#002868] underline flex items-center gap-1"
                  >
                    <ExternalLink className="w-3 h-3" />
                    Ver certificado
                  </a>
                </div>
              )}
            </div>
          )}

          <DialogFooter className="mt-4 flex gap-2">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Fechar
            </Button>
            {solicitacaoSelecionada?.status === "PENDENTE" && (
              <>
                <Button
                  onClick={() => handleAtualizarStatus("REPROVADA")}
                  disabled={salvando}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Reprovar
                </Button>
                <Button
                  onClick={() => handleAtualizarStatus("APROVADA")}
                  disabled={salvando}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Aprovar
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}