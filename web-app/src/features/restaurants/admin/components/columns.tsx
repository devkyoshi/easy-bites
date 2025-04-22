import { ColumnDef } from '@tanstack/react-table'
import { Checkbox } from '@/components/ui/checkbox.tsx'
import {DataTableColumnHeader} from "@/features/tasks/components/data-table-column-header.tsx";
import {statuses} from "@/features/tasks/data/data.tsx";
import {IRestaurant} from "@/features/restaurants/context/restaurant-context.tsx";


export const restaurantColumns: ColumnDef<IRestaurant>[] = [
  {
    id: 'select',
    header: ({ table }) => (
        <Checkbox
            checked={
                table.getIsAllPageRowsSelected() ||
                (table.getIsSomePageRowsSelected() && 'indeterminate')
            }
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label='Select all'
            className='translate-y-[2px]'
        />
    ),
    cell: ({ row }) => (
        <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label='Select row'
            className='translate-y-[2px]'
        />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'restaurantId',
    header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Restaurant ID' />
    ),
    cell: ({ row }) => <div className='w-[80px]'>{row.getValue('restaurantId')}</div>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'name',
    header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Name' />
    ),
    cell: ({ row }) => (
        <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
        {row.getValue('name')}
      </span>
    ),
  },
  {
    accessorKey: 'isOpen',
    header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Status' />
    ),
    cell: ({ row }) => {
      const status = statuses.find(
          (status) => status.value === row.getValue('isOpen')
      )

      if (!status) return null

      return (
          <div className='flex w-[100px] items-center'>
            {status.icon && (
                <status.icon className='text-muted-foreground mr-2 h-4 w-4' />
            )}
            <span>{status.label}</span>
          </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: 'description',
    header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Description' />
    ),
    cell: ({ row }) => (
        <div className='max-w-32 truncate sm:max-w-72 md:max-w-[31rem]'>
          {row.getValue('description')}
        </div>
    ),
  },
  /* {
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },*/
]