
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ProposalHistory as ProposalHistoryType } from '@/types';

interface ProposalHistoryProps {
  history: ProposalHistoryType[];
}

const ProposalHistory: React.FC<ProposalHistoryProps> = ({ history }) => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-lg">Proposal History</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {history.length > 0 ? (
          history.map((entry) => (
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
  );
};

export default ProposalHistory;
