// O que foi feito nessa alteração (1 de maio): excluidos os dados de telefone, campus e estudantes dos cards e do formulário de preenchimento, botão "ver detalhes" dos cards
// alteração da seleção do curso de lista onde se escolhe apenas um para checklist onde podemos inserir mais de um curso por coordenador
// atualização dos dados dos cards para os dos professores que já estão nos bancos de dados (só falta fazer a integração para puxar certo)
// criação do box "editar coordenador" (integrar esse pra dar update e o de novo coordenador pra create)
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { UserPlus, Search, Mail, Phone, MapPin, Edit, Trash2, Users } from "lucide-react";
import { useState } from "react";

interface Coordinator {
  id: number;
  name: string;
  email: string;
  course: string;
}

const mockCoordinators: Coordinator[] = [
  {
    id: 1,
    name: "Carlos Mendes",
    email: "carlos.mendes@senac.com",
    course: "Análise e Desenvolvimento de Sistemas",
  },
  {
    id: 2,
    name: "Fernanda Lima",
    email: "fernanda.lima@senac.com",
    course: "Gestão de Tecnologia da informação",
  },
  {
    id: 3,
    name: "Ricardo Souza",
    email: "ricardo.souza@senac.com",
    course: "Redes de Computadores; Ciência de Dados",
  },
  {
    id: 4,
    name: "Patrícia Oliveira",
    email: "patricia.oliveira@senac.com",
    course: "Segurança da Informação",
  },
];

export function Coordenadores() {
  const [searchTerm, setSearchTerm] = useState("");
const [selectedCourses, setSelectedCourses] = useState<string[]>([]);

const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoordinator, setEditingCoordinator] = useState<Coordinator | null>(null);
  const [nameInput, setNameInput] = useState("");
  const [emailInput, setEmailInput] = useState("");

  const handleEditClick = (coordinator: Coordinator) => {
    setEditingCoordinator(coordinator);
    setNameInput(coordinator.name);
    setEmailInput(coordinator.email);
    
    // Transforma a string "Redes de Computadores; Ciência de Dados" de volta em array
    if (coordinator.course) {
      const cursosArray = coordinator.course
        .split(";")
        .map(c => c.trim())
        .filter(c => c.length > 0);
      setSelectedCourses(cursosArray);
    } else {
      setSelectedCourses([]);
    }
    
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCoordinator(null);
    setNameInput("");
    setEmailInput("");
    setSelectedCourses([]);
  };
  
  const CURSOS_DISPONIVEIS = [
    "Análise e Desenvolvimento de Sistemas",
    "Gestão de Tecnologia da Informação",
    "Redes de Computadores",
    "Ciência de Dados",
    "Segurança da Informação"
  ];
  const filteredCoordinators = mockCoordinators.filter((coord) => {
  return (
    coord.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    coord.course.toLowerCase().includes(searchTerm.toLowerCase())
  );
});

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl mb-2">Coordenadores</h1>
          <p className="text-gray-600">Gerencie os coordenadores de curso</p>
        </div>
        <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
          <Button 
            onClick={() => { handleCloseModal(); setIsModalOpen(true); }}
            style={{ backgroundColor: "#FF9414" }} 
            className="text-white hover:opacity-90"
          >
            <UserPlus className="size-4" />
            Novo Coordenador
          </Button>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingCoordinator ? "Editar as informações do coordenador" : "Adicionar Novo Coordenador"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome Completo</Label>
                  <Input 
                    id="name" 
                    placeholder="Digite o nome" 
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
                  <Label>Cursos Coordenados</Label>
                  <div className="grid grid-cols-1 gap-3 border rounded-md p-3 bg-gray-50 max-h-48 overflow-y-auto">
                    {CURSOS_DISPONIVEIS.map((curso) => {
                      const isSelected = selectedCourses.includes(curso);

                      return (
                        <div key={curso} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={curso}
                            checked={isSelected}
                            onChange={(e) => {
                              if (e.target.checked) {
                                // Se marcou, adiciona o curso à lista
                                setSelectedCourses([...selectedCourses, curso]);
                              } else {
                                // Se desmarcou, remove o curso da lista
                                setSelectedCourses(selectedCourses.filter(item => item !== curso));
                              }
                            }}
                            className="w-4 h-4 text-[#FF9414] rounded border-gray-300 focus:ring-[#FF9414] cursor-pointer"
                          />
                          <label htmlFor={curso} className="text-sm font-medium text-gray-700 cursor-pointer">
                            {curso}
                          </label>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline">Cancelar</Button>
                <Button style={{ backgroundColor: "#FF9414" }} className="text-white">
                  Salvar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="py-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
              <Input
                placeholder="Buscar por nome ou curso..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Coordinators Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
        {filteredCoordinators.map((coordinator) => (
          <Card key={coordinator.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg mb-2">{coordinator.name}</CardTitle>
                  <p className="text-sm" style={{ color: "#0051A2" }}>
                    {coordinator.course}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="size-8"
                    onClick={() => handleEditClick(coordinator)}
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
                {coordinator.email}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCoordinators.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Users className="size-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium mb-2">Nenhum coordenador encontrado</h3>
            <p className="text-gray-600">Tente ajustar os filtros de busca</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
