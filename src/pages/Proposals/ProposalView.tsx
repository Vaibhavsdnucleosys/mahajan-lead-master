
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Proposal, Lead, SparePart } from '@/types';
import { ArrowLeft, Edit, Download, History } from 'lucide-react';
import ProposalHistoryComponent from '@/components/proposals/ProposalHistory';

const ProposalView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [proposals] = useLocalStorage<Proposal[]>('proposals', []);
  const [leads] = useLocalStorage<Lead[]>('leads', []);
  const [spareParts] = useLocalStorage<SparePart[]>('spareParts', []);
  
  const proposal = proposals.find(p => p.id === id);
  const lead = proposal ? leads.find(l => l.id === proposal.leadId) : null;

  if (!proposal) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Proposal Not Found</h2>
        <Button onClick={() => navigate('/proposals')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Proposals
        </Button>
      </div>
    );
  }

  const getSelectedSpareParts = () => {
    if (!proposal.spareParts) return [];
    return spareParts.filter(part => proposal.spareParts?.includes(part.id));
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'draft': return 'outline';
      case 'sent': return 'default';
      case 'approved': return 'default';
      case 'rejected': return 'destructive';
      default: return 'outline';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => navigate('/proposals')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{proposal.robot} - {proposal.brand}</h1>
            <p className="text-muted-foreground">Proposal Details</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={getStatusBadgeVariant(proposal.status)}>
            {proposal.status.charAt(0).toUpperCase() + proposal.status.slice(1)}
          </Badge>
          <Badge variant="outline">Version {proposal.version}</Badge>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
          <Button 
            onClick={() => navigate(`/proposals/${proposal.id}/edit`)}
            className="bg-orange-600 hover:bg-orange-700"
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
        </div>
      </div>

      {/* Lead Information */}
      {lead && (
        <Card>
          <CardHeader>
            <CardTitle>Lead Information</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Company</label>
              <p className="font-medium">{lead.companyName}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Contact Person</label>
              <p className="font-medium">{lead.contactPerson}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Email</label>
              <p className="font-medium">{lead.email}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Phone</label>
              <p className="font-medium">{lead.phone}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Proposal Details */}
      <Card>
        <CardHeader>
          <CardTitle>Proposal Specifications</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-500">Robot</label>
            <p className="font-medium">{proposal.robot}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Controller</label>
            <p className="font-medium">{proposal.controller}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Reach</label>
            <p className="font-medium">{proposal.reach}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Payload</label>
            <p className="font-medium">{proposal.payload}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Brand</label>
            <p className="font-medium">{proposal.brand}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Cost</label>
            <p className="font-medium text-lg text-green-600">₹{proposal.cost.toLocaleString()}</p>
          </div>
          {proposal.description && (
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-gray-500">Description</label>
              <p className="font-medium">{proposal.description}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Spare Parts */}
      {proposal.spareParts && proposal.spareParts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Selected Spare Parts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {getSelectedSpareParts().map((part) => (
                <div key={part.id} className="p-3 border rounded">
                  <h4 className="font-medium">{part.name}</h4>
                  <p className="text-sm text-gray-500">{part.partNumber}</p>
                  <p className="text-sm font-medium text-green-600">₹{part.cost.toLocaleString()}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Attachments */}
      {proposal.attachments && proposal.attachments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Attachments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {proposal.attachments.map((attachment) => (
                <div key={attachment.id} className="flex items-center justify-between p-2 border rounded">
                  <div>
                    <p className="font-medium">{attachment.name}</p>
                    <p className="text-sm text-gray-500">
                      {(attachment.size / 1024).toFixed(1)} KB • {attachment.type}
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Proposal History */}
      {proposal.history && proposal.history.length > 0 && (
        <ProposalHistoryComponent history={proposal.history} />
      )}

      {/* Timestamps */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between text-sm text-gray-500">
            <span>Created: {new Date(proposal.createdAt).toLocaleString()}</span>
            <span>Last Updated: {new Date(proposal.updatedAt).toLocaleString()}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProposalView;
