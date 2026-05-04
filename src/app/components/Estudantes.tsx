import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { UserPlus, Search, Mail, Edit, Trash2, Users } from "lucide-react";
import { useState, useEffect } from "react";
import { api } from "../../services/api";

// ─── Tipos alinhados com UsuarioResponse.java ─────────────────────────────────

interface CursoResumo {
  id: number;
  nome: string;
}

interface Student {
  id: number;
  nome: string;
  email: string;
  perfil?: string;
  cursos: CursoResumo[];
}

// ─── Componente ───────────────────────────────────────────────────────────────

export function Estudantes() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCursoId, setFilterCursoId] = useState("todos");

  // Dados do banco
  const [students, setStudents] = useState<Student[]>([]);
  const [cursos, setCursos] = useState<CursoResumo[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal principal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [nameInput, setNameInput] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [senhaInput, setSenhaInput] = useState("");
  const [selectedCursoId, setSelectedCursoId] = useState<number | "">("");

  // Modal de exclusão
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<number | null>(null);

  // ── Buscar alunos ────────────────────────────────────────────────────────────

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await api.get('/usuarios/alunos');
      setStudents(response.data);
    } catch (error: any) {
      console.error("Erro ao buscar alunos:", error);
    } finally {
      setLoading(false);
    }
  };

  // ── Buscar cursos para o select ──────────────────────────────────────────────

  const fetchCursos = async () => {
    try {
      const response = await api.get('/cursos');
      setCursos(response.data);
    } catch (error) {
      console.error("Erro ao buscar cursos:", error);
    }
  };

  useEffect(() => {
    fetchStudents();
    fetchCursos();
  }, []);

  // ── Filtro de busca ──────────────────────────────────────────────────────────

  const filteredStudents = students.filter((student) => {
    const matchesSearch = student.nome.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCourse =
      filterCursoId === "todos" ||
      student.cursos.some(c => String(c.id) === filterCursoId);
    return matchesSearch && matchesCourse;
  });

  // ── Salvar (Criar ou Editar) ─────────────────────────────────────────────────

  const handleSaveStudent = async () => {
    if (!nameInput.trim() || !emailInput.trim() || selectedCursoId === "") {
      alert("Preencha todos os campos obrigatórios!");
      return;
    }
    if (!editingStudent && !senhaInput.trim()) {
      alert("A senha é obrigatória para novos estudantes.");
      return;
    }

    // Payload alinhado com UsuarioRequest.java
    const payload: any = {
      nome: nameInput.trim(),
      email: emailInput.trim(),
      perfil: "ALUNO",
      cursoIds: [Number(selectedCursoId)],
    };

    if (senhaInput.trim()) {
      payload.senha = senhaInput.trim();
    }

    try {
      if (editingStudent) {
        await api.put(`/usuarios/${editingStudent.id}`, payload);
        alert("Estudante atualizado com sucesso!");
      } else {
        await api.post('/usuarios', payload);
        alert("Estudante criado com sucesso!");
      }

      handleCloseModal();
      fetchStudents();
    } catch (error: any) {
      console.error("Erro ao salvar:", error);
      const mensagem = error?.response?.data?.message || "Erro ao salvar o estudante.";
      alert(mensagem);
    }
  };

  // ── Editar ───────────────────────────────────────────────────────────────────

  const handleEditClick = (student: Student) => {
    setEditingStudent(student);
    setNameInput(student.nome);
    setEmailInput(student.email);
    setSenhaInput("");
    setSelectedCursoId(student.cursos && student.cursos.length > 0 ? student.cursos[0].id : "");
    setIsModalOpen(true);
  };

  // ── Fechar modal ─────────────────────────────────────────────────────────────

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingStudent(null);
    setNameInput("");
    setEmailInput("");
    setSenhaInput("");
    setSelectedCursoId("");
  };

  // ── Deletar ──────────────────────────────────────────────────────────────────

  const confirmDelete = (id: number) => {
    setStudentToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteStudent = async () => {
    if (!studentToDelete) return;
    try {
      await api.delete(`/usuarios/${studentToDelete}`);
      setIsDeleteDialogOpen(false);
      setStudentToDelete(null);
      fetchStudents();
    } catch (error: any) {
      const mensagem = error?.response?.data?.message || "Erro ao excluir o estudante.";
      alert(mensagem);
    }
  };

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6">

      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl mb-2 text-[#002868]" style={{ fontFamily: 'Arvo, serif' }}>
            Estudantes
          </h1>
          <p className="text-gray-600">Gerencie os alunos da instituição</p>
        </div>
        <Button
          onClick={() => { handleCloseModal(); setIsModalOpen(true); }}
          style={{ backgroundColor: "#FF9414" }}
          className="text-white hover:opacity-90"
        >
          <UserPlus className="size-4 mr-2" />
          Novo Estudante
        </Button>
      </div>

      {/* Busca e Filtro */}
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
            <Select value={filterCursoId} onValueChange={setFilterCursoId}>
              <SelectTrigger className="w-full md:w-80">
                <SelectValue placeholder="Filtrar por curso" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os cursos</SelectItem>
                {cursos.map((curso) => (
                  <SelectItem key={curso.id} value={String(curso.id)}>
                    {curso.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Estudantes */}
      {loading ? (
        <p className="text-sm text-gray-500 text-center py-8">Carregando estudantes...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredStudents.map((student) => (
            <Card key={student.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg mb-1">{student.nome}</CardTitle>
                    <p className="text-xs text-gray-400 mb-1">ID: {student.id}</p>
                    <p className="text-sm" style={{ color: "#0051A2" }}>
                      {student.cursos && student.cursos.length > 0
                        ? student.cursos.map(c => c.nome).join("; ")
                        : "Sem curso atribuído"}
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
              <CardContent>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail className="size-4" />
                  {student.email}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Tela vazia */}
      {!loading && filteredStudents.length === 0 && (
        <Card className="border-dashed border-2 bg-transparent shadow-none">
          <CardContent className="py-12 text-center">
            <Users className="size-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium mb-2 text-[#002868]" style={{ fontFamily: 'Arvo, serif' }}>
              Nenhum estudante encontrado
            </h3>
            <p className="text-gray-600">
              {students.length === 0
                ? "O banco de dados de alunos está vazio. Adicione alunos para vê-los aqui."
                : "Não há alunos que correspondam a essa busca."}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Modal — Criar / Editar */}
      <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-[#002868] font-bold" style={{ fontFamily: 'Arvo, serif' }}>
              {editingStudent ? "Editar informações do estudante" : "Adicionar Novo Estudante"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              {/* ID — apenas no modo edição */}
              {editingStudent && (
                <div className="space-y-2 md:col-span-2">
                  <Label>ID do Estudante</Label>
                  <Input
                    value={editingStudent.id}
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
                  placeholder="Digite o nome do aluno"
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
                  {editingStudent && (
                    <span className="text-gray-400 font-normal">(deixe em branco para manter a atual)</span>
                  )}
                </Label>
                <Input
                  id="senha"
                  type="password"
                  placeholder={editingStudent ? "••••••••" : "Digite a senha"}
                  value={senhaInput}
                  onChange={(e) => setSenhaInput(e.target.value)}
                />
              </div>

              {/* Curso — populado do banco */}
              <div className="space-y-2 md:col-span-2">
                <Label>Curso Matriculado</Label>
                <Select
                  value={selectedCursoId === "" ? "" : String(selectedCursoId)}
                  onValueChange={(val) => setSelectedCursoId(Number(val))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o curso" />
                  </SelectTrigger>
                  <SelectContent>
                    {cursos.map((curso) => (
                      <SelectItem key={curso.id} value={String(curso.id)}>
                        {curso.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={handleCloseModal}>Cancelar</Button>
              <Button
                onClick={handleSaveStudent}
                style={{ backgroundColor: "#FF9414" }}
                className="text-white"
                disabled={!nameInput.trim() || !emailInput.trim() || selectedCursoId === ""}
              >
                Salvar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de confirmação de exclusão */}
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

    </div>
  );
}