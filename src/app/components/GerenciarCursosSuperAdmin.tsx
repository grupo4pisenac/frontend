import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Plus, Search, Edit, Trash2, MoreVertical } from "lucide-react";
import { useState } from "react";

export function GerenciarCursosSuperAdmin() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCourseName, setNewCourseName] = useState("");
  const [courses, setCourses] = useState([
    { id: 1, name: "Engenharia da Computação" },
    { id: 2, name: "Sistemas de Informação" },
    { id: 3, name: "Administração" },
    { id: 4, name: "Ciência da Computação" },
    { id: 5, name: "Engenharia de Software" },
    { id: 6, name: "Marketing Digital" },
    { id: 7, name: "Design Gráfico" },
    { id: 8, name: "Gestão de RH" },
  ]);

  const filteredCourses = courses.filter((course) =>
    course.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSaveCourse = () => {
    if (newCourseName.trim()) {
      const newCourse = {
        id: courses.length + 1,
        name: newCourseName.trim(),
      };
      setCourses([...courses, newCourse]);
      setNewCourseName("");
      setIsModalOpen(false);
    }
  };

  const handleDeleteCourse = (id: number) => {
    setCourses(courses.filter(course => course.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
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
          onClick={() => setIsModalOpen(true)}
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Novo Curso
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <Input
          placeholder="Pesquisar cursos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-11 bg-white border-gray-300"
        />
      </div>

      {/* Courses Table */}
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
            {filteredCourses.map((course, index) => (
              <tr
                key={course.id}
                className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                  index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                }`}
              >
                <td className="py-4 px-6">
                  <p className="text-base text-gray-900 font-semibold">{course.name}</p>
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

        {filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Nenhum curso encontrado</p>
          </div>
        )}
      </div>

      {/* Add Course Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-xl text-[#002868]" style={{ fontFamily: 'Arvo, serif' }}>
              Adicionar Novo Curso
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input
              placeholder="Ex: Análise e Desenvolvimento de Sistemas"
              value={newCourseName}
              onChange={(e) => setNewCourseName(e.target.value)}
              className="bg-white"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSaveCourse();
                }
              }}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsModalOpen(false);
                setNewCourseName("");
              }}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSaveCourse}
              className="bg-green-600 hover:bg-green-700 text-white"
              disabled={!newCourseName.trim()}
            >
              Salvar Curso
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
