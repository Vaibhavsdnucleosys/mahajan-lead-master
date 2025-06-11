
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
import { Lead, Memo, FollowUp, User } from '@/types';
import { ArrowLeft, Edit, History, Users, FileText } from 'lucide-react';

const LeadDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [leads, setLeads] = useLocalStorage<Lead[]>('leads', []);
  const [users] = useLocalStorage<User[]>('users', []);
  const { user } = useAuth();
  const { toast } = useToast();

  const lead = leads.find(l => l.id === id);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(lead || {} as Lead);
  const [newMemo, setNewMemo] = useState({ type: 'spare' as const, content: '' });
  const [newFollowUp, setNewFollowUp] = useState({ date: '', notes: '', nextFollowUp: '' });

  if (!lead) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">Lead not found</h2>
        <Button onClick={() => navigate('/leads')} className="mt-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Leads
        </Button>
      </div>
    );
  }

  const handleSave = () => {
    const updatedLead: Lead = {
      ...editData,
      updatedAt: new Date().toISOString(),
      status: editData.status as "new" | "contacted" | "proposal_sent" | "negotiation" | "won" | "cancelled" | "hold"
    };

    setLeads(prev => prev.map(l => l.id === id ? updatedLead : l));
    setIsEditing(false);
    toast({
      title: "Lead Updated",
      description: "Lead has been updated successfully."
    });
  };

  const addMemo = () => {
    if (!newMemo.content.trim()) return;

    const memo: Memo = {
      id: `memo-${Date.now()}`,
      type: newMemo.type,
      content: newMemo.content,
      createdAt: new Date().toISOString(),
      createdBy: user?.id || ''
    };

    const updatedLead = {
      ...lead,
      memos: [...(lead.memos || []), memo],
      updatedAt: new Date().toISOString()
    };

    setLeads(prev => prev.map(l => l.id === id ? updatedLead : l));
    setNewMemo({ type: 'spare', content: '' });
    toast({
      title: "Memo Added",
      description: "Memo has been added to the lead."
    });
  };

  const addFollowUp = () => {
    if (!newFollowUp.date || !newFollowUp.notes.trim()) return;

    const followUp: FollowUp = {
      id: `followup-${Date.now()}`,
      date: newFollowUp.date,
      notes: newFollowUp.notes,
      nextFollowUp: newFollowUp.nextFollowUp || undefined,
      createdBy: user?.id || '',
      createdAt: new Date().toISOString()
    };

    const updatedLead = {
      ...lead,
      followUps: [...(lead.followUps || []), followUp],
      updatedAt: new Date().toISOString()
    };

    setLeads(prev => prev.map(l => l.id === id ? updatedLead : l));
    setNewFollowUp({ date: '', notes: '', nextFollowUp: '' });
    toast({
      title: "Follow-up Added",
      description: "Follow-up has been added to the lead."
    });
  };

  const getStatusColor = (status: string) => {
    const colors = {
      new: 'bg-blue-100 text-blue-800',
      contacted: 'bg-yellow-100 text-yellow-800',
      proposal_sent: 'bg-purple-100 text-purple-800',
      negotiation: 'bg-orange-100 text-orange-800',
      won: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      hold: 'bg-gray-100 text-gray-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const assignedUser = users.find(u => u.id === lead.assignedTo);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={() => navigate('/leads')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Leads
          </Button>
          <h1 className="text-3xl font-bold">{lead.companyName}</h1>
          <Badge className={getStatusColor(lead.status)}>
            {lead.status.replace('_', ' ').toUpperCase()}
          </Badge>
        </div>
        <div className="flex space-x-2">
          <Button onClick={() => navigate(`/proposals/create?leadId=${lead.id}`)}>
            <FileText className="h-4 w-4 mr-2" />
            Create Proposal
          </Button>
          <Button onClick={() => setIsEditing(!isEditing)}>
            <Edit className="h-4 w-4 mr-2" />
            {isEditing ? 'Cancel' : 'Edit'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Lead Details */}
        <Card>
          <CardHeader>
            <CardTitle>Lead Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isEditing ? (
              <>
                <div>
                  <Label>Company Name</Label>
                  <Input
                    value={editData.companyName}
                    onChange={(e) => setEditData(prev => ({ ...prev, companyName: e.target.value }))}
                  />
                </div>
                <div>
                  <Label>Contact Person</Label>
                  <Input
                    value={editData.contactPerson}
                    onChange={(e) => setEditData(prev => ({ ...prev, contactPerson: e.target.value }))}
                  />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input
                    value={editData.email}
                    onChange={(e) => setEditData(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>
                <div>
                  <Label>Phone</Label>
                  <Input
                    value={editData.phone}
                    onChange={(e) => setEditData(prev => ({ ...prev, phone: e.target.value }))}
                  />
                </div>
                <div>
                  <Label>Status</Label>
                  <Select value={editData.status} onValueChange={(value) => setEditData(prev => ({ ...prev, status: value }))}>
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
                <Button onClick={handleSave} className="bg-orange-600 hover:bg-orange-700">
                  Save Changes
                </Button>
              </>
            ) : (
              <>
                <div><strong>Contact Person:</strong> {lead.contactPerson}</div>
                <div><strong>Email:</strong> {lead.email}</div>
                <div><strong>Phone:</strong> {lead.phone}</div>
                <div><strong>Application:</strong> {lead.application}</div>
                <div><strong>Source:</strong> {lead.source}</div>
                <div><strong>Assigned To:</strong> {assignedUser?.name || 'Not assigned'}</div>
                <div><strong>Created:</strong> {new Date(lead.createdAt).toLocaleDateString()}</div>
                <div><strong>Updated:</strong> {new Date(lead.updatedAt).toLocaleDateString()}</div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Memos */}
        <Card>
          <CardHeader>
            <CardTitle>Memos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Select value={newMemo.type} onValueChange={(value: any) => setNewMemo(prev => ({ ...prev, type: value }))}>
                <SelectTrigger>
                  <SelectValue />
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
                value={newMemo.content}
                onChange={(e) => setNewMemo(prev => ({ ...prev, content: e.target.value }))}
              />
              <Button onClick={addMemo} size="sm" className="bg-orange-600 hover:bg-orange-700">
                Add Memo
              </Button>
            </div>
            <div className="space-y-2">
              {lead.memos?.map((memo) => (
                <div key={memo.id} className="p-3 bg-gray-50 rounded">
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="secondary">{memo.type.replace('_', ' ')}</Badge>
                    <span className="text-xs text-gray-500">
                      {new Date(memo.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm">{memo.content}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Follow-ups */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <History className="h-5 w-5 mr-2" />
              Follow-ups
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>Date</Label>
                <Input
                  type="datetime-local"
                  value={newFollowUp.date}
                  onChange={(e) => setNewFollowUp(prev => ({ ...prev, date: e.target.value }))}
                />
              </div>
              <div>
                <Label>Next Follow-up (Optional)</Label>
                <Input
                  type="datetime-local"
                  value={newFollowUp.nextFollowUp}
                  onChange={(e) => setNewFollowUp(prev => ({ ...prev, nextFollowUp: e.target.value }))}
                />
              </div>
              <div>
                <Label>Notes</Label>
                <Textarea
                  placeholder="Follow-up notes..."
                  value={newFollowUp.notes}
                  onChange={(e) => setNewFollowUp(prev => ({ ...prev, notes: e.target.value }))}
                />
              </div>
            </div>
            <Button onClick={addFollowUp} className="bg-orange-600 hover:bg-orange-700">
              Add Follow-up
            </Button>
            
            <div className="space-y-3">
              {lead.followUps?.map((followUp) => (
                <div key={followUp.id} className="p-4 bg-gray-50 rounded">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-medium">
                      {new Date(followUp.date).toLocaleString()}
                    </span>
                    <span className="text-xs text-gray-500">
                      by {users.find(u => u.id === followUp.createdBy)?.name || 'Unknown'}
                    </span>
                  </div>
                  <p className="text-sm mb-2">{followUp.notes}</p>
                  {followUp.nextFollowUp && (
                    <p className="text-xs text-orange-600">
                      Next: {new Date(followUp.nextFollowUp).toLocaleString()}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LeadDetail;
