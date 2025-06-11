
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useAuth } from '@/hooks/useAuth';
import { Proposal, Lead } from '@/types';
import { Search, Plus, Edit, Eye, FileText } from 'lucide-react';

const ProposalsList = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [proposals] = useLocalStorage<Proposal[]>('proposals', []);
  const [leads] = useLocalStorage<Lead[]>('leads', []);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const getLeadInfo = (leadId: string) => {
    return leads.find(lead => lead.id === leadId);
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

  const filteredProposals = proposals.filter(proposal => {
    const lead = getLeadInfo(proposal.leadId);
    const matchesSearch = 
      proposal.robot.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proposal.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead?.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead?.contactPerson.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || proposal.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Proposals</h1>
          <p className="text-muted-foreground">Manage and track all proposals</p>
        </div>
        <Button onClick={() => navigate('/proposals/create')} className="bg-orange-600 hover:bg-orange-700">
          <Plus className="h-4 w-4 mr-2" />
          Create Proposal
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search proposals..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="sent">Sent</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {filteredProposals.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No proposals found</h3>
              <p className="text-gray-500 mb-4">
                {searchTerm || statusFilter !== 'all' 
                  ? 'Try adjusting your search or filter criteria.'
                  : 'Get started by creating your first proposal.'
                }
              </p>
              {(!searchTerm && statusFilter === 'all') && (
                <Button onClick={() => navigate('/proposals/create')} className="bg-orange-600 hover:bg-orange-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Proposal
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredProposals.map((proposal) => {
                const lead = getLeadInfo(proposal.leadId);
                return (
                  <div
                    key={proposal.id}
                    className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-lg">
                            {proposal.robot} - {proposal.brand}
                          </h3>
                          <Badge variant={getStatusBadgeVariant(proposal.status)}>
                            {proposal.status.charAt(0).toUpperCase() + proposal.status.slice(1)}
                          </Badge>
                          <Badge variant="outline">
                            v{proposal.version}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">Company:</span>
                            <div className="font-medium">{lead?.companyName || 'Unknown'}</div>
                          </div>
                          <div>
                            <span className="text-gray-500">Contact:</span>
                            <div className="font-medium">{lead?.contactPerson || 'Unknown'}</div>
                          </div>
                          <div>
                            <span className="text-gray-500">Controller:</span>
                            <div className="font-medium">{proposal.controller}</div>
                          </div>
                          <div>
                            <span className="text-gray-500">Cost:</span>
                            <div className="font-medium">₹{proposal.cost.toLocaleString()}</div>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                          <span>Created: {new Date(proposal.createdAt).toLocaleDateString()}</span>
                          <span>Updated: {new Date(proposal.updatedAt).toLocaleDateString()}</span>
                          {proposal.history?.length > 0 && (
                            <span>{proposal.history.length} revision(s)</span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/proposals/${proposal.id}/view`)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/proposals/${proposal.id}/edit`)}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProposalsList;
