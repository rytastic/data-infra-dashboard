'use client';

import { Button } from '@astryxdesign/core/Button';
import { NavIcon } from '@astryxdesign/core/NavIcon';
import {
  SideNav,
  SideNavHeading,
  SideNavItem,
  SideNavSection,
} from '@astryxdesign/core/SideNav';

export interface NavItem {
  id: string;
  label: string;
  isPlaceholder?: boolean;
}

export interface NavSection {
  id: string;
  label: string;
  items: NavItem[];
}

interface Props {
  sections: NavSection[];
  activeId?: string;
  collapsed?: boolean;
  onItemClick?: (id: string) => void;
  onNewDash?: () => void;
  onToggleCollapse?: () => void;
}

function TeamStarIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
    </svg>
  );
}

function DashboardIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  );
}

function PlusIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
    </svg>
  );
}

export default function AppSidebar({
  sections,
  activeId,
  collapsed = false,
  onItemClick,
  onNewDash,
  onToggleCollapse,
}: Props) {
  return (
    <SideNav
      collapsible={{
        isCollapsed: collapsed,
        onCollapsedChange: onToggleCollapse,
        hasButton: true,
      }}
      header={
        <SideNavHeading
          icon={<NavIcon icon={<DashboardIcon style={{ width: 16, height: 16 }} />} />}
          heading="Cyclones Dashboard"
        />
      }
      topContent={
        <Button
          label="New dash"
          icon={<PlusIcon style={{ width: 16, height: 16 }} />}
          onClick={onNewDash}
          variant="primary"
          isIconOnly={collapsed}
          tooltip={collapsed ? 'New dash' : undefined}
          style={{ width: '100%' }}
        />
      }
    >
      {sections.map((section) => (
        <SideNavSection key={section.id} title={section.label}>
          {section.items.map((item) => (
            <SideNavItem
              key={item.id}
              label={item.label}
              icon={TeamStarIcon}
              isSelected={item.id === activeId}
              isDisabled={item.isPlaceholder}
              onClick={() => onItemClick?.(item.id)}
            />
          ))}
        </SideNavSection>
      ))}
    </SideNav>
  );
}
