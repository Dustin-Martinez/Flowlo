// components/sideBar.tsx
"use client";

import React, { useState, useRef, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { 
  Home, 
  CheckSquare, 
  Layout, 
  Settings,
  User,
  HelpCircle,
  LogOut,
  Plus,
  ChevronLeft,
  ChevronDown,
  Briefcase,
  Users,
} from "lucide-react";
import { useSession } from "@/src/app/hooks/useSession";
import { useSidebarCounts } from "@/src/app/hooks/useSidebarCounts";

const Sidebar: React.FC = () => {
  const { user } = useSession();
  const { todoCount, boardsCount } = useSidebarCounts();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeItem, setActiveItem] = useState("dashboard");
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();
  const displayName = user?.name ?? "User";
  const initials = displayName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) || "U";

  const menuItems = [
    { 
      id: "dashboard", 
      icon: <Home size={20} />, 
      label: "Dashboard", 
      path: "/dashboard" 
    },
    { 
      id: "todo", 
      icon: <CheckSquare size={20} />, 
      label: "To Do List", 
      path: "/dashboard/todo", 
      badge: String(todoCount) 
    },
    { 
      id: "boards", 
      icon: <Layout size={20} />, 
      label: "Boards", 
      path: "/dashboard/boards", 
      badge: String(boardsCount) 
    },
    { 
      id: "settings", 
      icon: <Settings size={20} />, 
      label: "Guide Lines", 
      path: "/dashboard/Guidelines" 
    },
  ];

  const workspaceItems = [
    { 
      id: "workspace-1", 
      name: "Flowlo Workspace", 
      color: "bg-gray-800",
      icon: <Briefcase size={14} className="text-white" />
    },
    { 
      id: "workspace-2", 
      name: "Personal", 
      color: "bg-gray-600",
      icon: <User size={14} className="text-white" />
    },
    { 
      id: "workspace-3", 
      name: "Design Team", 
      color: "bg-gray-700",
      icon: <Users size={14} className="text-white" />
    },
  ];

  // Close profile menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleItemClick = (itemId: string, path: string) => {
    setActiveItem(itemId);
    console.log(`Navigating to: ${itemId}`);
    
    if (itemId === "inbox") {
      setUnreadNotifications(0);
    }
    
    router.push(path);
  };

  const handleLogout = async () => {
    setShowProfileMenu(false);
    try {
      await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
      router.push("/");
    } catch {
      router.push("/");
    }
  };

  const profileMenuItems = [
    { id: "profile", label: "My Profile", icon: <User size={16} /> },
    { id: "settings", label: "Settings", icon: <Settings size={16} /> },
    { id: "help", label: "Help & Support", icon: <HelpCircle size={16} /> },
    { id: "logout", label: "Logout", icon: <LogOut size={16} />, destructive: true },
  ];

  const handleProfileMenuItemClick = (itemId: string) => {
    console.log(`Profile menu item clicked: ${itemId}`);
    setShowProfileMenu(false);
    
    if (itemId === "logout") {
      handleLogout();
    } else if (itemId === "settings") {
      setActiveItem("settings");
      router.push("/dashboard/settings");
    }
  };

  return (
    <aside className={`flex flex-col bg-white border-r border-gray-200 shadow-sm transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-64'
    }`}>
      {/* Profile Header */}
      <div className="p-5 border-b border-gray-100">
        <div className="flex items-center gap-3">
          {/* Profile with Dropdown */}
          <div className="relative" ref={profileMenuRef}>
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-3 hover:opacity-90 transition-opacity w-full group"
            >
              {/* User Profile Avatar */}
              <div className="relative">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                  <span className="text-white font-medium text-sm">{initials}</span>
                </div>
                {/* Online Status Indicator */}
                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></div>
              </div>
              
              {/* User Info (only shown when not collapsed) */}
              {!isCollapsed && (
                <div className="flex-1 min-w-0 text-left">
                  <div className="font-medium text-gray-900 text-sm">{displayName}</div>
                  <div className="text-xs text-gray-500 truncate">{user?.email ?? "Admin"}</div>
                </div>
              )}
              
              {/* Dropdown Arrow (only shown when not collapsed) */}
              {!isCollapsed && (
                <ChevronDown 
                  size={16}
                  className={`text-gray-400 transition-transform ${showProfileMenu ? 'rotate-180' : ''}`}
                />
              )}
            </button>
            
            {/* Profile Dropdown Menu */}
            {showProfileMenu && !isCollapsed && (
              <div className="absolute left-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                <div className="py-1">
                  {/* Header */}
                  <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50">
                    <div className="font-medium text-gray-900 text-sm">{displayName}</div>
                    <div className="text-xs text-gray-500">{user?.email ?? ""}</div>
                  </div>
                  
                  {/* Menu Items */}
                  {profileMenuItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleProfileMenuItemClick(item.id)}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors ${
                        item.destructive ? 'text-red-600 hover:text-red-700' : 'text-gray-700 hover:text-gray-900'
                      }`}
                    >
                      <span className={`${item.destructive ? 'text-red-500' : 'text-gray-500'}`}>
                        {item.icon}
                      </span>
                      <span>{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Collapse Toggle */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors ml-auto group"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <ChevronLeft 
              size={16}
              className={`text-gray-500 transition-transform group-hover:scale-110 ${isCollapsed ? 'rotate-180' : ''}`}
            />
          </button>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-1">
          {menuItems.map((item) => {
            const isActive = activeItem === item.id || pathname === item.path;
            return (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.id, item.path)}
                className={`w-full flex items-center justify-between p-2.5 rounded-lg transition-all duration-200 group ${
                  isActive
                    ? 'bg-gray-100 text-gray-900 border border-gray-200'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`transition-transform group-hover:scale-110 ${
                    isActive ? 'text-gray-900' : 'text-gray-500'
                  }`}>
                    {item.icon}
                  </span>
                  {!isCollapsed && (
                    <span className={`text-sm ${isActive ? 'font-medium' : 'font-normal'}`}>
                      {item.label}
                    </span>
                  )}
                </div>
                {!isCollapsed && (item.id === "todo" || item.id === "boards") && (
                  <span className="text-xs px-2 py-0.5 rounded-full min-w-[20px] flex items-center justify-center transition-all bg-gray-200 text-gray-700">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Workspaces Section */}
        {!isCollapsed && (
          <div className="mt-8">
            <div className="flex items-center justify-between mb-3 px-2">
              <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                Workspaces
              </div>
              <button className="p-1 rounded hover:bg-gray-100 transition-colors">
                <Plus size={14} className="text-gray-500" />
              </button>
            </div>
            <div className="space-y-2">
              {workspaceItems.map((workspace) => (
                <button
                  key={workspace.id}
                  className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-gray-50 transition-colors duration-200 w-full text-left group"
                >
                  <div className={`w-8 h-8 rounded-lg ${workspace.color} flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm`}>
                    {workspace.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 truncate">{workspace.name}</div>
                    <div className="text-xs text-gray-500">5 members</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

      </nav>

      {/* Logout Button */}
      {isCollapsed ? (
        <div className="p-4 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="w-full p-2 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors duration-200 flex items-center justify-center group"
            title="Logout"
          >
            <LogOut size={18} className="text-gray-500 group-hover:scale-110 transition-transform" />
          </button>
        </div>
      ) : (
        <div className="p-4 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="w-full p-2.5 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors duration-200 flex items-center justify-center gap-2 group"
          >
            <LogOut size={16} className="group-hover:scale-110 transition-transform" />
            <span className="text-sm">Logout</span>
          </button>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;