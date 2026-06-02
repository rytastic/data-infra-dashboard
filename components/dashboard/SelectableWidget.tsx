'use client';

export default function SelectableWidget({
  id,
  selectedIds,
  onSelect,
  children,
  className = '',
}: {
  id: string;
  selectedIds: string[];
  onSelect: (id: string, shiftKey: boolean) => void;
  children: React.ReactNode;
  className?: string;
}) {
  const isSelected = selectedIds.includes(id);
  return (
    <div
      className={`rounded-xl cursor-pointer transition-all duration-150 ${className}`}
      style={
        isSelected
          ? { boxShadow: '0 0 0 2px #3b82f6, 0 0 0 5px rgba(59,130,246,0.18)', borderRadius: 12 }
          : { boxShadow: '0 0 0 2px transparent', borderRadius: 12 }
      }
      onClick={(e) => { e.stopPropagation(); onSelect(id, e.shiftKey); }}
    >
      {children}
    </div>
  );
}
