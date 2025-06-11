
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Lead, ProposalTemplate } from '@/types';

interface ProposalFormProps {
  formData: {
    leadId: string;
    templateId: string;
    robot: string;
    controller: string;
    reach: string;
    payload: string;
    brand: string;
    cost: number;
    description: string;
  };
  leads: Lead[];
  templates: ProposalTemplate[];
  isEditing: boolean;
  onInputChange: (field: string, value: string | number) => void;
  onTemplateSelect: (templateId: string) => void;
}

const ProposalForm: React.FC<ProposalFormProps> = ({
  formData,
  leads,
  templates,
  isEditing,
  onInputChange,
  onTemplateSelect
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <Label htmlFor="leadId">Select Lead *</Label>
        <Select 
          onValueChange={(value) => onInputChange('leadId', value)} 
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
          onValueChange={onTemplateSelect}
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
          onChange={(e) => onInputChange('robot', e.target.value)}
          placeholder="R-2000iA/100P"
          required
        />
      </div>

      <div>
        <Label htmlFor="controller">Controller *</Label>
        <Input
          id="controller"
          value={formData.controller}
          onChange={(e) => onInputChange('controller', e.target.value)}
          placeholder="RJ3iB"
          required
        />
      </div>

      <div>
        <Label htmlFor="reach">Reach *</Label>
        <Input
          id="reach"
          value={formData.reach}
          onChange={(e) => onInputChange('reach', e.target.value)}
          placeholder="3500"
          required
        />
      </div>

      <div>
        <Label htmlFor="payload">Payload *</Label>
        <Input
          id="payload"
          value={formData.payload}
          onChange={(e) => onInputChange('payload', e.target.value)}
          placeholder="100"
          required
        />
      </div>

      <div>
        <Label htmlFor="brand">Brand *</Label>
        <Input
          id="brand"
          value={formData.brand}
          onChange={(e) => onInputChange('brand', e.target.value)}
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
          onChange={(e) => onInputChange('cost', parseFloat(e.target.value) || 0)}
          required
        />
      </div>

      <div className="md:col-span-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => onInputChange('description', e.target.value)}
          rows={4}
        />
      </div>
    </div>
  );
};

export default ProposalForm;
