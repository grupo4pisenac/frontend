import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter} from "./ui/dialog";
import { Settings, Plus, Trash2, Save, Info,Pencil, X} from "lucide-react";
import { useState } from "react";



interface Rule {
  id: number;
  category: string;
  semesterLimit: number;
  description: string;
}

export function ConfigurarRegrasSuperAdmin() {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // Mudei de isModalOpen para isEditModalOpen
  const [editingRule, setEditingRule] = useState<Rule | null>(null);
  const [rules, setRules] = useState<Rule[]>([
    { id: 1, category: "Pesquisa", semesterLimit: 100, description: "Participação em projetos de pesquisa científica" },
    { id: 2, category: "Extensão", semesterLimit: 80, description: "Atividades de extensão universitária" },
    { id: 3, category: "Cultura", semesterLimit: 60, description: "Eventos e atividades culturais" },
    { id: 4, category: "Esportes", semesterLimit: 40, description: "Participação em atividades esportivas" },
    { id: 5, category: "Monitoria", semesterLimit: 50, description: "Monitoria acadêmica" },
    { id: 6, category: "Eventos Científicos", semesterLimit: 70, description: "Congressos, seminários e conferências" },
  ]);

  const [newRule, setNewRule] = useState({
    category: "",
    semesterLimit: "",
    description: "",
  });

  const [editingId, setEditingId] = useState<number | null>(null);
  // para controlar se estamos editando ou criando.

  //att a handleAddRule para suportar edição
  // 1. Limpamos a handleAddRule (só cria agora)
  const handleAddRule = () => {
    if (newRule.category && newRule.semesterLimit) {
      const rule: Rule = {
        id: Date.now(),
        category: newRule.category,
        semesterLimit: parseInt(newRule.semesterLimit),
        description: newRule.description,
      };
      setRules([...rules, rule]);
      setNewRule({ category: "", semesterLimit: "", description: "" });
    }
  };

  const handleEditRule = (rule: Rule) => {
    setEditingRule({ ...rule });
    setIsEditModalOpen(true);
  };

// 2. Salva as alterações feitas no Modal
  const handleUpdateRule = () => {
    if (editingRule) {
      setRules(rules.map(r => r.id === editingRule.id ? editingRule : r));
      setIsEditModalOpen(false);
      setEditingRule(null);
    }
  };



  const handleDeleteRule = (id: number) => {
    setRules(rules.filter((rule) => rule.id !== id));
  };

  const handleSaveRules = () => {
    alert("Regras globais salvas com sucesso!");
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="text-2xl text-[#002868] mb-2" style={{ fontFamily: 'Arvo, serif' }}>
          Configurar Regras Globais
        </h2>
        <p className="text-sm text-gray-600">
          Defina limites e regras aplicáveis a todo o sistema
        </p>
      </div>

      {/* Info Banner */}
      <Card className="p-5 bg-blue-50 border-blue-200">
        <div className="flex gap-3">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 rounded-full bg-[#0051A2] flex items-center justify-center">
              <Info className="w-5 h-5 text-white" />
            </div>
          </div>
          <div>
            <h4 className="text-sm text-[#002868] mb-1" style={{ fontFamily: 'Arvo, serif' }}>
              Importante
            </h4>
            <p className="text-sm text-gray-700">
              As regras configuradas aqui serão aplicadas globalmente a todos os cursos do sistema.
              Coordenadores podem definir limites mais restritivos, mas não mais permissivos do que
              os valores estabelecidos aqui.
            </p>
          </div>
        </div>
      </Card>

      {/* Add New Rule Form */}
      <Card className="p-6 bg-white">
        <div className="flex items-center gap-2 mb-6">
          <Settings className="w-5 h-5 text-[#002868]" />
          <h3 className="text-lg text-[#002868]" style={{ fontFamily: 'Arvo, serif' }}>
            Adicionar Nova Categoria
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="space-y-2">
            <Label htmlFor="category" className="text-[#002868]">
              Nome da Categoria
            </Label>
            <Input
              id="category"
              placeholder="Ex: Pesquisa, Extensão..."
              value={newRule.category}
              onChange={(e) => setNewRule({ ...newRule, category: e.target.value })}
              className="bg-white border-gray-200"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="semesterLimit" className="text-[#002868]">
              Limite Semestral de Horas
            </Label>
            <Input
              id="semesterLimit"
              type="number"
              placeholder="Ex: 100"
              value={newRule.semesterLimit}
              onChange={(e) => setNewRule({ ...newRule, semesterLimit: e.target.value })}
              className="bg-white border-gray-200"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-[#002868]">
              Descrição (Opcional)
            </Label>
            <Input
              id="description"
              placeholder="Breve descrição da categoria"
              value={newRule.description}
              onChange={(e) => setNewRule({ ...newRule, description: e.target.value })}
              className="bg-white border-gray-200"
            />
          </div>
        </div>

        <Button
          onClick={handleAddRule}
          className="bg-[#FF9414] hover:bg-[#FF9414]/90 text-white">
          {editingId !== null ? (
            <> <Save className="w-4 h-4 mr-2" /> Atualizar Categoria </>
          ) : (
            <> <Plus className="w-4 h-4 mr-2" /> Adicionar Categoria </>
          )}
        </Button>
      </Card>

      {/* Current Rules Table */}
      <Card className="p-6 bg-white">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg text-[#002868]" style={{ fontFamily: 'Arvo, serif' }}>
            Categorias Configuradas ({rules.length})
          </h3>
          <Button
            onClick={handleSaveRules}
            className="bg-[#0051A2] hover:bg-[#0051A2]/90 text-white"
          >
            <Save className="w-4 h-4 mr-2" />
            Salvar Regras
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#EEEEEE]">
              <tr>
                <th className="text-left py-4 px-6 text-sm text-[#002868]" style={{ fontFamily: 'Arvo, serif' }}>
                  Categoria
                </th>
                <th className="text-left py-4 px-6 text-sm text-[#002868]" style={{ fontFamily: 'Arvo, serif' }}>
                  Limite Semestral
                </th>
                <th className="text-left py-4 px-6 text-sm text-[#002868]" style={{ fontFamily: 'Arvo, serif' }}>
                  Descrição
                </th>
                <th className="text-left py-4 px-6 text-sm text-[#002868]" style={{ fontFamily: 'Arvo, serif' }}>
                  Ações
                </th>
              </tr>
            </thead>
            <tbody>
              {rules.map((rule) => (
                <tr key={rule.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm bg-[#002868] text-white font-medium">
                      {rule.category}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl text-[#0051A2]" style={{ fontFamily: 'Arvo, serif' }}>
                        {rule.semesterLimit}
                      </span>
                      <span className="text-sm text-gray-600">horas</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-600">
                    {rule.description || "-"}
                  </td>


                  <td className="py-4 px-6 flex gap-2">
                    <button onClick={() => handleEditRule(rule)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Editar">
                     <Pencil className="w-4 h-4" />
                    </button>                  
                    <button
                      onClick={() => handleDeleteRule(rule.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Excluir"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
          {/* MODAL DE EDIÇÃO */}

      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-2xl text-[#002868] font-bold" style={{ fontFamily: 'Arvo, serif' }}>
              Editar Categoria
            </DialogTitle>
          </DialogHeader>

          {editingRule && (
              <div className="py-4 space-y-4">
                <div>
                  <label className="block text-sm font-bold text-[#002868] mb-1">
                    Nome da Categoria
                  </label>
                  <Input
                      value={editingRule.category}
                      onChange={(e) => setEditingRule({ ...editingRule, category: e.target.value })}
                      className="bg-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-[#002868] mb-1">
                    Limite Semestral (Horas)
                  </label>
                  <Input
                      type="number"
                      value={editingRule.semesterLimit}
                      onChange={(e) => setEditingRule({ ...editingRule, semesterLimit: Number(e.target.value) })}
                      className="bg-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-[#002868] mb-1">
                    Descrição
                  </label>
                  <Input
                      value={editingRule.description}
                      onChange={(e) => setEditingRule({ ...editingRule, description: e.target.value })}
                      className="bg-white"
                  />
                </div>
              </div>
          )}

          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
              Cancelar
            </Button>
            <Button
                onClick={handleUpdateRule}
        className="bg-[#0051A2] text-white"
        >
        <Save className="w-4 h-4 mr-2" />
        Salvar Alterações
      </Button>
    </DialogFooter>
</DialogContent>
</Dialog>
</div>
);
}