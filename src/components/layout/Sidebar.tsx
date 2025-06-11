
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { 
  Home, 
  Users, 
  FileText, 
  BarChart3, 
  Settings, 
  UserPlus,
  Wrench,
  Package,
  ClipboardList
} from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();
  const { user } = useAuth();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home, roles: ['admin', 'manager', 'engineer'] },
    { name: 'Leads', href: '/leads', icon: Users, roles: ['admin', 'manager', 'engineer'] },
    { name: 'Proposals', href: '/proposals', icon: FileText, roles: ['admin', 'manager', 'engineer'] },
    { name: 'Reports', href: '/reports', icon: BarChart3, roles: ['admin', 'manager'] },
    { name: 'Proposal Templates', href: '/masters/proposal-templates', icon: ClipboardList, roles: ['admin', 'manager', 'engineer'] },
    { name: 'Spare Parts', href: '/masters/spare-parts', icon: Wrench, roles: ['admin', 'manager', 'engineer'] },
    { name: 'Products', href: '/masters/products', icon: Package, roles: ['admin', 'manager', 'engineer'] },
    { name: 'User Management', href: '/users', icon: UserPlus, roles: ['admin'] },
    { name: 'Settings', href: '/settings', icon: Settings, roles: ['admin', 'manager', 'engineer'] },
  ];

  const filteredNavigation = navigation.filter(item => 
    item.roles.includes(user?.role || '')
  );

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-full">
      <div className="p-6">
        <h2 className="text-lg font-semibold text-gray-900">Navigation</h2>
      </div>
      <nav className="mt-6">
        <div className="px-3 space-y-1">
          {filteredNavigation.map((item) => {
            const isActive = location.pathname === item.href || 
                           (item.href !== '/dashboard' && location.pathname.startsWith(item.href));
            
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  'group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                  isActive
                    ? 'bg-orange-100 text-orange-900 border-r-2 border-orange-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                )}
              >
                <item.icon
                  className={cn(
                    'mr-3 h-5 w-5 flex-shrink-0',
                    isActive ? 'text-orange-600' : 'text-gray-400 group-hover:text-gray-500'
                  )}
                />
                {item.name}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
