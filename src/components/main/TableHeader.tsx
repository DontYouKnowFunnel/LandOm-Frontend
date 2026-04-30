const TableHeader = ({ children }: { children: React.ReactNode }) => (
  <th className="text-left text-xs font-semibold text-slate-500 py-2 px-4 whitespace-nowrap">
    {children}
  </th>
);

export default TableHeader;
