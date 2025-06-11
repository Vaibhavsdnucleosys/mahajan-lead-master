
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Lead, Proposal, ProposalTemplate, SparePart, ProposalHistory } from '@/types';
import { History } from 'lucide-react';
import ProposalForm from '@/components/proposals/ProposalForm';
import SparePartsSelector from '@/components/proposals/SparePartsSelector';
import FileUploader from '@/components/proposals/FileUploader';
import ProposalHistoryComponent from '@/components/proposals/ProposalHistory';

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

    if (isEditing && existingProposal) {
      const changes = `Updated proposal: ${formData.robot} ${formData.controller}`;
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
            <ProposalHistoryComponent history={existingProposal.history || []} />
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <ProposalForm
              formData={formData}
              leads={leads}
              templates={templates}
              isEditing={isEditing}
              onInputChange={handleInputChange}
              onTemplateSelect={handleTemplateSelect}
            />

            <SparePartsSelector
              spareParts={spareParts}
              selectedSpareParts={formData.spareParts}
              onSparePartSelect={handleSparePartSelect}
            />

            <FileUploader
              attachments={formData.attachments}
              onFileUpload={handleFileUpload}
              onRemoveAttachment={removeAttachment}
            />

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
