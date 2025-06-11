
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Lead, Memo, FollowUp, User } from '@/types';
import { ArrowLeft, FileText, Plus, Calendar } from 'lucide-react';

const LeadDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [leads, setLeads] = useLocalStorage<Lead[]>('leads', []);
  const [users] = useLocalStorage<User[]>('users', []);
  const { user } = useAuth();
  const { toast } = useToast();

  const [newMemo, setNewMemo] = useState('');
  const [memoType, setMemoType] = useState<'spare' | 'project' | 'service' | 'key_account'>('project');
  const [followUpNote, setFollowUpNote] = useState('');
  const [nextFollowUp, setNextFollowUp] = useState('');

  const lead = leads.find(l => l.id === id);

  if (!lead) {
    return <div>Lead not found</div>;
  }

  const addMemo = () => {
    if (!newMemo.trim()) return;

    const memo: Memo = {
      id: `memo-${Date.now()}`,
      type: memoType,
      content: newMemo,
      createdAt: new Date().toISOString(),
      createdBy: user?.id || ''
    };

    const updatedLeads = leads.map(l => 
      l.id === id ? { ...l, memos: [...l.memos, memo] } : l
    );

    setLeads(updatedLeads);
    setNewMemo('');
    toast({
      title: "Memo Added",
      description: "Your memo has been added successfully."
    });
  };

  const addFollowUp = () => {
    if (!followUpNote.trim()) return;

    const followUp: FollowUp = {
      id: `followup-${Date.now()}`,
      date: new Date().toISOString(),
      notes: followUpNote,
      nextFollowUp: nextFollowUp || undefined,
      createdBy: user?.id || '',
      createdAt: new Date().toISOString()
    };

    const updatedLeads = leads.map(l => 
      l.id === id ? { ...l, followUps: [...l.followUps, followUp] } : l
    );

    setLeads(updatedLeads);
    setFollowUpNote('');
    setNextFollowUp('');
    toast({
      title: "Follow-up Added",
      description: "Follow-up has been recorded successfully."
    });
  };

  const updateStatus = (newStatus: string) => {
    const updatedLeads = leads.map(l => 
      l.id === id ? { ...l, status: newStatus, updatedAt: new Date().toISOString() } : l
    );
    setLeads(updatedLeads);
    toast({
      title: "Status Updated",
      description: "Lead status has been updated."
    });
  };

  const assignLead = (assignedTo: string) => {
    const updatedLeads = leads.map(l => 
      l.id === id ? { 
        ...l, 
        assignedTo, 
        assignedBy: user?.id,
        updatedAt: new Date().toISOString() 
      } : l
    );
    setLeads(updatedLeads);
    toast({
      title: "Lead Assigned",
      description: "Lead has been assigned successfully."
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={() => navigate('/leads')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Leads
          </Button>
          <h1 className="text-3xl font-bold">{lead.companyName}</h1>
        </div>
        <div className="flex space-x-2">
          <Button onClick={() => navigate(`/proposals/create?leadId=${lead.id}`)} className="bg-orange-600 hover:bg-orange-700">
            <FileText className="h-4 w-4 mr-2" />
            Create Proposal
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Lead Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Company Name</label>
                  <p className="text-lg">{lead.companyName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Contact Person</label>
                  <p className="text-lg">{lead.contactPerson}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Email</label>
                  <p className="text-lg">{lead.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Phone</label>
                  <p className="text-lg">{lead.phone}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Application</label>
                  <p className="text-lg">{lead.application}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Source</label>
                  <p className="text-lg">{lead.source}</p>
                </div>
              </div>
              
              {lead.attachments.length > 0 && (
                <div>
                  <label className="text-sm font-medium">Attachments</label>
                  <div className="space-y-2 mt-2">
                    {lead.attachments.map((attachment) => (
                      <div key={attachment.id} className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
                        <FileText className="h-4 w-4" />
                        <span className="text-sm">{attachment.name}</span>
                        <span className="text-xs text-gray-500">({(attachment.size / 1024).toFixed(1)} KB)</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Follow-up History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {lead.followUps.map((followUp) => (
                  <div key={followUp.id} className="border-l-4 border-orange-600 pl-4 py-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{followUp.notes}</p>
                        {followUp.nextFollowUp && (
                          <p className="text-sm text-gray-600">Next follow-up: {new Date(followUp.nextFollowUp).toLocaleDateString()}</p>
                        )}
                      </div>
                      <span className="text-sm text-gray-500">{new Date(followUp.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
                
                <div className="border-t pt-4 space-y-3">
                  <Textarea
                    placeholder="Add follow-up notes..."
                    value={followUpNote}
                    onChange={(e) => setFollowUpNote(e.target.value)}
                  />
                  <input
                    type="date"
                    className="w-full p-2 border rounded"
                    value={nextFollowUp}
                    onChange={(e) => setNextFollowUp(e.target.value)}
                    placeholder="Next follow-up date"
                  />
                  <Button onClick={addFollowUp} size="sm" className="bg-orange-600 hover:bg-orange-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Follow-up
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Memos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {lead.memos.map((memo) => (
                  <div key={memo.id} className="p-3 bg-gray-50 rounded">
                    <div className="flex justify-between items-start mb-2">
                      <Badge variant="outline">{memo.type.replace('_', ' ')}</Badge>
                      <span className="text-sm text-gray-500">{new Date(memo.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p>{memo.content}</p>
                  </div>
                ))}
                
                <div className="border-t pt-4 space-y-3">
                  <Select onValueChange={(value) => setMemoType(value as any)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select memo type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="spare">Spare</SelectItem>
                      <SelectItem value="project">Project</SelectItem>
                      <SelectItem value="service">Service</SelectItem>
                      <SelectItem value="key_account">Key Account</SelectItem>
                    </SelectContent>
                  </Select>
                  <Textarea
                    placeholder="Add memo..."
                    value={newMemo}
                    onChange={(e) => setNewMemo(e.target.value)}
                  />
                  <Button onClick={addMemo} size="sm" className="bg-orange-600 hover:bg-orange-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Memo
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Status & Assignment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Status</label>
                <Select onValueChange={updateStatus} defaultValue={lead.status}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="contacted">Contacted</SelectItem>
                    <SelectItem value="proposal_sent">Proposal Sent</SelectItem>
                    <SelectItem value="negotiation">Negotiation</SelectItem>
                    <SelectItem value="won">Won</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                    <SelectItem value="hold">Hold</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {user?.role === 'admin' && (
                <div>
                  <label className="text-sm font-medium">Assign To</label>
                  <Select onValueChange={assignLead} defaultValue={lead.assignedTo}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select user" />
                    </SelectTrigger>
                    <SelectContent>
                      {users.filter(u => u.role !== 'admin').map((u) => (
                        <SelectItem key={u.id} value={u.id}>{u.name} ({u.role})</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LeadDetail;
