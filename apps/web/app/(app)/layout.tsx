"use client"

import dynamic from "next/dynamic"
import { GlobalSearchDialog } from "@/components/search/global-search-dialog"
import { SearchDialogProvider } from "@/components/search/search-dialog-provider"
import { SidebarProvider } from "@/components/ui/sidebar"

const SidebarLeft = dynamic(() => import("@/components/sidebar-left").then((m) => m.SidebarLeft), {
  ssr: false,
})

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
