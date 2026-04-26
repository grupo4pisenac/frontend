import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { GraduationCap, Users, BookOpen, TrendingUp } from "lucide-react";

export function GerenciarCursos() {
  const courses = [
    {
      name: "Engenharia da Computação",
      code: "ENG-COMP",
      students: 145,
      totalHours: 2450,
      avgApprovalRate: 89,
    },
    {
      name: "Sistemas de Informação",
      code: "SIS-INF",
      students: 132,
      totalHours: 2180,
      avgApprovalRate: 85,
    },
    {
      name: "Ciência da Computação",
      code: "CIC-COMP",
      students: 118,
      totalHours: 1980,
      avgApprovalRate: 92,
    },
    {
      name: "Engenharia de Software",
      code: "ENG-SOFT",
      students: 92,
      totalHours: 1620,
      avgApprovalRate: 88,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl text-gray-900 mb-2">Gerenciar Cursos</h2>
          <p className="text-sm text-gray-600">
            Visualize e gerencie informações dos cursos cadastrados
          </p>
        </div>
        <Button className="bg-[#ff6b35] hover:bg-[#ff6b35]/90 text-white">
          <GraduationCap className="w-4 h-4 mr-2" />
          Adicionar Curso
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#0f3460] flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total de Cursos</p>
              <p className="text-2xl text-gray-900">{courses.length}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#ff6b35] flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total de Alunos</p>
              <p className="text-2xl text-gray-900">
                {courses.reduce((sum, course) => sum + course.students, 0)}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-600 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Horas Validadas</p>
              <p className="text-2xl text-gray-900">
                {courses.reduce((sum, course) => sum + course.totalHours, 0)}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-600 flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Taxa Média</p>
              <p className="text-2xl text-gray-900">
                {Math.round(
                  courses.reduce((sum, course) => sum + course.avgApprovalRate, 0) /
                    courses.length
                )}
                %
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Search */}
      <Card className="p-4">
        <Input placeholder="Buscar curso por nome ou código..." className="max-w-md" />
      </Card>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {courses.map((course, index) => (
          <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#0f3460] to-[#ff6b35] flex items-center justify-center">
                  <GraduationCap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg text-gray-900">{course.name}</h3>
                  <p className="text-sm text-gray-600">{course.code}</p>
                </div>
              </div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs bg-green-100 text-green-800">
                Ativo
              </span>
            </div>

            <div className="grid grid-cols-3 gap-4 py-4 border-t border-gray-100">
              <div>
                <p className="text-xs text-gray-600 mb-1">Alunos</p>
                <p className="text-xl text-gray-900">{course.students}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">Horas Totais</p>
                <p className="text-xl text-gray-900">{course.totalHours}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">Taxa</p>
                <p className="text-xl text-gray-900">{course.avgApprovalRate}%</p>
              </div>
            </div>

            <div className="flex gap-2 pt-4 border-t border-gray-100">
              <Button size="sm" className="flex-1 bg-[#ff6b35] hover:bg-[#ff6b35]/90 text-white">
                Ver Detalhes
              </Button>
              <Button size="sm" variant="outline" className="flex-1">
                Editar
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
