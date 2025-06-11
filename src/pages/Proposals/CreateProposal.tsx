
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Lead, Proposal, ProposalTemplate, SparePart, ProposalHistory } from '@/types';
import { Upload, X, History } from 'lucide-react';

const CreateProposal = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { id } = useParams();
  const leadId = searchParams.get('leadId');
  
  const [leads] = useLocalStorage<Lead[]>('leads', []);
  const [proposals, setProposals] = useLocalStorage<Proposal[]>('proposals', []);
  const [templates] = useLocalStorage<ProposalTemplate[]>('proposalTemplates', []);
  const [spareParts] = useLocalStorage<SparePart[]>('spareParts', []);
  
  const { user } = useAuth();
  const { toast } = useToast();

  const isEditing = !!id;
  const existingProposal = isEditing ? proposals.find(p => p.id === id) : null;
  const lead = leadId ? leads.find(l => l.id === leadId) : 
                (existingProposal ? leads.find(l => l.id === existingProposal.leadId) : null);

  const [formData, setFormData] = useState({
    leadId: leadId || existingProposal?.leadId || '',
    templateId: '',
    robot: '',
    controller: '',
    reach: '',
    payload: '',
    brand: '',
    cost: 0,
    description: '',
    attachments: [] as File[],
    spareParts: [] as string[]
  });

  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    if (existingProposal) {
      setFormData({
        leadId: existingProposal.leadId,
        templateId: existingProposal.templateId || '',
        robot: existingProposal.robot,
        controller: existingProposal.controller,
        reach: existingProposal.reach,
        payload: existingProposal.payload,
        brand: existingProposal.brand,
        cost: existingProposal.cost,
        description: existingProposal.description,
        attachments: [],
        spareParts: existingProposal.spareParts || []
      });
    }
  }, [existingProposal]);

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleTemplateSelect = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setFormData(prev => ({
        ...prev,
        templateId,
        robot: template.robot,
        controller: template.controller,
        reach: template.reach,
        payload: template.payload,
        brand: template.brand,
        cost: template.cost,
        description: template.description
      }));
      
      toast({
        title: "Template Applied",
        description: `Template "${template.name}" has been applied successfully.`
      });
    }
  };

  const handleSparePartSelect = (sparePartId: string) => {
    setFormData(prev => ({
      ...prev,
      spareParts: prev.spareParts.includes(sparePartId)
        ? prev.spareParts.filter(id => id !== sparePartId)
        : [...prev.spareParts, sparePartId]
    }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setFormData(prev => ({
      ...prev,
      attachments: [...prev.attachments, ...files]
    }));
  };

  const removeAttachment = (index: number) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
  };

  const createHistory = (changes: string): ProposalHistory => ({
    id: `history-${Date.now()}`,
    version: (existingProposal?.version || 0) + 1,
    changes,
    modifiedBy: user?.id || '',
    modifiedAt: new Date().toISOString()
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.leadId) {
      toast({
        title: "Error",
        description: "Please select a lead for this proposal.",
        variant: "destructive"
      });
      return;
    }

    if (!formData.robot || !formData.controller || !formData.reach || !formData.payload || !formData.brand) {
      toast({
        title: "Error",
        description: "Please fill all required fields.",
        variant: "destructive"
      });
      return;
    }

    const now = new Date().toISOString();
    let proposal: Proposal;
    let changes = '';

    if (isEditing && existingProposal) {
      // Create history entry for the edit
      changes = `Updated proposal: ${formData.robot} ${formData.controller}`;
      const historyEntry = createHistory(changes);
      
      proposal = {
        ...existingProposal,
        templateId: formData.templateId || undefined,
        robot: formData.robot,
        controller: formData.controller,
        reach: formData.reach,
        payload: formData.payload,
        brand: formData.brand,
        cost: formData.cost,
        description: formData.description,
        spareParts: formData.spareParts,
        version: historyEntry.version,
        history: [...(existingProposal.history || []), historyEntry],
        attachments: [
          ...existingProposal.attachments,
          ...formData.attachments.map((file, index) => ({
            id: `attachment-${Date.now()}-${index}`,
            name: file.name,
            url: URL.createObjectURL(file),
            size: file.size,
            type: file.type,
            uploadedAt: now,
            uploadedBy: user?.id || ''
          }))
        ],
        updatedAt: now
      };

      setProposals(prev => prev.map(p => p.id === proposal.id ? proposal : p));
      
      toast({
        title: "Proposal Updated",
        description: "Proposal has been successfully updated.",
      });
    } else {
      // Create new proposal
      proposal = {
        id: `proposal-${Date.now()}`,
        leadId: formData.leadId,
        templateId: formData.templateId || undefined,
        robot: formData.robot,
        controller: formData.controller,
        reach: formData.reach,
        payload: formData.payload,
        brand: formData.brand,
        cost: formData.cost,
        description: formData.description,
        spareParts: formData.spareParts,
        status: 'draft',
        version: 1,
        history: [],
        attachments: formData.attachments.map((file, index) => ({
          id: `attachment-${Date.now()}-${index}`,
          name: file.name,
          url: URL.createObjectURL(file),
          size: file.size,
          type: file.type,
          uploadedAt: now,
          uploadedBy: user?.id || ''
        })),
        createdAt: now,
        updatedAt: now,
        createdBy: user?.id || ''
      };

      setProposals(prev => [...prev, proposal]);
      
      toast({
        title: "Proposal Created",
        description: "Proposal has been successfully created.",
      });
    }

    navigate('/proposals');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-2xl font-bold">
                {isEditing ? 'Edit Proposal' : 'Create New Proposal'}
              </CardTitle>
              {lead && (
                <p className="text-gray-600">For: {lead.companyName} - {lead.contactPerson}</p>
              )}
            </div>
            {isEditing && existingProposal && (
              <div className="flex items-center space-x-2">
                <Badge variant="outline">Version {existingProposal.version}</Badge>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowHistory(!showHistory)}
                >
                  <History className="h-4 w-4 mr-2" />
                  History
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {showHistory && existingProposal && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-lg">Proposal History</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {existingProposal.history?.length > 0 ? (
                  existingProposal.history.map((entry) => (
                    <div key={entry.id} className="p-3 bg-gray-50 rounded">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-medium">Version {entry.version}</span>
                        <span className="text-xs text-gray-500">
                          {new Date(entry.modifiedAt).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm">{entry.changes}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No history available</p>
                )}
              </CardContent>
            </Card>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="leadId">Select Lead *</Label>
                <Select 
                  onValueChange={(value) => handleInputChange('leadId', value)} 
                  value={formData.leadId}
                  disabled={isEditing}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a lead" />
                  </SelectTrigger>
                  <SelectContent>
                    {leads.map((lead) => (
                      <SelectItem key={lead.id} value={lead.id}>
                        {lead.companyName} - {lead.contactPerson}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="templateId">Use Template (Optional)</Label>
                <Select 
                  onValueChange={handleTemplateSelect}
                  value={formData.templateId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a template" />
                  </SelectTrigger>
                  <SelectContent>
                    {templates.map((template) => (
                      <SelectItem key={template.id} value={template.id}>
                        {template.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={4}
              />
            </div>

            <div>
              <Label>Spare Parts</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                {spareParts.map((part) => (
                  <label key={part.id} className="flex items-center space-x-2 p-2 border rounded cursor-pointer hover:bg-gray-50">
                    <input
                      type="checkbox"
                      checked={formData.spareParts.includes(part.id)}
                      onChange={() => handleSparePartSelect(part.id)}
                      className="rounded"
                    />
                    <span className="text-sm">{part.name}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <Label>Attachments</Label>
              <div className="mt-2">
                <label className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                  <div className="flex flex-col items-center">
                    <Upload className="h-8 w-8 text-gray-400" />
                    <span className="mt-2 text-sm text-gray-600">Click to upload files</span>
                  </div>
                  <input
                    type="file"
                    multiple
                    className="hidden"
                    onChange={handleFileUpload}
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
                  />
                </label>
              </div>
              {formData.attachments.length > 0 && (
                <div className="mt-4 space-y-2">
                  {formData.attachments.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-sm">{file.name}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeAttachment(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline" onClick={() => navigate('/proposals')}>
                Cancel
              </Button>
              <Button type="submit" className="bg-orange-600 hover:bg-orange-700">
                {isEditing ? 'Update Proposal' : 'Create Proposal'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateProposal;
