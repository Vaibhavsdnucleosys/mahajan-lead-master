
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { ProposalTemplate } from '@/types';
import { Plus, Edit, Trash2, Upload } from 'lucide-react';

const ProposalTemplates = () => {
  const [templates, setTemplates] = useLocalStorage<ProposalTemplate[]>('proposalTemplates', []);
  const { user } = useAuth();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<ProposalTemplate | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    robot: '',
    controller: '',
    reach: '',
    payload: '',
    brand: '',
    cost: 0,
    description: '',
    headerContent: `Mahajan Automation (Pune)
Address: Gate No. 441, S.No. 474/1 Lawasa road, Near primary school, Mukaiwadi, Tal.Mulshi Poud Rd, Pirangut, Maharashtra 412115
info@mahajanautomation.com
+91 84848 79901 (India)`,
    footerContent: `Mahajan Automation (Pune)
Address: Gate No. 441, S.No. 474/1 Lawasa road, Near primary school, Mukaiwadi, Tal.Mulshi Poud Rd, Pirangut, Maharashtra 412115
info@mahajanautomation.com
+91 84848 79901 (India)`,
    image: ''
  });

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setFormData(prev => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const template: ProposalTemplate = {
      id: editingTemplate?.id || `template-${Date.now()}`,
      ...formData,
      isActive: true,
      createdAt: editingTemplate?.createdAt || new Date().toISOString(),
      createdBy: user?.id || ''
    };

    if (editingTemplate) {
      setTemplates(prev => prev.map(t => t.id === template.id ? template : t));
      toast({
        title: "Template Updated",
        description: "Proposal template has been updated successfully."
      });
    } else {
      setTemplates(prev => [...prev, template]);
      toast({
        title: "Template Created",
        description: "Proposal template has been created successfully."
      });
    }

    resetForm();
    setIsDialogOpen(false);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      robot: '',
      controller: '',
      reach: '',
      payload: '',
      brand: '',
      cost: 0,
      description: '',
      headerContent: `Mahajan Automation (Pune)
Address: Gate No. 441, S.No. 474/1 Lawasa road, Near primary school, Mukaiwadi, Tal.Mulshi Poud Rd, Pirangut, Maharashtra 412115
info@mahajanautomation.com
+91 84848 79901 (India)`,
      footerContent: `Mahajan Automation (Pune)
Address: Gate No. 441, S.No. 474/1 Lawasa road, Near primary school, Mukaiwadi, Tal.Mulshi Poud Rd, Pirangut, Maharashtra 412115
info@mahajanautomation.com
+91 84848 79901 (India)`,
      image: ''
    });
    setEditingTemplate(null);
  };

  const editTemplate = (template: ProposalTemplate) => {
    setFormData({
      name: template.name,
      robot: template.robot,
      controller: template.controller,
      reach: template.reach,
      payload: template.payload,
      brand: template.brand,
      cost: template.cost,
      description: template.description,
      headerContent: template.headerContent,
      footerContent: template.footerContent,
      image: template.image || ''
    });
    setEditingTemplate(template);
    setIsDialogOpen(true);
  };

  const deleteTemplate = (id: string) => {
    setTemplates(prev => prev.filter(t => t.id !== id));
    toast({
      title: "Template Deleted",
      description: "Proposal template has been deleted."
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Proposal Templates</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm} className="bg-orange-600 hover:bg-orange-700">
              <Plus className="h-4 w-4 mr-2" />
              Create Template
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingTemplate ? 'Edit' : 'Create'} Proposal Template</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="name">Template Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="robot">Robot *</Label>
                  <Input
                    id="robot"
                    value={formData.robot}
                    onChange={(e) => handleInputChange('robot', e.target.value)}
                    placeholder="R-2000iA/100P"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="controller">Controller *</Label>
                  <Input
                    id="controller"
                    value={formData.controller}
                    onChange={(e) => handleInputChange('controller', e.target.value)}
                    placeholder="RJ3iB"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="reach">Reach *</Label>
                  <Input
                    id="reach"
                    value={formData.reach}
                    onChange={(e) => handleInputChange('reach', e.target.value)}
                    placeholder="3500"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="payload">Payload *</Label>
                  <Input
                    id="payload"
                    value={formData.payload}
                    onChange={(e) => handleInputChange('payload', e.target.value)}
                    placeholder="100"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="brand">Brand *</Label>
                  <Input
                    id="brand"
                    value={formData.brand}
                    onChange={(e) => handleInputChange('brand', e.target.value)}
                    placeholder="Fanuc"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="cost">Cost *</Label>
                  <Input
                    id="cost"
                    type="number"
                    value={formData.cost}
                    onChange={(e) => handleInputChange('cost', parseFloat(e.target.value) || 0)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="image">Product Image</Label>
                  <div className="mt-2">
                    <label className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                      <div className="flex flex-col items-center">
                        <Upload className="h-8 w-8 text-gray-400" />
                        <span className="mt-2 text-sm text-gray-600">Click to upload image</span>
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        onChange={handleImageUpload}
                        accept="image/*"
                      />
                    </label>
                    {formData.image && (
                      <img src={formData.image} alt="Preview" className="mt-2 h-20 w-20 object-cover rounded" />
                    )}
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="headerContent">Header Content</Label>
                <Textarea
                  id="headerContent"
                  value={formData.headerContent}
                  onChange={(e) => handleInputChange('headerContent', e.target.value)}
                  rows={4}
                />
              </div>

              <div>
                <Label htmlFor="footerContent">Footer Content</Label>
                <Textarea
                  id="footerContent"
                  value={formData.footerContent}
                  onChange={(e) => handleInputChange('footerContent', e.target.value)}
                  rows={4}
                />
              </div>

              <div className="flex justify-end space-x-4">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-orange-600 hover:bg-orange-700">
                  {editingTemplate ? 'Update' : 'Create'} Template
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Templates</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Robot</TableHead>
                <TableHead>Controller</TableHead>
                <TableHead>Brand</TableHead>
                <TableHead>Cost</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {templates.map((template) => (
                <TableRow key={template.id}>
                  <TableCell className="font-medium">{template.name}</TableCell>
                  <TableCell>{template.robot}</TableCell>
                  <TableCell>{template.controller}</TableCell>
                  <TableCell>{template.brand}</TableCell>
                  <TableCell>₹{template.cost}</TableCell>
                  <TableCell>{new Date(template.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" onClick={() => editTemplate(template)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => deleteTemplate(template.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProposalTemplates;
