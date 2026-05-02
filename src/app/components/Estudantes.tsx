// alt 2 de maio: página criada
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { UserPlus, Search, Mail, Edit, Trash2, Users } from "lucide-react";
import { useState } from "react";

// 1. Interface de dados do Aluno
interface Student {
  id: number;
  name: string;
  email: string;
  course: string;
}

// 2. Array vazio - você vai povoar depois
const mockStudents: Student[] = [];

// 3. Lista de Cursos Disponíveis para uso nos selects
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

  // Estados do Modal e Formulário
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [nameInput, setNameInput] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [courseInput, setCourseInput] = useState("");

  // Função para abrir modal de edição pré-preenchido
  const handleEditClick = (student: Student) => {
    setEditingStudent(student);
    setNameInput(student.name);
    setEmailInput(student.email);
    setCourseInput(student.course);
    setIsModalOpen(true);
  };

  // Função para fechar e limpar modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingStudent(null);
    setNameInput("");
    setEmailInput("");
    setCourseInput("");
  };

  // Lógica para filtrar a lista combinando busca por nome E filtro de curso
  const filteredStudents = mockStudents.filter((student) => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCourse = filterCourse === "todos" || student.course === filterCourse;
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
                <Button style={{ backgroundColor: "#FF9414" }} className="text-white">
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
            
            {/* Filtro Dropdown para os Cursos */}
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
                  <CardTitle className="text-lg mb-2">{student.name}</CardTitle>
                  <p className="text-sm" style={{ color: "#0051A2" }}>
                    {student.course}
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
                  <Button variant="ghost" size="icon" className="size-8 text-red-600 hover:text-red-700">
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

      {/* --- TELA VAZIA --- */}
      {filteredStudents.length === 0 && (
        <Card className="border-dashed border-2 bg-transparent shadow-none">
          <CardContent className="py-12 text-center">
            <Users className="size-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium mb-2 text-[#002868]" style={{ fontFamily: 'Arvo, serif' }}>
              Nenhum estudante encontrado
            </h3>
            <p className="text-gray-600">
              {mockStudents.length === 0 
                ? "O banco de dados de alunos está vazio no momento. Adicione alunos para vê-los aqui." 
                : "Não há alunos que correspondam a essa busca."}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}