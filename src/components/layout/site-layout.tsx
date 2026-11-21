"use client";

import { useCallback, useState, useSyncExternalStore, type ReactNode } from "react";
import { usePathname } from "next/navigation";

import { SiteSidebar } from "@/components/layout/site-sidebar";
import { SiteTopbar } from "@/components/layout/site-topbar";
import { MobileNavigation } from "@/components/layout/mobile-navigation";

interface SiteLayoutProps {
  children: ReactNode;
}

const SIDEBAR_STORAGE_KEY = "afterwork_sidebar_expanded";
const SIDEBAR_EVENT = "afterwork-sidebar-preference-change";

function subscribeToSidebarPreference(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(SIDEBAR_EVENT, callback);

  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(SIDEBAR_EVENT, callback);
  };
}

function getSidebarPreference() {
  return window.localStorage.getItem(SIDEBAR_STORAGE_KEY) === "true";
}

function getServerSidebarPreference() {
  return false;
}

export function SiteLayout({ children }: SiteLayoutProps) {
  const pathname = usePathname();

  const sidebarExpanded = useSyncExternalStore(subscribeToSidebarPreference, getSidebarPreference, getServerSidebarPreference);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isAuthPage = pathname === "/login" || pathname === "/register" || pathname.startsWith("/auth/");

  const toggleSidebar = useCallback(() => {
    const next = !sidebarExpanded;

    window.localStorage.setItem(SIDEBAR_STORAGE_KEY, String(next));

    window.dispatchEvent(new Event(SIDEBAR_EVENT));
  }, [sidebarExpanded]);

  const closeMobileMenu = useCallback(() => {
    setMobileMenuOpen(false);
  }, []);

  const toggleMobileMenu = useCallback(() => {
    setMobileMenuOpen((current) => !current);
  }, []);

  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen flex-1">
      <SiteSidebar expanded={sidebarExpanded} onToggle={toggleSidebar} />

      <div className="flex min-w-0 flex-1 flex-col">
        <SiteTopbar onMobileMenuClick={toggleMobileMenu} />

        <div className="flex min-h-0 flex-1 flex-col">{children}</div>
      </div>

      <MobileNavigation open={mobileMenuOpen} onClose={closeMobileMenu} />
    </div>
  );
}
