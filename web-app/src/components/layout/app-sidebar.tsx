import React from 'react'
import { useAuth } from '@/stores/auth-context.tsx'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar.tsx'
import { getSidebarData } from '@/components/layout/data/sidebar-data.ts'
import { NavGroup } from '@/components/layout/nav-group.tsx'
import { NavUser } from '@/components/layout/nav-user.tsx'
import { TeamSwitcher } from '@/components/layout/team-switcher.tsx'

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { currentUser } = useAuth()
  const sidebarData = getSidebarData(currentUser?.role)

  return (
    <Sidebar collapsible='icon' variant='floating' {...props}>
      <SidebarHeader>
        <TeamSwitcher />
      </SidebarHeader>
      <SidebarContent>
        {sidebarData.navGroups.map((props) => (
          <NavGroup key={props.title} {...props} />
        ))}
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
