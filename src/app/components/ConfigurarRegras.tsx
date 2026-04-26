import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Settings, Plus, Trash2, Save } from "lucide-react";
import { useState } from "react";

interface Rule {
  id: number;
  course: string;
  area: string;
  maxHours: number;
}

export function ConfigurarRegras() {
  const [rules, setRules] = useState<Rule[]>([
    { id: 1, course: "Engenharia da Computação", area: "Pesquisa", maxHours: 100 },
    { id: 2, course: "Engenharia da Computação", area: "Extensão", maxHours: 80 },
    { id: 3, course: "Engenharia da Computação", area: "Cultura", maxHours: 40 },
    { id: 4, course: "Sistemas de Informação", area: "Pesquisa", maxHours: 90 },
    { id: 5, course: "Sistemas de Informação", area: "Extensão", maxHours: 70 },
    { id: 6, course: "Ciência da Computação", area: "Pesquisa", maxHours: 100 },
  ]);

  const [newRule, setNewRule] = useState({
    course: "",
    area: "",
    maxHours: "",
  });

  const courses = [
    "Engenharia da Computação",
    "Sistemas de Informação",
    "Ciência da Computação",
    "Engenharia de Software",
  ];

  const areas = ["Pesquisa", "Extensão", "Cultura", "Eventos", "Monitoria"];

  const handleAddRule = () => {
    if (newRule.course && newRule.area && newRule.maxHours) {
      const rule: Rule = {
        id: Date.now(),
        course: newRule.course,
        area: newRule.area,
        maxHours: parseInt(newRule.maxHours),
      };
      setRules([...rules, rule]);
      setNewRule({ course: "", area: "", maxHours: "" });
    }
  };

  const handleDeleteRule = (id: number) => {
    setRules(rules.filter((rule) => rule.id !== id));
  };

  const handleSaveRules = () => {
    // In a real app, this would save to a backend
    alert("Regras salvas com sucesso!");
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="text-2xl text-gray-900 mb-2">Configurar Regras</h2>
        <p className="text-sm text-gray-600">
          Defina os limites de horas complementares por área e curso
        </p>
      </div>

      {/* Add New Rule Card */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <Settings className="w-5 h-5 text-[#0f3460]" />
          <h3 className="text-lg text-gray-900">Adicionar Nova Regra</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="course">Curso</Label>
            <Select value={newRule.course} onValueChange={(value) => setNewRule({ ...newRule, course: value })}>
              <SelectTrigger id="course">
                <SelectValue placeholder="Selecione o curso" />
              </SelectTrigger>
              <SelectContent>
                {courses.map((course) => (
                  <SelectItem key={course} value={course}>
                    {course}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="area">Nome da Área</Label>
            <Select value={newRule.area} onValueChange={(value) => setNewRule({ ...newRule, area: value })}>
              <SelectTrigger id="area">
                <SelectValue placeholder="Selecione a área" />
              </SelectTrigger>
              <SelectContent>
                {areas.map((area) => (
                  <SelectItem key={area} value={area}>
                    {area}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="maxHours">Limite Máximo de Horas</Label>
            <Input
              id="maxHours"
              type="number"
              placeholder="Ex: 100"
              value={newRule.maxHours}
              onChange={(e) => setNewRule({ ...newRule, maxHours: e.target.value })}
            />
          </div>
        </div>

        <Button
          onClick={handleAddRule}
          className="mt-4 bg-[#ff6b35] hover:bg-[#ff6b35]/90 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Adicionar Regra
        </Button>
      </Card>

      {/* Current Rules */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg text-gray-900">Regras Configuradas</h3>
          <Button
            onClick={handleSaveRules}
            className="bg-[#0f3460] hover:bg-[#0f3460]/90 text-white"
          >
            <Save className="w-4 h-4 mr-2" />
            Salvar Regras
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr className="border-b border-gray-200">
                <th className="text-left py-4 px-6 text-sm text-gray-600">Curso</th>
                <th className="text-left py-4 px-6 text-sm text-gray-600">Área</th>
                <th className="text-left py-4 px-6 text-sm text-gray-600">Limite Máximo</th>
                <th className="text-left py-4 px-6 text-sm text-gray-600">Ações</th>
              </tr>
            </thead>
            <tbody>
              {rules.map((rule) => (
                <tr key={rule.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-6 text-sm text-gray-900">{rule.course}</td>
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs bg-[#0f3460] text-white">
                      {rule.area}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-900">{rule.maxHours} horas</td>
                  <td className="py-4 px-6">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDeleteRule(rule.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {rules.length === 0 && (
          <div className="text-center py-12">
            <Settings className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Nenhuma regra configurada</p>
          </div>
        )}
      </Card>

      {/* Info Card */}
      <Card className="p-6 bg-blue-50 border-blue-200">
        <div className="flex gap-3">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 rounded-full bg-[#0f3460] flex items-center justify-center">
              <Settings className="w-5 h-5 text-white" />
            </div>
          </div>
          <div>
            <h4 className="text-sm text-gray-900 mb-1">Informações Importantes</h4>
            <p className="text-sm text-gray-600">
              As regras configuradas definem o número máximo de horas que podem ser validadas
              para cada área de atividade complementar por curso. Os alunos podem submeter
              atividades, mas o sistema validará apenas até o limite estabelecido.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
