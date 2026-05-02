//alt 2 de maio: página criada.
// todos os endpoints pra integração já foram criados, a bronca aparentemente agora é só ligar o caminho (linha 54) ao back do jeito certo
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { UserPlus, Search, Mail, Edit, Trash2, Users } from "lucide-react";
import { useState, useEffect } from "react";
import { api } from "../../services/api"; // Importando a ponte com o backend

// 1. Interface de dados do Aluno (Atualizada conforme o Backend)
interface Student {
  id: number;
  nome: string;
  email: string;
  perfil?: string;
  cursos: { id?: number; nome: string }[];
}

// 2. Lista de Cursos Disponíveis para uso nos selects
const CURSOS_DISPONIVEIS = [
  "Análise e Desenvolvimento de Sistemas",
  "Gestão de Tecnologia da Informação",
  "Redes de Computadores",
  "Ciência de Dados",
  "Segurança da Informação"
];

export function Estudantes() {
  // Estados de Filtro e Busca
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCourse, setFilterCourse] = useState("todos");

  // Estado para guardar os alunos vindos do banco de dados
  const [students, setStudents] = useState<Student[]>([]);

  // Estados do Modal Principal (Adicionar/Editar)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [nameInput, setNameInput] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [courseInput, setCourseInput] = useState("");

  // Estados para o Modal de Exclusão
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<number | null>(null);

  // --- GET: Buscar alunos no banco ao carregar a página ---
  const fetchStudents = async () => {
    try {
      console.log("Tentando buscar alunos...");
      const response = await api.get('/usuarios/alunos');
      console.log("Deu certo! O Java respondeu:", response.data);
      setStudents(response.data);
    } catch (error: any) {
      console.error("Deu erro na busca. Detalhes:", error);
      if (error.response) {
         console.error("Status do erro:", error.response.status); // Vai mostrar se é 401, 404, 500...
      }
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // --- Lógica de Edição ---
  const handleEditClick = (student: Student) => {
    setEditingStudent(student);
    setNameInput(student.nome);
    setEmailInput(student.email);
    // Pega o nome do primeiro curso associado ao aluno (se houver)
    setCourseInput(student.cursos && student.cursos.length > 0 ? student.cursos[0].nome : "");
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingStudent(null);
    setNameInput("");
    setEmailInput("");
    setCourseInput("");
  };

  // --- POST / PUT: Salvar Novo ou Editar ---
  const handleSaveStudent = async () => {
    if (!nameInput.trim() || !emailInput.trim() || !courseInput) {
      alert("Preencha todos os campos obrigatórios!");
      return;
    }

    try {
      const payload = {
        nome: nameInput,
        email: emailInput,
        perfil: "ALUNO",
        cursos: [{ nome: courseInput }] // Enviando o curso no formato de array de objetos que o Java espera
      };

      if (editingStudent) {
        // MODO EDIÇÃO (Atualizar aluno existente)
        await api.put(`/usuarios/alunos/${editingStudent.id}`, payload);
      } else {
        // MODO CRIAÇÃO (Criar aluno novo)
        await api.post('/usuarios/alunos', payload);
      }

      handleCloseModal();
      fetchStudents(); // Recarrega a lista do banco de dados
    } catch (error) {
      console.error("Erro ao salvar:", error);
      alert("Erro ao salvar o estudante. Verifique a conexão com o servidor.");
    }
  };

  // --- DELETE: Confirmar e Excluir ---
  const confirmDelete = (id: number) => {
    setStudentToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteStudent = async () => {
    if (studentToDelete) {
      try {
        await api.delete(`/usuarios/alunos/${studentToDelete}`);
        setIsDeleteDialogOpen(false);
        setStudentToDelete(null);
        fetchStudents(); // Atualiza a lista após deletar
      } catch (error) {
        console.error("Erro ao excluir:", error);
        alert("Erro ao excluir o estudante.");
      }
    }
  };

  // --- Lógica de Filtragem ---
  const filteredStudents = students.filter((student) => {
    const matchesSearch = student.nome.toLowerCase().includes(searchTerm.toLowerCase());
    // Verifica se o curso existe dentro do array de cursos do aluno
    const matchesCourse = filterCourse === "todos" || student.cursos.some(c => c.nome === filterCourse);
    return matchesSearch && matchesCourse;
  });

  return (
    <div className="space-y-6">
      {/* --- CABEÇALHO E BOTÃO NOVO ALUNO --- */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl mb-2 text-[#002868]" style={{ fontFamily: 'Arvo, serif' }}>Estudantes</h1>
          <p className="text-gray-600">Gerencie os alunos da instituição</p>
        </div>
        
        <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
          <Button 
            onClick={() => { handleCloseModal(); setIsModalOpen(true); }}
            style={{ backgroundColor: "#FF9414" }} 
            className="text-white hover:opacity-90"
          >
            <UserPlus className="size-4 mr-2" />
            Novo Estudante
          </Button>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-[#002868] font-bold" style={{ fontFamily: 'Arvo, serif' }}>
                {editingStudent ? "Editar informações do estudante" : "Adicionar Novo Estudante"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome Completo</Label>
                  <Input 
                    id="name" 
                    placeholder="Digite o nome do aluno" 
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                  />
                </div>
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
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="course">Curso Matriculado</Label>
                  <Select value={courseInput} onValueChange={setCourseInput}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o curso" />
                    </SelectTrigger>
                    <SelectContent>
                      {CURSOS_DISPONIVEIS.map((curso) => (
                        <SelectItem key={`form-${curso}`} value={curso}>{curso}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" onClick={handleCloseModal}>Cancelar</Button>
                <Button onClick={handleSaveStudent} style={{ backgroundColor: "#FF9414" }} className="text-white">
                  Salvar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* --- BARRA DE BUSCA E FILTROS --- */}
      <Card>
        <CardContent className="py-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
              <Input
                placeholder="Buscar aluno por nome..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={filterCourse} onValueChange={setFilterCourse}>
              <SelectTrigger className="w-full md:w-80">
                <SelectValue placeholder="Filtrar por curso" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os cursos</SelectItem>
                {CURSOS_DISPONIVEIS.map((curso) => (
                  <SelectItem key={`filter-${curso}`} value={curso}>{curso}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* --- GRID DE ESTUDANTES --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
        {filteredStudents.map((student) => (
          <Card key={student.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg mb-2">{student.nome}</CardTitle>
                  <p className="text-sm whitespace-pre-line" style={{ color: "#0051A2" }}>
                    {/* Renderiza os cursos linha por linha */}
                    {student.cursos.map(c => c.nome).join("\n")}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="size-8"
                    onClick={() => handleEditClick(student)}
                  >
                    <Edit className="size-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="size-8 text-red-600 hover:text-red-700"
                    onClick={() => confirmDelete(student.id)}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Mail className="size-4" />
                {student.email}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* --- MODAL DE CONFIRMAÇÃO DE EXCLUSÃO --- */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-[#002868] font-bold text-xl" style={{ fontFamily: 'Arvo, serif' }}>
              Confirmar Exclusão
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-gray-600">Deseja realmente excluir o registro do aluno?</p>
          </div>
          <div className="flex justify-end gap-3 pt-2 border-t mt-2">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Não
            </Button>
            <Button className="bg-red-600 hover:bg-red-700 text-white" onClick={handleDeleteStudent}>
              Sim
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* --- TELA VAZIA --- */}
      {filteredStudents.length === 0 && (
        <Card className="border-dashed border-2 bg-transparent shadow-none">
          <CardContent className="py-12 text-center">
            <Users className="size-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium mb-2 text-[#002868]" style={{ fontFamily: 'Arvo, serif' }}>
              Nenhum estudante encontrado
            </h3>
            <p className="text-gray-600">
              {students.length === 0 
                ? "O banco de dados de alunos está vazio no momento. Adicione alunos para vê-los aqui." 
                : "Não há alunos que correspondam a essa busca."}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
