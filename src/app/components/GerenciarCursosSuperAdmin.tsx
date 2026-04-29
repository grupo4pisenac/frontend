import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Plus, Search, Edit, Trash2, MoreVertical } from "lucide-react";
import { useState, useEffect } from "react";
import { api } from "../../services/api"; // Importando nossa ponte com o Java

// alteração 1: Fora da função do componente, para referência
const MODALIDADES_DISPONIVEIS = ["Pesquisa", "Extensão", "Cultura", "Esportes"];

// Definindo a estrutura do Curso conforme o Java (model/Curso.java)
interface Curso {
  id: number;
  nome: string;
}

export function GerenciarCursosSuperAdmin() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  // alteração 2: Novos estados para o formulário (começo da alteração)
  // Novos estados para o formulário
  const [newCourseName, setNewCourseName] = useState("");
  const [newSemestres, setNewSemestres] = useState<number | "">("");
  const [newCoordenador, setNewCoordenador] = useState("");
  const [newHoras, setNewHoras] = useState<number | "">("");
  const [categoriasSelecionadas, setCategoriasSelecionadas] = useState<{ [key: string]: number }>({});
  // Novos estados para o formulário (fim da alteração)
  const [courses, setCourses] = useState<Curso[]>([]); // Começa vazio para receber do banco
  const [loading, setLoading] = useState(true);

  // 1. LISTAR: Busca os cursos do banco ao carregar a tela
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

  useEffect(() => {
    fetchCourses();
  }, []);

  const filteredCourses = courses.filter((course) =>
    course.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  //alteração 3: NOVA VERSÃO DO CRIAR A SEGUIR:
  // 2. CRIAR: Envia o novo curso para o Java (CursoController.criar)
  const handleSaveCourse = async () => {
    if (newCourseName.trim()) {
      try {
        // --- NOVA LÓGICA DE TRATAMENTO ---
        // Aqui transformamos o objeto { Pesquisa: 20, Extensão: 30 } 
        // na string "Pesquisa (20h); Extensão (30h)" que o seu Java espera receber
        const categoriasFormatadas = Object.entries(categoriasSelecionadas)
          .map(([nome, limite]) => `${nome} (${limite}h)`)
          .join("; ");

        const payload = {
          nome: newCourseName.trim(),
          semestresLetivos: Number(newSemestres),
          coordenador: newCoordenador.trim(),
          horasComplementaresNecessarias: Number(newHoras),
          categoriasHoras: categoriasFormatadas // Aqui enviamos a string formatada
        };
        // ---------------------------------

        // Chamada para a sua API Java
        await api.post('/cursos', payload);

        handleCloseModal(); // Fecha o modal e limpa os campos
        fetchCourses();     // Atualiza a lista de cursos na tela

      } catch (error: any) {
        console.error("Erro ao salvar curso:", error);
        alert("Erro ao salvar o curso. Verifique o console.");
      }
    }
  };

  // Função auxiliar para limpar os campos ao cancelar
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setNewCourseName("");
    setNewSemestres("");
    setNewCoordenador("");
    setNewHoras("");
    setCategoriasSelecionadas({});
  };

  // 3. DELETAR: Remove o curso do banco (CursoController.deletar)
  const handleDeleteCourse = async (id: number) => {
    if (confirm("Tem certeza que deseja excluir este curso?")) {
      try {
        await api.delete(`/cursos/${id}`);
        fetchCourses(); // Atualiza a lista após deletar
      } catch (error) {
        alert("Erro ao excluir o curso. Verifique se ele possui regras vinculadas.");
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl text-[#002868] mb-2" style={{ fontFamily: 'Arvo, serif' }}>
            Cursos
          </h1>
          <p className="text-sm text-gray-600">
            Cadastre e gerencie os cursos da instituição[cite: 70, 83].
          </p>
        </div>
        <Button
          onClick={() => setIsModalOpen(true)}
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Novo Curso
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <Input
          placeholder="Pesquisar cursos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-11 bg-white border-gray-300"
        />
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left py-3 px-6 text-sm text-[#002868]" style={{ fontFamily: 'Arvo, serif' }}>
                Nome do Curso
              </th>
              <th className="text-right py-3 px-6 text-sm text-[#002868]" style={{ fontFamily: 'Arvo, serif' }}>
                Ações
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={2} className="text-center py-10">Carregando cursos...</td></tr>
            ) : filteredCourses.map((course, index) => (
              <tr
                key={course.id}
                className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                  }`}
              >
                <td className="py-4 px-6">
                  <p className="text-base text-gray-900 font-semibold">{course.nome}</p>
                </td>
                <td className="py-4 px-6 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger className="inline-flex items-center justify-center rounded-md p-2 text-gray-700 hover:bg-gray-100 focus:outline-none">
                      <MoreVertical className="h-4 w-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        variant="destructive"
                        onClick={() => handleDeleteCourse(course.id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {!loading && filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Nenhum curso encontrado</p>
          </div>
        )}
      </div>

      <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-2xl text-[#002868] font-bold" style={{ fontFamily: 'Arvo, serif' }}>
              Novo Curso
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

            {/* Número de Semestres */}
            <div>
              <label className="block text-sm font-bold text-[#002868] mb-1">
                Número de semestres letivos
              </label>
              <Input
                type="number"
                min="1"
                placeholder="Ex: 5"
                value={newSemestres}
                onChange={(e) => setNewSemestres(e.target.value === "" ? "" : Number(e.target.value))}
                className="bg-white"
              />
            </div>

            {/* Coordenador do Curso */}
            <div>
              <label className="block text-sm font-bold text-[#002868] mb-1">
                Coordenador do Curso
              </label>
              <Input
                placeholder="Buscar entre os docentes"
                value={newCoordenador}
                onChange={(e) => setNewCoordenador(e.target.value)}
                className="bg-white"
              />
            </div>

            {/* Horas Complementares */}
            <div>
              <label className="block text-sm font-bold text-[#002868] mb-1">
                Horas complementares necessárias
              </label>
              <Input
                type="number"
                min="0"
                placeholder="Ex: 100"
                value={newHoras}
                onChange={(e) => setNewHoras(e.target.value === "" ? "" : Number(e.target.value))}
                className="bg-white"
              />
            </div>

            {/* alteração 4 - Categorias de Horas e Limites - Nova Versão */}
            <div className="space-y-3">
              <label className="block text-sm font-bold text-[#002868]">
                Categorias e Limites de Horas
              </label>
              <div className="grid grid-cols-1 gap-3 border rounded-md p-3 bg-gray-50">
                {MODALIDADES_DISPONIVEIS.map((modalidade) => {
                  const isSelected = categoriasSelecionadas[modalidade] !== undefined;

                  return (
                    <div key={modalidade} className="flex items-center justify-between gap-4">
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={modalidade}
                          checked={isSelected}
                          onChange={(e) => {
                            if (e.target.checked) {
                              // Ao marcar, inicia com 0 horas
                              setCategoriasSelecionadas({ ...categoriasSelecionadas, [modalidade]: 0 });
                            } else {
                              // Ao desmarcar, remove a chave do objeto
                              const { [modalidade]: _, ...rest } = categoriasSelecionadas;
                              setCategoriasSelecionadas(rest);
                            }
                          }}
                          className="w-4 h-4 text-green-600 rounded border-gray-300 focus:ring-green-500 cursor-pointer"
                        />
                        <label htmlFor={modalidade} className="text-sm font-medium text-gray-700 cursor-pointer">
                          {modalidade}
                        </label>
                      </div>

                      {/* O input de horas só aparece se o checkbox estiver marcado */}
                      {isSelected && (
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500">Limite (h):</span>
                          <Input
                            type="number"
                            min="0"
                            placeholder="Horas"
                            className="w-20 h-8 bg-white"
                            value={categoriasSelecionadas[modalidade]}
                            onChange={(e) =>
                              setCategoriasSelecionadas({
                                ...categoriasSelecionadas,
                                [modalidade]: Number(e.target.value)
                              })
                            }
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div> {}

          <DialogFooter className="mt-4">
            <Button
              variant="outline"
              onClick={handleCloseModal}
            >
                Cancelar
              </Button>
              <Button
                onClick={handleSaveCourse}
                className="bg-green-600 hover:bg-green-700 text-white"
                disabled={!newCourseName.trim() || newSemestres === "" || newHoras === ""}
              >
                Salvar Curso
              </Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
