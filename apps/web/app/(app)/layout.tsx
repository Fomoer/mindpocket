"use client"

import { GlobalSearchDialog } from "@/components/search/global-search-dialog"
import { SearchDialogProvider } from "@/components/search/search-dialog-provider"
import { SidebarLeft } from "@/components/sidebar-left"
import { SidebarProvider } from "@/components/ui/sidebar"

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <SearchDialogProvider>
        <SidebarLeft />
        {children}
        <GlobalSearchDialog />
      </SearchDialogProvider>
    </SidebarProvider>
  )
}
