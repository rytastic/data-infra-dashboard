'use client';

import { useState } from 'react';
import { Button } from '@astryxdesign/core/Button';

function PencilGlyph() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487z" />
    </svg>
  );
}

export default function SelectableWidget({
  id,
  selectedIds,
  pendingIds = [],
  onSelect,
  children,
  className = '',
  onEdit,
}: {
  id: string;
  selectedIds: string[];
  pendingIds?: string[];
  onSelect: (id: string, shiftKey: boolean) => void;
  children: React.ReactNode;
  className?: string;
  onEdit?: (id: string) => void;
}) {
  const [isHovered, setIsHovered] = useState(false);
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
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
      {isPending && (
        <div className="absolute inset-0 rounded-xl bg-violet-500/[0.04] pointer-events-none" />
      )}
      {onEdit && isHovered && (
        <div className="absolute top-3 right-3 z-10">
          <div className="relative">
            <div
              aria-hidden="true"
              className="absolute pointer-events-none"
              style={{
                top: '-30%',
                right: '-30%',
                bottom: '-45%',
                left: '-100%',
                zIndex: 0,
                background: 'radial-gradient(ellipse 90% 90% at 64% 46%, rgba(255,255,255,0.95) 65%, rgba(255,255,255,0) 88%)',
              }}
            />
            <div className="relative" style={{ zIndex: 1 }}>
              <Button
                label="Edit"
                icon={<PencilGlyph />}
                variant="secondary"
                size="sm"
                onClick={(e) => { e.stopPropagation(); onEdit(id); }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
