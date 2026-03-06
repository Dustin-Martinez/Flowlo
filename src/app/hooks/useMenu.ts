import { useState, useEffect, useRef, RefObject } from "react";

export const useMenu = () => {
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const [menuPosition, setMenuPosition] = useState<{ top: number; left: number } | null>(null);
  // Use the correct type for useRef with null initial value
  const menuRef = useRef<HTMLDivElement>(null);
  const menuButtonRefs = useRef<Map<string, HTMLElement>>(new Map());

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(null);
        setMenuPosition(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleMenu = (projectId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    event.preventDefault();
    
    const button = menuButtonRefs.current.get(projectId);
    if (button) {
      const rect = button.getBoundingClientRect();
      setMenuPosition({
        top: rect.bottom + window.scrollY + 8,
        left: rect.left + window.scrollX - 120
      });
    }
    
    setMenuOpen(menuOpen === projectId ? null : projectId);
  };

  const closeMenu = () => {
    setMenuOpen(null);
    setMenuPosition(null);
  };

  const registerMenuButton = (projectId: string, el: HTMLElement | null) => {
    if (el) {
      menuButtonRefs.current.set(projectId, el);
    } else {
      menuButtonRefs.current.delete(projectId);
    }
  };

  return {
    menuOpen,
    menuPosition,
    menuRef,
    registerMenuButton,
    toggleMenu,
    closeMenu,
    setMenuOpen,
    setMenuPosition
  };
};