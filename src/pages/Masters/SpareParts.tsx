
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
import { SparePart } from '@/types';
import { Plus, Edit, Trash2, Upload } from 'lucide-react';

const SpareParts = () => {
  const [spareParts, setSpareParts] = useLocalStorage<SparePart[]>('spareParts', []);
  const { user } = useAuth();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPart, setEditingPart] = useState<SparePart | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    partNumber: '',
    description: '',
    cost: 0,
    compatibility: [] as string[],
    image: ''
  });

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCompatibilityChange = (value: string) => {
    const compatibilityArray = value.split(',').map(item => item.trim()).filter(item => item);
    setFormData(prev => ({ ...prev, compatibility: compatibilityArray }));
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
    
    const sparePart: SparePart = {
      id: editingPart?.id || `part-${Date.now()}`,
      ...formData,
      createdAt: editingPart?.createdAt || new Date().toISOString()
    };

    if (editingPart) {
      setSpareParts(prev => prev.map(p => p.id === sparePart.id ? sparePart : p));
      toast({
        title: "Spare Part Updated",
        description: "Spare part has been updated successfully."
      });
    } else {
      setSpareParts(prev => [...prev, sparePart]);
      toast({
        title: "Spare Part Created",
        description: "Spare part has been created successfully."
      });
    }

    resetForm();
    setIsDialogOpen(false);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      partNumber: '',
      description: '',
      cost: 0,
      compatibility: [],
      image: ''
    });
    setEditingPart(null);
  };

  const editPart = (part: SparePart) => {
    setFormData({
      name: part.name,
      partNumber: part.partNumber,
      description: part.description,
      cost: part.cost,
      compatibility: part.compatibility,
      image: part.image || ''
    });
    setEditingPart(part);
    setIsDialogOpen(true);
  };

  const deletePart = (id: string) => {
    setSpareParts(prev => prev.filter(p => p.id !== id));
    toast({
      title: "Spare Part Deleted",
      description: "Spare part has been deleted."
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Spare Parts</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm} className="bg-orange-600 hover:bg-orange-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Spare Part
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingPart ? 'Edit' : 'Add'} Spare Part</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="name">Part Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="partNumber">Part Number *</Label>
                  <Input
                    id="partNumber"
                    value={formData.partNumber}
                    onChange={(e) => handleInputChange('partNumber', e.target.value)}
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
                  <Label htmlFor="image">Part Image</Label>
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
                <Label htmlFor="compatibility">Compatibility (comma-separated)</Label>
                <Input
                  id="compatibility"
                  value={formData.compatibility.join(', ')}
                  onChange={(e) => handleCompatibilityChange(e.target.value)}
                  placeholder="Robot Model 1, Robot Model 2, etc."
                />
              </div>

              <div className="flex justify-end space-x-4">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-orange-600 hover:bg-orange-700">
                  {editingPart ? 'Update' : 'Add'} Spare Part
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Spare Parts</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Part Number</TableHead>
                <TableHead>Cost</TableHead>
                <TableHead>Compatibility</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {spareParts.map((part) => (
                <TableRow key={part.id}>
                  <TableCell className="font-medium">{part.name}</TableCell>
                  <TableCell>{part.partNumber}</TableCell>
                  <TableCell>₹{part.cost}</TableCell>
                  <TableCell>{part.compatibility.join(', ')}</TableCell>
                  <TableCell>{new Date(part.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" onClick={() => editPart(part)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => deletePart(part.id)}>
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

export default SpareParts;
