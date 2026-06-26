import React, { useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { Search, LayoutDashboard, KanbanSquare, BookmarkCheck, MessageSquare, BarChart3, Settings, Menu, X, ChevronRight } from "lucide-react";

const LOGO_URL = "https://media.base44.com/images/public/user_6a3c32b51d15a36c87eabe7f/b3a8a95ad_aa7a345c-35d5-4aee-97a7-f15c5c2e94d5.jpeg";

const navItems = [
  { label: "Lead Finder", path: "/leads", icon: Search },
  { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { label: "Pipeline", path: "/pipeline", icon: KanbanSquare },
  { label: "Saved Lists", path: "/lists", icon: BookmarkCheck },
  { label: "Outreach", path: "/outreach", icon: MessageSquare },
  { label: "Analytics", path: "/analytics", icon: BarChart3 },
  { label: "Settings", path: "/settings", icon: Settings },
];

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 flex flex-col`}
        style={{ background: "hsl(222 47% 11%)" }}>
        
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-white/10">
          <img src={LOGO_URL} alt="Higgins Digital" className="w-9 h-9 rounded-lg object-contain" />
          <div>
            <p className="text-white font-display font-bold text-sm tracking-wider">HIGGINS</p>
            <p className="text-amber-400 text-[10px] font-display tracking-[0.25em]">LEAD ENGINE</p>
          </div>
          <button className="ml-auto lg:hidden text-white/60" onClick={() => setSidebarOpen(false)}>
            <X size={20} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + "/");
            return (
              <Link key={item.path} to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${
                  isActive
                    ? "bg-amber-400/10 text-amber-400"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                }`}>
                <item.icon size={18} className={isActive ? "text-amber-400" : "text-white/40 group-hover:text-white/70"} />
                {item.label}
                {isActive && <ChevronRight size={14} className="ml-auto text-amber-400/60" />}
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="px-4 py-4 border-t border-white/10">
          <Link to="/" className="text-white/40 hover:text-white/70 text-xs transition-colors">
            ← Back to Home
          </Link>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-14 flex items-center px-4 lg:px-6 border-b border-border bg-white shrink-0">
          <button className="lg:hidden mr-3 text-foreground/60 hover:text-foreground" onClick={() => setSidebarOpen(true)}>
            <Menu size={22} />
          </button>
          <div className="flex-1" />
          <span className="text-xs text-muted-foreground bg-amber-50 text-amber-700 px-2.5 py-1 rounded-full font-medium">
            Demo Mode
          </span>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
