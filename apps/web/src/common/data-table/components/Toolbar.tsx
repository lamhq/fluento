import { useTableContext } from '../utils';
import ColumnSelector, { type ColumnSelectorOption } from './ColumnSelector';
import ResetFiltersButton from './ResetFiltersButton';

interface ToolbarContainerProps {
  children?: React.ReactNode;
}

export default function Toolbar({ children }: ToolbarContainerProps) {
  const table = useTableContext();
  return (
    <table.Subscribe
      selector={(state) => ({
        columnVisibility: state.columnVisibility,
        columnFilters: state.columnFilters,
        globalFilter: state.globalFilter as string,
      })}
    >
      {({ columnFilters, globalFilter }) => {
        const columns: ColumnSelectorOption[] = table
          .getAllLeafColumns()
          .filter((column) => column.getCanHide())
          .map((column) => ({
            id: column.id,
            label:
              typeof column.columnDef.header === 'string'
                ? column.columnDef.header
                : column.id,
            visible: column.getIsVisible(),
            onVisibilityChange: (visible) => {
              column.toggleVisibility(visible);
            },
          }));
        return (
          <div className="flex items-end gap-x-2">
            <div className="flex flex-1 flex-wrap gap-2">
              {children}
              <ResetFiltersButton
                isFiltered={columnFilters.length > 0 || Boolean(globalFilter)}
                onResetFilters={() => {
                  table.resetColumnFilters();
                  table.setGlobalFilter('');
                }}
              />
            </div>
            <ColumnSelector options={columns} />
          </div>
        );
      }}
    </table.Subscribe>
  );
}
