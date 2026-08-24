import type { UserRole } from '@/typings';
import {
  BarChart3,
  Building2,
  CalendarDays,
  Compass,
  FileText,
  Heart,
  HeartPulse,
  History,
  Layers,
  LayoutDashboard,
  ShieldAlert,
  Trophy,
  UserCheck,
  Users,
  Users2,
  Wallet,
} from 'lucide-react';

type SectorName = 'Health' | 'Peace' | 'Sports' | 'Infrastructure' | 'Women' | 'Senior';

type NavItem = {
  id: string;
  label: string;
  icon: React.ElementType;
  badge?: number;
  description: string;
  isRolePrimary?: boolean;
};

// Determine Sector Icon for Councilors
export const getSectorIcon = (sectorName?: string) => {
  switch (sectorName) {
    case 'Health & Sanitation':
      return HeartPulse;
    case 'Peace & Order':
      return ShieldAlert;
    case 'Youth & Sports':
      return Trophy;
    case 'Senior Citizens & PWD':
      return Heart;
    case 'Infrastructure & Education':
      return Building2;
    case 'Women & Family':
      return Users2;
    default:
      return Layers;
  }
};

// Build role-specific menu sections
export const getNavSections = (role: UserRole, sector?: SectorName) => {
  const overviewItem: NavItem = {
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    description: 'Barangay Overview',
  };

  const residentsItem: NavItem = {
    id: 'residents',
    label: 'Residents',
    icon: Users,
    description: 'Citizens & Puroks',
  };

  const financeItem: NavItem = {
    id: 'finance',
    label: 'Budget & Finance',
    icon: Wallet,
    // badge: pendingDisbursements > 0 ? pendingDisbursements : undefined,
    description: role === 'treasurer' ? 'Disbursements & Collections' : 'AIP & Fund Utilization',
    isRolePrimary: role === 'treasurer',
  };

  const docsItem: NavItem = {
    id: 'documents',
    label: 'Clearances & Docs',
    icon: FileText,
    // badge: pendingDocs > 0 ? pendingDocs : undefined,
    description: 'Clearances & Certifications',
    isRolePrimary: role === 'secretary',
  };

  const meetingsItem: NavItem = {
    id: 'meetings',
    label: 'Meetings & Sessions',
    icon: CalendarDays,
    // badge: scheduledMeetings > 0 ? scheduledMeetings : undefined,
    description: 'Sangguniang Sessions',
  };

  const accountsItem: NavItem = {
    id: 'accounts',
    label: 'Accounts & Roles',
    icon: UserCheck,
    description: 'Staff & Role Access',
    isRolePrimary: true,
  };

  const SectorIcon = getSectorIcon(sector);
  const committeeItem: NavItem = {
    id: 'sectors',
    label: sector ? `Committee: ${sector}` : 'Standing Committees',
    icon: SectorIcon,
    description: 'Thematic Areas',
    // isRolePrimary: role === 'council',
  };

  const geoSectorItem: NavItem = {
    id: 'geographic-sectors',
    label: 'Geographic Sectors',
    icon: Compass,
    description: 'Zones & Mapping',
  };

  const blottersItem: NavItem = {
    id: 'blotters',
    label: 'Blotters & Lupon',
    icon: ShieldAlert,
    // badge: pendingBlotters > 0 ? pendingBlotters : undefined,
    description: 'Katarungang Pambarangay',
  };

  const reportsItem: NavItem = {
    id: 'reports',
    label: 'Reports & Analytics',
    icon: BarChart3,
    description: 'Demographics & Audit',
  };

  const auditItem: NavItem = {
    id: 'audit',
    label: 'Audit Trail',
    icon: History,
    description: 'Action Logs',
  };

  if (role === 'councilor') {
    return [
      {
        title: 'My Council Committee',
        items: [committeeItem],
      },
      {
        title: 'Geographic Mapping',
        items: [geoSectorItem],
      },
      {
        title: 'Sangguniang Barangay',
        items: [overviewItem, meetingsItem, docsItem],
      },
      {
        title: 'Administration & Audit',
        items: [financeItem, blottersItem, reportsItem, auditItem],
      },
    ];
  }

  if (role === 'treasurer') {
    return [
      {
        title: 'Financial Office',
        items: [financeItem],
      },
      {
        title: 'Revenue & Records',
        items: [overviewItem, docsItem, geoSectorItem, committeeItem],
      },
      {
        title: 'Governance & Analytics',
        items: [meetingsItem, reportsItem, auditItem],
      },
    ];
  }

  if (role === 'secretary') {
    return [
      {
        title: 'Secretariat Workspace',
        items: [docsItem, residentsItem, meetingsItem, accountsItem],
      },
      {
        title: 'Administration & Areas',
        items: [overviewItem, committeeItem, geoSectorItem, blottersItem],
      },
      {
        title: 'Finance & Audit',
        items: [financeItem, reportsItem, auditItem],
      },
    ];
  }

  // Default / Captain Executive View
  return [
    {
      title: 'Executive Suite',
      items: [overviewItem, docsItem, financeItem, blottersItem, accountsItem],
    },
    {
      title: 'Council & Geographic Areas',
      items: [committeeItem, geoSectorItem, residentsItem, meetingsItem],
    },
    {
      title: 'Analytics & Audit',
      items: [reportsItem, auditItem],
    },
  ];
};
