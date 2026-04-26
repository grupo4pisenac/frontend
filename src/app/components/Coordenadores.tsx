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
  phone: string;
  course: string;
  campus: string;
  students: number;
}

const mockCoordinators: Coordinator[] = [
  {
    id: 1,
    name: "Prof. Ana Paula Santos",
    email: "ana.santos@senac.br",
    phone: "(11) 98765-4321",
    course: "Análise e Desenvolvimento de Sistemas",
    campus: "Senac Lapa Tito",
    students: 245,
  },
  {
    id: 2,
    name: "Prof. Carlos Eduardo Lima",
    email: "carlos.lima@senac.br",
    phone: "(11) 97654-3210",
    course: "Gestão de Recursos Humanos",
    campus: "Senac Santo Amaro",
    students: 180,
  },
  {
    id: 3,
    name: "Prof. Marina Oliveira",
    email: "marina.oliveira@senac.br",
    phone: "(11) 96543-2109",
    course: "Marketing Digital",
    campus: "Senac Lapa Scipião",
    students: 312,
  },
  {
    id: 4,
    name: "Prof. Roberto Almeida",
    email: "roberto.almeida@senac.br",
    phone: "(11) 95432-1098",
    course: "Administração",
    campus: "Senac Penha",
    students: 198,
  },
];

export function Coordenadores() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCampus, setSelectedCampus] = useState("all");

  const filteredCoordinators = mockCoordinators.filter((coord) => {
    const matchesSearch =
      coord.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coord.course.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCampus = selectedCampus === "all" || coord.campus === selectedCampus;
    return matchesSearch && matchesCampus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl mb-2">Coordenadores</h1>
          <p className="text-gray-600">Gerencie os coordenadores de curso</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button style={{ backgroundColor: "#FF9414" }} className="text-white hover:opacity-90">
              <UserPlus className="size-4" />
              Novo Coordenador
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Adicionar Novo Coordenador</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome Completo</Label>
                  <Input id="name" placeholder="Digite o nome" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input id="email" type="email" placeholder="email@senac.br" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <Input id="phone" placeholder="(11) 98765-4321" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="campus">Campus</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o campus" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="lapa-tito">Senac Lapa Tito</SelectItem>
                      <SelectItem value="santo-amaro">Senac Santo Amaro</SelectItem>
                      <SelectItem value="lapa-scipiao">Senac Lapa Scipião</SelectItem>
                      <SelectItem value="penha">Senac Penha</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="course">Curso</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o curso" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ads">Análise e Desenvolvimento de Sistemas</SelectItem>
                      <SelectItem value="rh">Gestão de Recursos Humanos</SelectItem>
                      <SelectItem value="marketing">Marketing Digital</SelectItem>
                      <SelectItem value="adm">Administração</SelectItem>
                    </SelectContent>
                  </Select>
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
            <Select value={selectedCampus} onValueChange={setSelectedCampus}>
              <SelectTrigger className="w-full md:w-64">
                <SelectValue placeholder="Todos os campus" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os campus</SelectItem>
                <SelectItem value="Senac Lapa Tito">Senac Lapa Tito</SelectItem>
                <SelectItem value="Senac Santo Amaro">Senac Santo Amaro</SelectItem>
                <SelectItem value="Senac Lapa Scipião">Senac Lapa Scipião</SelectItem>
                <SelectItem value="Senac Penha">Senac Penha</SelectItem>
              </SelectContent>
            </Select>
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
                  <Button variant="ghost" size="icon" className="size-8">
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
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Phone className="size-4" />
                {coordinator.phone}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="size-4" />
                {coordinator.campus}
              </div>
              <div className="flex items-center justify-between pt-3 border-t">
                <div className="flex items-center gap-2 text-sm">
                  <Users className="size-4" style={{ color: "#0051A2" }} />
                  <span className="font-medium">{coordinator.students} alunos</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  style={{ borderColor: "#0051A2", color: "#0051A2" }}
                  className="hover:bg-blue-50"
                >
                  Ver Detalhes
                </Button>
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
