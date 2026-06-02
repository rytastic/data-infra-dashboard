'use client';

export default function SelectableWidget({
  id,
  selectedIds,
  pendingIds = [],
  onSelect,
  children,
  className = '',
}: {
  id: string;
  selectedIds: string[];
  pendingIds?: string[];
  onSelect: (id: string, shiftKey: boolean) => void;
  children: React.ReactNode;
  className?: string;
}) {
  const isSelected = selectedIds.includes(id);
  const isPending = pendingIds.includes(id);

  return (
    <div
      className={`relative rounded-xl cursor-pointer transition-all duration-200 ${className}`}
      style={
        isPending
          ? { boxShadow: '0 0 0 2px #7c3aed, 0 0 0 6px rgba(124,58,237,0.18)', borderRadius: 12 }
          : isSelected
            ? { boxShadow: '0 0 0 2px #3b82f6, 0 0 0 5px rgba(59,130,246,0.18)', borderRadius: 12 }
            : { boxShadow: '0 0 0 2px transparent', borderRadius: 12 }
      }
      onClick={(e) => { e.stopPropagation(); onSelect(id, e.shiftKey); }}
    >
      {children}
      {isPending && (
        <div className="absolute inset-0 rounded-xl bg-violet-500/[0.04] pointer-events-none" />
      )}
    </div>
  );
}
