const TableData = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <td className={`py-2.5 px-4 text-xs font-medium text-slate-900 ${className}`}>
    {children}
  </td>
);

export default TableData;
