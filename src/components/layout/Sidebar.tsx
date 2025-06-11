
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { 
  Users, 
  UserPlus, 
  FileText, 
  BarChart, 
  Settings,
  Package,
  Wrench,
  ClipboardList
} from 'lucide-react';

const Sidebar = () => {
  const { user } = useAuth();

  const menuItems = [
    {
      title: 'Dashboard',
      icon: BarChart,
      path: '/dashboard',
      roles: ['admin', 'manager', 'engineer']
    },
    {
      title: 'Leads',
      icon: Users,
      path: '/leads',
      roles: ['admin', 'manager', 'engineer']
    },
    {
      title: 'Create Lead',
      icon: UserPlus,
      path: '/leads/create',
      roles: ['admin', 'manager', 'engineer']
    },
    {
      title: 'Proposals',
      icon: FileText,
      path: '/proposals',
      roles: ['admin', 'manager', 'engineer']
    },
    {
      title: 'Reports',
      icon: ClipboardList,
      path: '/reports',
      roles: ['admin']
    },
    {
      title: 'Product Master',
      icon: Package,
      path: '/products',
      roles: ['admin']
    },
    {
      title: 'Spare Parts Master',
      icon: Wrench,
      path: '/spare-parts',
      roles: ['admin']
    },
    {
      title: 'Proposal Templates',
      icon: FileText,
      path: '/proposal-templates',
      roles: ['admin', 'manager', 'engineer']
    },
    {
      title: 'Users',
      icon: Users,
      path: '/users',
      roles: ['admin']
    }
  ];

  const filteredItems = menuItems.filter(item => 
    item.roles.includes(user?.role || '')
  );

  return (
    <aside className="bg-gray-900 text-white w-64 min-h-screen">
      <div className="p-6">
        <nav className="space-y-2">
          {filteredItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-orange-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`
              }
            >
              <item.icon className="h-5 w-5" />
              <span>{item.title}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
