import React from "react";
import { MenuPosition } from "@/src/app/types/dashboard";
import { Archive, Trash2 } from "lucide-react";

interface FloatingMenuProps {
  isOpen: boolean;
  position: MenuPosition | null;
  menuRef: React.RefObject<HTMLDivElement | null>; // Allow null
  onArchive: (projectId: string) => void;
  onDelete: (projectId: string) => void;
  projectId: string;
}

export const FloatingMenu: React.FC<FloatingMenuProps> = ({
  isOpen,
  position,
  menuRef,
  onArchive,
  onDelete,
  projectId,
}) => {
  if (!isOpen || !position) return null;

  return (
    <div
      ref={menuRef}
      className="fixed z-50 bg-white border border-gray-200 rounded-lg shadow-lg py-1 min-w-[150px]"
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
      }}
    >
      <button
        onClick={() => onArchive(projectId)}
        className="w-full px-3 py-2 text-left text-gray-700 hover:bg-gray-50 flex items-center gap-2 text-sm"
      >
        <Archive className="w-3 h-3" />
        Archive
      </button>
      <button
        onClick={() => onDelete(projectId)}
        className="w-full px-3 py-2 text-left text-red-600 hover:bg-red-50 flex items-center gap-2 text-sm"
      >
        <Trash2 className="w-3 h-3" />
        Delete
      </button>
    </div>
  );
};