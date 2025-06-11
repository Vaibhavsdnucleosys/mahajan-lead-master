
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { Lead, SparePart } from '@/types';
import { Upload, X } from 'lucide-react';

const CreateLead = () => {
  const [leads, setLeads] = useLocalStorage<Lead[]>('leads', []);
  const [spareParts] = useLocalStorage<SparePart[]>('spareParts', []);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    application: '',
    source: 'website' as const,
    status: 'new' as 'new' | 'contacted' | 'proposal_sent' | 'negotiation' | 'won' | 'lost' | 'hold',
    spareParts: [] as string[],
    attachments: [] as File[],
    negotiation: false
  });

  const applicationOptions = [
    'Material & Warehouse Material Handling',
    'Fluid Dispensing System',
    'Foundry Automation System',
    'Vision System',
    'Robotic AGV / AMR',
    'Robotic 3D Manufacturing',
    'Robots In Assembly lines',
    'Welding Automation'
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newLead: Lead = {
      id: `lead-${Date.now()}`,
      companyName: formData.companyName,
      contactPerson: formData.contactPerson,
      email: formData.email,
      phone: formData.phone,
      application: formData.application,
      source: formData.source,
      status: 'new',
      memos: [],
      followUps: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: user?.id || '',
      attachments: formData.attachments.map((file, index) => ({
        id: `attachment-${Date.now()}-${index}`,
        name: file.name,
        url: URL.createObjectURL(file),
        size: file.size,
        type: file.type,
        uploadedAt: new Date().toISOString(),
        uploadedBy: user?.id || ''
      })),
      spareParts: formData.spareParts
    };

    setLeads(prev => [...prev, newLead]);
    
    toast({
      title: "Lead Created",
      description: "New lead has been successfully created.",
    });

    navigate('/leads');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Create New Lead</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="companyName">Company Name *</Label>
                <Input
                  id="companyName"
                  value={formData.companyName}
                  onChange={(e) => handleInputChange('companyName', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="contactPerson">Contact Person *</Label>
                <Input
                  id="contactPerson"
                  value={formData.contactPerson}
                  onChange={(e) => handleInputChange('contactPerson', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone *</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="application">Application *</Label>
                <Select onValueChange={(value) => handleInputChange('application', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select application" />
                  </SelectTrigger>
                  <SelectContent>
                    {applicationOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>


               <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as typeof formData.status })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="proposal_sent">Proposal Sent</option>
                <option value="negotiation">Negotiation</option>
                <option value="won">Won</option>
                <option value="lost">Lost</option>
                <option value="hold">Hold</option>
              </select>
            </div>
            <div>
              <Label htmlFor="source">Source</Label>
              <select
                id="source"
                value={formData.source}
                onChange={(e) => setFormData({ ...formData, source: e.target.value as typeof formData.source })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="website">Website</option>
                <option value="email">Email</option>
                <option value="phone">Phone</option>
                <option value="referral">Referral</option>
                <option value="social_media">Social Media</option>
                <option value="trade_show">Trade Show</option>
              </select>
            </div>
          </div>
<div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="negotiation"
              checked={formData.negotiation}
              onChange={(e) => setFormData({ ...formData, negotiation: e.target.checked })}
            />
            <Label htmlFor="negotiation">Mark for Negotiation</Label>
          </div>
              <div>
                <Label htmlFor="source">Source *</Label>
                <Select onValueChange={(value) => handleInputChange('source', value)} defaultValue="website">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="website">Website</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="phone">Phone</SelectItem>
                    <SelectItem value="referral">Referral</SelectItem>
                  </SelectContent>
                </Select>
              </div>
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
              <Button type="button" variant="outline" onClick={() => navigate('/leads')}>
                Cancel
              </Button>
              <Button type="submit" className="bg-orange-600 hover:bg-orange-700">
                Create Lead
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateLead;
