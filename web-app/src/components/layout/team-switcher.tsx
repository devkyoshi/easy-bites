import {
  DropdownMenu,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu.tsx'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar.tsx'

export function TeamSwitcher() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size='lg'
              className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
            >
              <div className='text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg'>
                <img alt={'logo'} src={'/app/logo.png'} className='size-4' />
              </div>
              <div className='grid flex-1 text-left text-sm leading-tight'>
                <span className='truncate font-semibold'>EasyBites</span>
              </div>
            </SidebarMenuButton>
          </DropdownMenuTrigger>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
