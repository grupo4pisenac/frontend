import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { UserPlus, Search, Mail, Edit, Trash2, Users } from "lucide-react";
import { useState, useEffect } from "react";
import { api } from "../../services/api";

// ─── Tipos alinhados com UsuarioResponse.java ─────────────────────────────────

interface CursoResumo {
  id: number;
  nome: string;
}

interface Coordenador {
  id: number;
  nome: string;
  email: string;
  perfil: string;
  cursos: CursoResumo[];
  // ativo: boolean; // ← Descomentar quando o back adicionar o campo
}

// ─── Componente ───────────────────────────────────────────────────────────────

export function Coordenadores() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoordinator, setEditingCoordinator] = useState<Coordenador | null>(null);

  // Campos do formulário
  const [nameInput, setNameInput] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [senhaInput, setSenhaInput] = useState("");
  const [selectedCursoIds, setSelectedCursoIds] = useState<number[]>([]);
  const [ativo, setAtivo] = useState(true); // ← Remover comentário do back quando pronto

  // Dados do banco
  const [coordenadores, setCoordenadores] = useState<Coordenador[]>([]);
  const [cursos, setCursos] = useState<CursoResumo[]>([]);
  const [loading, setLoading] = useState(true);

  // ── Buscar coordenadores ─────────────────────────────────────────────────────

  const fetchCoordenadores = async () => {
    try {
      setLoading(true);
      const response = await api.get('/usuarios/coordenadores');
      setCoordenadores(response.data);
    } catch (error) {
      console.error("Erro ao buscar coordenadores:", error);
      alert("Não foi possível carregar os coordenadores.");
    } finally {
      setLoading(false);
    }
  };

  // ── Buscar cursos para o checklist ───────────────────────────────────────────

  const fetchCursos = async () => {
    try {
      const response = await api.get('/cursos');
      setCursos(response.data);
    } catch (error) {
      console.error("Erro ao buscar cursos:", error);
    }
  };

  useEffect(() => {
    fetchCoordenadores();
    fetchCursos();
  }, []);

  // ── Filtro de busca ──────────────────────────────────────────────────────────

  const filteredCoordinators = coordenadores.filter((coord) => {
    const nomeCursos = coord.cursos?.map(c => c.nome).join(" ") ?? "";
    return (
      coord.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      nomeCursos.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // ── Salvar (Criar ou Editar) ─────────────────────────────────────────────────

  const handleSave = async () => {
    if (!nameInput.trim() || !emailInput.trim()) return;
    if (!editingCoordinator && !senhaInput.trim()) {
      alert("A senha é obrigatória para novos coordenadores.");
      return;
    }

    const payload: any = {
      nome: nameInput.trim(),
      email: emailInput.trim(),
      perfil: "COORDENADOR",
      cursoIds: selectedCursoIds,
      // ativo: ativo, // ← Descomentar quando o back adicionar o campo
    };

    if (senhaInput.trim()) {
      payload.senha = senhaInput.trim();
    }

    try {
      if (editingCoordinator) {
        await api.put(`/usuarios/${editingCoordinator.id}`, payload);
        alert("Coordenador atualizado com sucesso!");
      } else {
        await api.post('/usuarios', payload);
        alert("Coordenador criado com sucesso!");
      }

      handleCloseModal();
      fetchCoordenadores();
    } catch (error: any) {
      console.error("Erro ao salvar coordenador:", error);
      const mensagem = error?.response?.data?.message || "Erro ao salvar. Verifique o console.";
      alert(mensagem);
    }
  };

  // ── Abrir modal em modo edição ───────────────────────────────────────────────

  const handleEditClick = (coord: Coordenador) => {
    setEditingCoordinator(coord);
    setNameInput(coord.nome);
    setEmailInput(coord.email);
    setSenhaInput("");
    setSelectedCursoIds(coord.cursos?.map(c => c.id) ?? []);
    // setAtivo(coord.ativo ?? true); // ← Descomentar quando o back adicionar o campo
    setAtivo(true); // ← Remover quando o back estiver pronto
    setIsModalOpen(true);
  };

  // ── Fechar e limpar modal ────────────────────────────────────────────────────

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCoordinator(null);
    setNameInput("");
    setEmailInput("");
    setSenhaInput("");
    setSelectedCursoIds([]);
    setAtivo(true);
  };

  // ── Deletar ──────────────────────────────────────────────────────────────────

  const handleDelete = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir este coordenador?")) return;

    try {
      await api.delete(`/usuarios/${id}`);
      fetchCoordenadores();
    } catch (error: any) {
      const mensagem = error?.response?.data?.message || "Erro ao excluir o coordenador.";
      alert(mensagem);
    }
  };

  // ── Toggle curso no checklist ────────────────────────────────────────────────

  const toggleCurso = (cursoId: number, checked: boolean) => {
    if (checked) {
      setSelectedCursoIds([...selectedCursoIds, cursoId]);
    } else {
      setSelectedCursoIds(selectedCursoIds.filter(id => id !== cursoId));
    }
  };

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6">

      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl mb-2">Coordenadores</h1>
          <p className="text-gray-600">Gerencie os coordenadores de curso</p>
        </div>
        <Button
          onClick={() => { handleCloseModal(); setIsModalOpen(true); }}
          style={{ backgroundColor: "#FF9414" }}
          className="text-white hover:opacity-90"
        >
          <UserPlus className="size-4 mr-2" />
          Novo Coordenador
        </Button>
      </div>

      {/* Busca */}
      <Card>
        <CardContent className="py-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
            <Input
              placeholder="Buscar por nome ou curso..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Lista */}
      {loading ? (
        <p className="text-sm text-gray-500 text-center py-8">Carregando coordenadores...</p>
      ) : filteredCoordinators.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Users className="size-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium mb-2">Nenhum coordenador encontrado</h3>
            <p className="text-gray-600">Tente ajustar os filtros de busca</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredCoordinators.map((coord) => (
            <Card key={coord.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg mb-1">{coord.nome}</CardTitle>
                    <p className="text-xs text-gray-400 mb-1">ID: {coord.id}</p>
                    <p className="text-sm" style={{ color: "#0051A2" }}>
                      {coord.cursos && coord.cursos.length > 0
                        ? coord.cursos.map(c => c.nome).join("; ")
                        : "Sem curso atribuído"}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8"
                      onClick={() => handleEditClick(coord)}
                    >
                      <Edit className="size-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8 text-red-600 hover:text-red-700"
                      onClick={() => handleDelete(coord.id)}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail className="size-4" />
                  {coord.email}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Modal — Criar / Editar */}
      <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingCoordinator ? "Editar Coordenador" : "Novo Coordenador"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              {/* ID — exibido apenas no modo edição */}
              {editingCoordinator && (
                <div className="space-y-2 md:col-span-2">
                  <Label>ID do Coordenador</Label>
                  <Input
                    value={editingCoordinator.id}
                    disabled
                    className="bg-gray-100 text-gray-500 cursor-not-allowed"
                  />
                </div>
              )}

              {/* Nome */}
              <div className="space-y-2">
                <Label htmlFor="name">Nome Completo</Label>
                <Input
                  id="name"
                  placeholder="Digite o nome"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="email@senac.br"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                />
              </div>

              {/* Senha */}
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="senha">
                  Senha{" "}
                  {editingCoordinator && (
                    <span className="text-gray-400 font-normal">(deixe em branco para manter a atual)</span>
                  )}
                </Label>
                <Input
                  id="senha"
                  type="password"
                  placeholder={editingCoordinator ? "••••••••" : "Digite a senha"}
                  value={senhaInput}
                  onChange={(e) => setSenhaInput(e.target.value)}
                />
              </div>

              {/* Toggle Ativo/Inativo — aguardando back adicionar campo `ativo` */}
              {editingCoordinator && (
                <div className="space-y-2 md:col-span-2">
                  <Label>Status do Coordenador</Label>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setAtivo(true)}
                      className={`px-4 py-2 rounded-md text-sm font-medium border transition-colors ${
                        ativo
                          ? "bg-green-600 text-white border-green-600"
                          : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      Ativo
                    </button>
                    <button
                      type="button"
                      onClick={() => setAtivo(false)}
                      className={`px-4 py-2 rounded-md text-sm font-medium border transition-colors ${
                        !ativo
                          ? "bg-red-600 text-white border-red-600"
                          : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      Inativo
                    </button>
                    <span className="text-xs text-gray-400">
                      ⚠️ Aguardando suporte do back-end para persistir este campo
                    </span>
                  </div>
                </div>
              )}

              {/* Cursos — checklist populado do banco */}
              <div className="space-y-2 md:col-span-2">
                <Label>Cursos Coordenados</Label>
                <div className="grid grid-cols-1 gap-3 border rounded-md p-3 bg-gray-50 max-h-48 overflow-y-auto">
                  {cursos.map((curso) => {
                    const isSelected = selectedCursoIds.includes(curso.id);
                    return (
                      <div key={curso.id} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`curso-${curso.id}`}
                          checked={isSelected}
                          onChange={(e) => toggleCurso(curso.id, e.target.checked)}
                          className="w-4 h-4 text-[#FF9414] rounded border-gray-300 focus:ring-[#FF9414] cursor-pointer"
                        />
                        <label
                          htmlFor={`curso-${curso.id}`}
                          className="text-sm font-medium text-gray-700 cursor-pointer"
                        >
                          {curso.nome}
                        </label>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={handleCloseModal}>
                Cancelar
              </Button>
              <Button
                style={{ backgroundColor: "#FF9414" }}
                className="text-white"
                onClick={handleSave}
                disabled={!nameInput.trim() || !emailInput.trim()}
              >
                Salvar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

    </div>
  );
}