
import React from 'react';
import { Label } from '@/components/ui/label';
import { SparePart } from '@/types';

interface SparePartsSelectorProps {
  spareParts: SparePart[];
  selectedSpareParts: string[];
  onSparePartSelect: (sparePartId: string) => void;
}

const SparePartsSelector: React.FC<SparePartsSelectorProps> = ({
  spareParts,
  selectedSpareParts,
  onSparePartSelect
}) => {
  return (
    <div>
      <Label>Spare Parts</Label>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
        {spareParts.map((part) => (
          <label key={part.id} className="flex items-center space-x-2 p-2 border rounded cursor-pointer hover:bg-gray-50">
            <input
              type="checkbox"
              checked={selectedSpareParts.includes(part.id)}
              onChange={() => onSparePartSelect(part.id)}
              className="rounded"
            />
            <span className="text-sm">{part.name}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default SparePartsSelector;
