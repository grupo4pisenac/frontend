import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Plus, Search, Edit, Trash2, MoreVertical } from "lucide-react";
import { useState, useEffect } from "react";
import { api } from "../../services/api"; // Importando nossa ponte com o Java

const MODALIDADES_DISPONIVEIS = ["Pesquisa", "Extensão", "Cultura", "Esportes"];

// Definindo a estrutura do Curso conforme o Java (model/Curso.java)
interface Curso {
  id: number;
  nome: string;
}

// alteração 01maio povoar cursos
interface Curso {
  id: number;
  nome: string;
  coordenador?: string;
  horasComplementaresNecessarias?: number;
  categoriasHoras?: string;
}

const cursosExemplo: Curso[] = [
  { 
    id: 1, 
    nome: "Análise e Desenvolvimento de sistemas", 
    coordenador: "Carlos Mendes", 
    horasComplementaresNecessarias: 100, 
    categoriasHoras: "Pesquisa; Extensão; Cultura; Esportes." 
  },
  { 
    id: 2, 
    nome: "Gestão de Tecnologia da informação", 
    coordenador: "Fernanda Lima", 
    horasComplementaresNecessarias: 100, 
    categoriasHoras: "Pesquisa; Extensão; Cultura; Monitoria." 
  },
  { 
    id: 3, 
    nome: "Redes de Computadores", 
    coordenador: "Ricardo Souza", 
    horasComplementaresNecessarias: 100, 
    categoriasHoras: "Pesquisa; Extensão; Cultura; Monitoria." 
  },
  { 
    id: 4, 
    nome: "Ciência de dados", 
    coordenador: "Ricardo Souza", 
    horasComplementaresNecessarias: 100, 
    categoriasHoras: "Pesquisa; Extensão; Cultura; Monitoria." 
  },
  { 
    id: 5, 
    nome: "Segurança da Informação", 
    coordenador: "Patrícia Oliveira", 
    horasComplementaresNecessarias: 100, 
    categoriasHoras: "Pesquisa; Extensão; Cultura; Eventos científicos." 
  }
];

export function GerenciarCursosSuperAdmin() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  // alteração 2: Novos estados para o formulário (começo da alteração)
  // Novos estados para o formulário
  // alteração 3_1 maio: editar card do curso(linha abaixo)
  const [editingCourse, setEditingCourse] = useState<Curso | null>(null);
  const [newCourseName, setNewCourseName] = useState("");
  const [newCoordenador, setNewCoordenador] = useState("");
  const [newHoras, setNewHoras] = useState<number | "">("");
  const [categoriasSelecionadas, setCategoriasSelecionadas] = useState<string[]>([]);
  // Novos estados para o formulário (fim da alteração)
  //alt 1_1 de maio: retirada do limite de horas
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

  //alteração 1maio: 
// 2. CRIAR ou EDITAR: Envia o curso para o Java
  const handleSaveCourse = async () => {
    if (newCourseName.trim()) {
      try {
        const categoriasFormatadas = categoriasSelecionadas.join("; ");

        const payload = {
          nome: newCourseName.trim(),
          coordenador: newCoordenador.trim(),
          horasComplementaresNecessarias: Number(newHoras),
          categoriasHoras: categoriasFormatadas 
        };

        if (editingCourse) {
          // MODO EDIÇÃO
          await api.put(`/cursos/${editingCourse.id}`, payload);
          alert("Curso atualizado com sucesso!");
        } else {
          // MODO CRIAÇÃO
          await api.post('/cursos', payload);
          alert("Curso criado com sucesso!");
        }

        handleCloseModal(); 
        fetchCourses(); 

      } catch (error: any) {
        console.error("Erro ao salvar curso:", error);
        alert("Erro ao salvar o curso. Verifique o console.");
      }
    }
  };

  // Função auxiliar para limpar os campos ao cancelar
  // Função para abrir o modal em modo de edição
  const handleEditClick = (course: Curso) => {
    setEditingCourse(course);
    setNewCourseName(course.nome);
    setNewCoordenador(course.coordenador || "");
    setNewHoras(course.horasComplementaresNecessarias || "");

    if (course.categoriasHoras) {
      const categoriasArray = course.categoriasHoras
        .split(";")
        .map(cat => cat.replace(".", "").trim())
        .filter(cat => cat.length > 0);
      setCategoriasSelecionadas(categoriasArray);
    } else {
      setCategoriasSelecionadas([]);
    }

    setIsModalOpen(true);
  };
  // Função auxiliar para limpar os campos ao cancelar
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCourse(null); // <-- Limpa o curso em edição
    setNewCourseName("");
    setNewCoordenador("");
    setNewHoras("");
    setCategoriasSelecionadas([]);
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
            Cadastre e gerencie os cursos da instituição.
          </p>
        </div>
        <Button
          onClick={() => {
            handleCloseModal(); // Garante que tudo esteja limpo
            setIsModalOpen(true); // Abre a janela vazia
          }}
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
      
      {/* Alteração 01 de maio_ Container dos Cards */}
      <div className="space-y-4">
        {cursosExemplo.map((course) => (
          <div 
            key={course.id} 
            className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-5 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
          >
            {/* Lado Esquerdo: Informações do Curso */}
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-[#002868]" style={{ fontFamily: 'Arvo, serif' }}>
                {course.nome}
              </h3>
              <p className="text-sm text-gray-600">
                <span className="font-semibold text-gray-800">Coordenador do Curso:</span> {course.coordenador}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-semibold text-gray-800">Horas complementares necessárias:</span> {course.horasComplementaresNecessarias}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-semibold text-gray-800">Categorias:</span> {course.categoriasHoras}
              </p>
            </div>

            {/* Lado Direito: Ações (Botões) */}
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
                onClick={() => console.log("Excluir clicado para:", course.id)}
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>

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

            {/* Alt 1 de maio Coordenador do Curso (selecionando de uma lista) */}
            <div>
              <label className="block text-sm font-bold text-[#002868] mb-1">
                Coordenador do Curso
              </label>
              <select
                value={newCoordenador}
                onChange={(e) => setNewCoordenador(e.target.value)}
                className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 cursor-pointer"
              >
                <option value="" disabled>Selecionar</option>
                <option value="Carlos Mendes">Carlos Mendes</option>
                <option value="Fernanda Lima">Fernanda Lima</option>
                <option value="Ricardo Souza">Ricardo Souza</option>
                <option value="Patrícia Oliveira">Patrícia Oliveira</option>
              </select>
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
                Categorias
              </label>
              <div className="grid grid-cols-1 gap-3 border rounded-md p-3 bg-gray-50">
                {MODALIDADES_DISPONIVEIS.map((modalidade) => {
  // Verifica se a modalidade está dentro do array de selecionadas
  const isSelected = categoriasSelecionadas.includes(modalidade);

  return (
    <div key={modalidade} className="flex items-center justify-between gap-4">
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id={modalidade}
          checked={isSelected}
          onChange={(e) => {
            if (e.target.checked) {
              // Se marcou, adiciona ao array
              setCategoriasSelecionadas([...categoriasSelecionadas, modalidade]);
            } else {
              // Se desmarcou, filtra o array removendo a modalidade
              setCategoriasSelecionadas(categoriasSelecionadas.filter(item => item !== modalidade));
            }
          }}
          className="w-4 h-4 text-green-600 rounded border-gray-300 focus:ring-green-500 cursor-pointer"
        />
        <label htmlFor={modalidade} className="text-sm font-medium text-gray-700 cursor-pointer">
          {modalidade}
        </label>
      </div>
      
      {/* O bloco que renderizava o Input de limite de horas foi completamente removido daqui */}
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
                disabled={!newCourseName.trim() || newHoras === ""}
              >
                Salvar Curso
              </Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
