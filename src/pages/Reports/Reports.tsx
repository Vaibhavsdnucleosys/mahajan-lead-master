
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Lead, Proposal, User } from '@/types';
import { Download, FileText, Users } from 'lucide-react';

const Reports = () => {
  const [leads] = useLocalStorage<Lead[]>('leads', []);
  const [proposals] = useLocalStorage<Proposal[]>('proposals', []);
  const [users] = useLocalStorage<User[]>('users', []);
  
  const [selectedUser, setSelectedUser] = useState<string>('all');
  const [reportType, setReportType] = useState<'leads' | 'proposals'>('leads');

  const getStatusColor = (status: string) => {
    const colors = {
      'new': 'bg-blue-100 text-blue-800',
      'contacted': 'bg-yellow-100 text-yellow-800',
      'proposal_sent': 'bg-purple-100 text-purple-800',
      'negotiation': 'bg-orange-100 text-orange-800',
      'won': 'bg-green-100 text-green-800',
      'cancelled': 'bg-red-100 text-red-800',
      'hold': 'bg-gray-100 text-gray-800',
      'draft': 'bg-gray-100 text-gray-800',
      'sent': 'bg-blue-100 text-blue-800',
      'approved': 'bg-green-100 text-green-800',
      'rejected': 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const filteredLeads = selectedUser === 'all' 
    ? leads 
    : leads.filter(lead => lead.createdBy === selectedUser || lead.assignedTo === selectedUser);

  const filteredProposals = selectedUser === 'all'
    ? proposals
    : proposals.filter(proposal => proposal.createdBy === selectedUser);

  const getUserName = (userId: string) => {
    const user = users.find(u => u.id === userId);
    return user ? user.name : 'Unknown';
  };

  const getLeadFromProposal = (leadId: string) => {
    return leads.find(l => l.id === leadId);
  };

  const exportToCSV = () => {
    const data = reportType === 'leads' ? filteredLeads : filteredProposals;
    const headers = reportType === 'leads' 
      ? ['Company', 'Contact Person', 'Email', 'Phone', 'Application', 'Status', 'Source', 'Created By', 'Created Date']
      : ['Lead Company', 'Robot', 'Controller', 'Brand', 'Cost', 'Status', 'Created By', 'Created Date'];
    
    const csvContent = [
      headers.join(','),
      ...data.map(item => {
        if (reportType === 'leads') {
          const lead = item as Lead;
          return [
            lead.companyName,
            lead.contactPerson,
            lead.email,
            lead.phone,
            lead.application,
            lead.status,
            lead.source,
            getUserName(lead.createdBy),
            new Date(lead.createdAt).toLocaleDateString()
          ].join(',');
        } else {
          const proposal = item as Proposal;
          const lead = getLeadFromProposal(proposal.leadId);
          return [
            lead?.companyName || 'Unknown',
            proposal.robot,
            proposal.controller,
            proposal.brand,
            proposal.cost,
            proposal.status,
            getUserName(proposal.createdBy),
            new Date(proposal.createdAt).toLocaleDateString()
          ].join(',');
        }
      })
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${reportType}-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Reports & Analytics</h1>
        <Button onClick={exportToCSV} className="bg-orange-600 hover:bg-orange-700">
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <FileText className="h-8 w-8 text-orange-600" />
              <div>
                <p className="text-2xl font-bold">{leads.length}</p>
                <p className="text-gray-600">Total Leads</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <FileText className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{proposals.length}</p>
                <p className="text-gray-600">Total Proposals</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Users className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{leads.filter(l => l.status === 'won').length}</p>
                <p className="text-gray-600">Won Leads</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Detailed Reports</CardTitle>
            <div className="flex space-x-4">
              <Select onValueChange={(value) => setReportType(value as 'leads' | 'proposals')} defaultValue="leads">
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="leads">Leads</SelectItem>
                  <SelectItem value="proposals">Proposals</SelectItem>
                </SelectContent>
              </Select>
              
              <Select onValueChange={setSelectedUser} defaultValue="all">
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by user" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Users</SelectItem>
                  {users.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.name} ({user.role})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {reportType === 'leads' ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Company</TableHead>
                  <TableHead>Contact Person</TableHead>
                  <TableHead>Application</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Created By</TableHead>
                  <TableHead>Created Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLeads.map((lead) => (
                  <TableRow key={lead.id}>
                    <TableCell className="font-medium">{lead.companyName}</TableCell>
                    <TableCell>{lead.contactPerson}</TableCell>
                    <TableCell>{lead.application}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(lead.status)}>
                        {lead.status.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell>{lead.source}</TableCell>
                    <TableCell>{getUserName(lead.createdBy)}</TableCell>
                    <TableCell>{new Date(lead.createdAt).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Lead Company</TableHead>
                  <TableHead>Robot</TableHead>
                  <TableHead>Controller</TableHead>
                  <TableHead>Brand</TableHead>
                  <TableHead>Cost</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created By</TableHead>
                  <TableHead>Created Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProposals.map((proposal) => {
                  const lead = getLeadFromProposal(proposal.leadId);
                  return (
                    <TableRow key={proposal.id}>
                      <TableCell className="font-medium">{lead?.companyName || 'Unknown'}</TableCell>
                      <TableCell>{proposal.robot}</TableCell>
                      <TableCell>{proposal.controller}</TableCell>
                      <TableCell>{proposal.brand}</TableCell>
                      <TableCell>₹{proposal.cost}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(proposal.status)}>
                          {proposal.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{getUserName(proposal.createdBy)}</TableCell>
                      <TableCell>{new Date(proposal.createdAt).toLocaleDateString()}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Reports;
