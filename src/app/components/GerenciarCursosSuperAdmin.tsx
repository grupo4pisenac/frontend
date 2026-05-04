import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog";
import { Plus, Search, Edit, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { api } from "../../services/api";

// ─── Tipos alinhados com CursoResponse.java e UsuarioResponse.java ────────────

interface RegraAtividade {
  id: number;
  area: string;
  limiteHoras: number;
}

interface Curso {
  id: number;
  nome: string;
  coordenadorId: number | null;
  coordenadorNome: string | null;
  totalHorasExigidas: number;
  areas: RegraAtividade[];
}

interface Coordenador {
  id: number;
  nome: string;
}

// ─── Componente ───────────────────────────────────────────────────────────────

export function GerenciarCursosSuperAdmin() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Curso | null>(null);

  // Campos do formulário
  const [newCourseName, setNewCourseName] = useState("");
  const [selectedCoordenadorId, setSelectedCoordenadorId] = useState<number | "">("");

  // Dados do banco
  const [courses, setCourses] = useState<Curso[]>([]);
  const [coordenadores, setCoordenadores] = useState<Coordenador[]>([]);
  const [loading, setLoading] = useState(true);

  // ── Buscar cursos do banco ───────────────────────────────────────────────────

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await api.get('/cursos');
      setCourses(response.data);
    } catch (error) {
      console.error("Erro ao buscar cursos:", error);
      alert("Não foi possível carregar os cursos do servidor.");
    } finally {
      setLoading(false);
    }
  };

  // ── Buscar coordenadores para popular o select ───────────────────────────────

  const fetchCoordenadores = async () => {
    try {
      const response = await api.get('/usuarios/coordenadores');
      setCoordenadores(response.data);
    } catch (error) {
      console.error("Erro ao buscar coordenadores:", error);
    }
  };

  useEffect(() => {
    fetchCourses();
    fetchCoordenadores();
  }, []);

  // ── Filtro de busca ──────────────────────────────────────────────────────────

  const filteredCourses = courses.filter((course) =>
    course.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ── Salvar (Criar ou Editar) ─────────────────────────────────────────────────

  const handleSaveCourse = async () => {
    if (!newCourseName.trim() || selectedCoordenadorId === "") return;

    // Payload alinhado com CursoRequest.java: { nome, coordenadorId }
    const payload = {
      nome: newCourseName.trim(),
      coordenadorId: Number(selectedCoordenadorId),
    };

    try {
      if (editingCourse) {
        await api.put(`/cursos/${editingCourse.id}`, payload);
        alert("Curso atualizado com sucesso!");
      } else {
        await api.post('/cursos', payload);
        alert("Curso criado com sucesso!");
      }

      handleCloseModal();
      fetchCourses();
    } catch (error: any) {
      console.error("Erro ao salvar curso:", error);
      const mensagem = error?.response?.data?.message || "Erro ao salvar o curso. Verifique o console.";
      alert(mensagem);
    }
  };

  // ── Abrir modal em modo edição ───────────────────────────────────────────────

  const handleEditClick = (course: Curso) => {
    setEditingCourse(course);
    setNewCourseName(course.nome);
    setSelectedCoordenadorId(course.coordenadorId ?? "");
    setIsModalOpen(true);
  };

  // ── Fechar e limpar modal ────────────────────────────────────────────────────

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCourse(null);
    setNewCourseName("");
    setSelectedCoordenadorId("");
  };

  // ── Deletar ──────────────────────────────────────────────────────────────────

  const handleDeleteCourse = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir este curso?")) return;

    try {
      await api.delete(`/cursos/${id}`);
      fetchCourses();
    } catch (error) {
      alert("Erro ao excluir o curso. Verifique se ele possui regras vinculadas.");
    }
  };

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6">

      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl text-[#002868] mb-2" style={{ fontFamily: 'Arvo, serif' }}>
            Cursos
          </h1>
          <p className="text-sm text-gray-600">
            Cadastre e gerencie os cursos da instituição.
          </p>
        </div>
        <Button
          onClick={() => {
            handleCloseModal();
            setIsModalOpen(true);
          }}
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Novo Curso
        </Button>
      </div>

      {/* Busca */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <Input
          placeholder="Pesquisar cursos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-11 bg-white border-gray-300"
        />
      </div>

      {/* Lista de Cursos */}
      {loading ? (
        <p className="text-sm text-gray-500 text-center py-8">Carregando cursos...</p>
      ) : filteredCourses.length === 0 ? (
        <p className="text-sm text-gray-500 text-center py-8">Nenhum curso encontrado.</p>
      ) : (
        <div className="space-y-4">
          {filteredCourses.map((course) => (
            <div
              key={course.id}
              className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-5 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Informações do Curso */}
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-[#002868]" style={{ fontFamily: 'Arvo, serif' }}>
                  {course.nome}
                </h3>
                <p className="text-sm text-gray-600">
                  <span className="font-semibold text-gray-800">Coordenador do Curso:</span>{" "}
                  {course.coordenadorNome ?? "Não atribuído"}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-semibold text-gray-800">Horas complementares necessárias:</span>{" "}
                  {course.totalHorasExigidas}h
                </p>
                {course.areas && course.areas.length > 0 && (
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold text-gray-800">Categorias:</span>{" "}
                    {course.areas.map((a) => `${a.area} (${a.limiteHoras}h)`).join("; ")}
                  </p>
                )}
              </div>

              {/* Ações */}
              <div className="flex items-center space-x-2 mt-4 sm:mt-0">
                <button
                  className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                  title="Editar Curso"
                  onClick={() => handleEditClick(course)}
                >
                  <Edit className="w-5 h-5" />
                </button>
                <button
                  className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                  title="Excluir Curso"
                  onClick={() => handleDeleteCourse(course.id)}
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal — Criar / Editar */}
      <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-2xl text-[#002868] font-bold" style={{ fontFamily: 'Arvo, serif' }}>
              {editingCourse ? "Editar Curso" : "Novo Curso"}
            </DialogTitle>
          </DialogHeader>

          <div className="py-2 space-y-4">

            {/* Nome do Curso */}
            <div>
              <label className="block text-sm font-bold text-[#002868] mb-1">
                Nome do Curso
              </label>
              <Input
                placeholder="Ex: Tecnólogo em UX Design"
                value={newCourseName}
                onChange={(e) => setNewCourseName(e.target.value)}
                className="bg-white"
              />
            </div>

            {/* Coordenador — populado dinamicamente do banco via GET /usuarios/coordenadores */}
            <div>
              <label className="block text-sm font-bold text-[#002868] mb-1">
                Coordenador do Curso
              </label>
              <select
                value={selectedCoordenadorId}
                onChange={(e) =>
                  setSelectedCoordenadorId(e.target.value === "" ? "" : Number(e.target.value))
                }
                className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 cursor-pointer"
              >
                <option value="" disabled>Selecionar coordenador</option>
                {coordenadores.map((coord) => (
                  <option key={coord.id} value={coord.id}>
                    {coord.nome}
                  </option>
                ))}
              </select>
            </div>

          </div>

          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={handleCloseModal}>
              Cancelar
            </Button>
            <Button
              onClick={handleSaveCourse}
              className="bg-green-600 hover:bg-green-700 text-white"
              disabled={!newCourseName.trim() || selectedCoordenadorId === ""}
            >
              Salvar Curso
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}