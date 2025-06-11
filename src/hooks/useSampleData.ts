
import { useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { Lead, SparePart, ProposalTemplate, User } from '@/types';

export const useSampleData = () => {
  const [leads, setLeads] = useLocalStorage<Lead[]>('leads', []);
  const [spareParts, setSpareParts] = useLocalStorage<SparePart[]>('spareParts', []);
  const [templates, setTemplates] = useLocalStorage<ProposalTemplate[]>('proposalTemplates', []);
  const [users, setUsers] = useLocalStorage<User[]>('users', []);

  useEffect(() => {
    // Initialize sample users
    if (users.length === 0) {
      const sampleUsers: User[] = [
        {
          id: '1',
          name: 'Admin User',
          email: 'admin@mahajanautomation.com',
          role: 'admin',
          isActive: true,
          createdAt: new Date().toISOString()
        },
        {
          id: '2',
          name: 'Manager User',
          email: 'manager@mahajanautomation.com',
          role: 'manager',
          isActive: true,
          createdAt: new Date().toISOString()
        },
        {
          id: '3',
          name: 'Engineer User',
          email: 'engineer@mahajanautomation.com',
          role: 'engineer',
          isActive: true,
          createdAt: new Date().toISOString()
        }
      ];
      setUsers(sampleUsers);
    }

    // Initialize sample spare parts
    if (spareParts.length === 0) {
      const sampleSpareParts: SparePart[] = [
        {
          id: 'sp-1',
          name: 'Motor Assembly',
          partNumber: 'MA-001',
          description: 'High precision motor assembly for robotic applications',
          cost: 15000,
          compatibility: ['R-2000iA/100P', 'R-2000iA/165F'],
          createdAt: new Date().toISOString()
        },
        {
          id: 'sp-2',
          name: 'Controller Board',
          partNumber: 'CB-002',
          description: 'Main controller board for RJ3iB system',
          cost: 25000,
          compatibility: ['RJ3iB', 'RJ3iC'],
          createdAt: new Date().toISOString()
        },
        {
          id: 'sp-3',
          name: 'Sensor Kit',
          partNumber: 'SK-003',
          description: 'Complete sensor kit for vision systems',
          cost: 8000,
          compatibility: ['All Models'],
          createdAt: new Date().toISOString()
        }
      ];
      setSpareParts(sampleSpareParts);
    }

    // Initialize sample templates
    if (templates.length === 0) {
      const sampleTemplates: ProposalTemplate[] = [
        {
          id: 'pt-1',
          name: 'Standard Fanuc Robot',
          robot: 'R-2000iA/100P',
          controller: 'RJ3iB',
          reach: '3500',
          payload: '100',
          brand: 'Fanuc',
          cost: 251000,
          description: 'Standard industrial robot for assembly operations',
          headerContent: `Mahajan Automation (Pune)
Address: Gate No. 441, S.No. 474/1 Lawasa road, Near primary school, Mukaiwadi, Tal.Mulshi Poud Rd, Pirangut, Maharashtra 412115
info@mahajanautomation.com
+91 84848 79901 (India)`,
          footerContent: `Mahajan Automation (Pune)
Address: Gate No. 441, S.No. 474/1 Lawasa road, Near primary school, Mukaiwadi, Tal.Mulshi Poud Rd, Pirangut, Maharashtra 412115
info@mahajanautomation.com
+91 84848 79901 (India)`,
          isActive: true,
          createdAt: new Date().toISOString(),
          createdBy: '1'
        }
      ];
      setTemplates(sampleTemplates);
    }
  }, [users.length, spareParts.length, templates.length, setUsers, setSpareParts, setTemplates]);
};
