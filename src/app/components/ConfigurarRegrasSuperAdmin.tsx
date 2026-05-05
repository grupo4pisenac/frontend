import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog";
import { Settings, Plus, Trash2, Save, Info, Pencil } from "lucide-react";
import { useState, useEffect } from "react";
import { api } from "../../services/api";

// ─── Tipos alinhados com o back ───────────────────────────────────────────────

interface CursoResumo {
  id: number;
  nome: string;
}

interface Regra {
  id: number;
  area: string;
  limiteHoras: number;
  limiteSemestral: number;
}

// ─── Componente ───────────────────────────────────────────────────────────────

export function ConfigurarRegrasSuperAdmin() {

  const [cursos, setCursos] = useState<CursoResumo[]>([]);
  const [cursoSelecionadoId, setCursoSelecionadoId] = useState<number | "">("");
  const [regras, setRegras] = useState<Regra[]>([]);
  const [loadingRegras, setLoadingRegras] = useState(false);

  // Formulário — nova regra
  const [newArea, setNewArea] = useState("");
  const [newLimiteHoras, setNewLimiteHoras] = useState<number | "">("");
  const [newLimiteSemestral, setNewLimiteSemestral] = useState<number | "">("");

  // Modal de edição
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingRegra, setEditingRegra] = useState<Regra | null>(null);

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

  // ── Buscar regras do curso selecionado ───────────────────────────────────────

  const fetchRegras = async (cursoId: number) => {
    try {
      setLoadingRegras(true);
      const response = await api.get(`/cursos/${cursoId}/regras`);
      setRegras(response.data);
    } catch (error) {
      console.error("Erro ao buscar regras:", error);
      alert("Não foi possível carregar as regras do curso.");
    } finally {
      setLoadingRegras(false);
    }
  };

  const handleCursoChange = (value: string) => {
    const id = Number(value);
    setCursoSelecionadoId(id);
    setRegras([]);
    fetchRegras(id);
  };

  // ── Criar regra ──────────────────────────────────────────────────────────────

  const handleAddRule = async () => {
    if (!newArea.trim() || newLimiteHoras === "" || newLimiteSemestral === "" || cursoSelecionadoId === "") return;

    const payload = {
      area: newArea.trim(),
      limiteHoras: Number(newLimiteHoras),
      limiteSemestral: Number(newLimiteSemestral),
    };

    try {
      await api.post(`/cursos/${cursoSelecionadoId}/regras`, payload);
      setNewArea("");
      setNewLimiteHoras("");
      setNewLimiteSemestral("");
      fetchRegras(Number(cursoSelecionadoId));
    } catch (error: any) {
      const mensagem = error?.response?.data?.message || "Erro ao adicionar regra.";
      alert(mensagem);
    }
  };

  // ── Editar regra ─────────────────────────────────────────────────────────────

  const handleEditRule = (regra: Regra) => {
    setEditingRegra({ ...regra });
    setIsEditModalOpen(true);
  };

  const handleUpdateRule = async () => {
    if (!editingRegra || cursoSelecionadoId === "") return;

    const payload = {
      area: editingRegra.area,
      limiteHoras: editingRegra.limiteHoras,
      limiteSemestral: editingRegra.limiteSemestral,
    };

    try {
      await api.put(`/cursos/${cursoSelecionadoId}/regras/${editingRegra.id}`, payload);
      setIsEditModalOpen(false);
      setEditingRegra(null);
      fetchRegras(Number(cursoSelecionadoId));
    } catch (error: any) {
      const mensagem = error?.response?.data?.message || "Erro ao atualizar regra.";
      alert(mensagem);
    }
  };

  // ── Deletar regra ────────────────────────────────────────────────────────────

  const handleDeleteRule = async (regraId: number) => {
    if (!confirm("Tem certeza que deseja excluir esta regra?") || cursoSelecionadoId === "") return;

    try {
      await api.delete(`/cursos/${cursoSelecionadoId}/regras/${regraId}`);
      fetchRegras(Number(cursoSelecionadoId));
    } catch (error: any) {
      const mensagem = error?.response?.data?.message || "Erro ao excluir regra.";
      alert(mensagem);
    }
  };

  const nomeCursoSelecionado = cursos.find(c => c.id === cursoSelecionadoId)?.nome ?? "";

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6">

      {/* Cabeçalho */}
      <div>
        <h2 className="text-2xl text-[#002868] mb-2" style={{ fontFamily: 'Arvo, serif' }}>
          Configurar Regras
        </h2>
        <p className="text-sm text-gray-600">
          Defina os limites de horas por categoria para cada curso
        </p>
      </div>

      {/* Banner informativo */}
      <Card className="p-5 bg-blue-50 border-blue-200">
        <div className="flex gap-3">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 rounded-full bg-[#0051A2] flex items-center justify-center">
              <Info className="w-5 h-5 text-white" />
            </div>
          </div>
          <div>
            <h4 className="text-sm text-[#002868] mb-1" style={{ fontFamily: 'Arvo, serif' }}>
              Importante
            </h4>
            <p className="text-sm text-gray-700">
              As regras são configuradas por curso. Selecione um curso para visualizar
              e gerenciar suas categorias e limites de horas complementares.
            </p>
          </div>
        </div>
      </Card>

      {/* Seleção de Curso */}
      <Card className="p-6 bg-white">
        <div className="flex items-center gap-2 mb-4">
          <Settings className="w-5 h-5 text-[#002868]" />
          <h3 className="text-lg text-[#002868]" style={{ fontFamily: 'Arvo, serif' }}>
            Selecionar Curso
          </h3>
        </div>
        <Select
          value={cursoSelecionadoId === "" ? "" : String(cursoSelecionadoId)}
          onValueChange={handleCursoChange}
        >
          <SelectTrigger className="w-full md:w-96">
            <SelectValue placeholder="Selecione um curso para configurar" />
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

      {/* Formulário — só aparece após selecionar curso */}
      {cursoSelecionadoId !== "" && (
        <Card className="p-6 bg-white">
          <div className="flex items-center gap-2 mb-6">
            <Plus className="w-5 h-5 text-[#002868]" />
            <h3 className="text-lg text-[#002868]" style={{ fontFamily: 'Arvo, serif' }}>
              Adicionar Nova Categoria — {nomeCursoSelecionado}
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="space-y-2">
              <Label className="text-[#002868]">Nome da Categoria</Label>
              <Input
                placeholder="Ex: Pesquisa, Extensão..."
                value={newArea}
                onChange={(e) => setNewArea(e.target.value)}
                className="bg-white border-gray-200"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[#002868]">Limite Total do Curso (horas)</Label>
              <Input
                type="number"
                min="1"
                placeholder="Ex: 100"
                value={newLimiteHoras}
                onChange={(e) => setNewLimiteHoras(e.target.value === "" ? "" : Number(e.target.value))}
                className="bg-white border-gray-200"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[#002868]">Limite Semestral (horas)</Label>
              <Input
                type="number"
                min="1"
                placeholder="Ex: 50"
                value={newLimiteSemestral}
                onChange={(e) => setNewLimiteSemestral(e.target.value === "" ? "" : Number(e.target.value))}
                className="bg-white border-gray-200"
              />
            </div>
          </div>

          <Button
            onClick={handleAddRule}
            disabled={!newArea.trim() || newLimiteHoras === "" || newLimiteSemestral === ""}
            className="bg-[#FF9414] hover:bg-[#FF9414]/90 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Categoria
          </Button>
        </Card>
      )}

      {/* Tabela de Regras */}
      {cursoSelecionadoId !== "" && (
        <Card className="p-6 bg-white">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg text-[#002868]" style={{ fontFamily: 'Arvo, serif' }}>
              Categorias Configuradas ({regras.length})
            </h3>
          </div>

          {loadingRegras ? (
            <p className="text-sm text-gray-500 text-center py-8">Carregando regras...</p>
          ) : regras.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-8">
              Nenhuma categoria configurada para este curso.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#EEEEEE]">
                  <tr>
                    <th className="text-left py-4 px-6 text-sm text-[#002868]" style={{ fontFamily: 'Arvo, serif' }}>
                      Categoria
                    </th>
                    <th className="text-left py-4 px-6 text-sm text-[#002868]" style={{ fontFamily: 'Arvo, serif' }}>
                      Limite do Curso
                    </th>
                    <th className="text-left py-4 px-6 text-sm text-[#002868]" style={{ fontFamily: 'Arvo, serif' }}>
                      Limite Semestral
                    </th>
                    <th className="text-left py-4 px-6 text-sm text-[#002868]" style={{ fontFamily: 'Arvo, serif' }}>
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {regras.map((regra) => (
                    <tr key={regra.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm bg-[#002868] text-white font-medium">
                          {regra.area}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl text-[#0051A2]" style={{ fontFamily: 'Arvo, serif' }}>
                            {regra.limiteHoras}
                          </span>
                          <span className="text-sm text-gray-600">horas</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl text-[#0051A2]" style={{ fontFamily: 'Arvo, serif' }}>
                            {regra.limiteSemestral}
                          </span>
                          <span className="text-sm text-gray-600">horas</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditRule(regra)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Editar"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteRule(regra.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Excluir"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      )}

      {/* Modal de Edição */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-2xl text-[#002868] font-bold" style={{ fontFamily: 'Arvo, serif' }}>
              Editar Categoria
            </DialogTitle>
          </DialogHeader>

          {editingRegra && (
            <div className="py-4 space-y-4">
              <div>
                <label className="block text-sm font-bold text-[#002868] mb-1">
                  Nome da Categoria
                </label>
                <Input
                  value={editingRegra.area}
                  onChange={(e) => setEditingRegra({ ...editingRegra, area: e.target.value })}
                  className="bg-white"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-[#002868] mb-1">
                  Limite Total do Curso (horas)
                </label>
                <Input
                  type="number"
                  min="1"
                  value={editingRegra.limiteHoras}
                  onChange={(e) => setEditingRegra({ ...editingRegra, limiteHoras: Number(e.target.value) })}
                  className="bg-white"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-[#002868] mb-1">
                  Limite Semestral (horas)
                </label>
                <Input
                  type="number"
                  min="1"
                  value={editingRegra.limiteSemestral}
                  onChange={(e) => setEditingRegra({ ...editingRegra, limiteSemestral: Number(e.target.value) })}
                  className="bg-white"
                />
              </div>
            </div>
          )}

          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleUpdateRule} className="bg-[#0051A2] text-white">
              <Save className="w-4 h-4 mr-2" />
              Salvar Alterações
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}