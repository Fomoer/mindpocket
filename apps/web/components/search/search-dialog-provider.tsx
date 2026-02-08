"use client"

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"
import type { SearchMode } from "@/lib/search/types"
import { parseSearchMode } from "@/lib/search/types"

interface SearchDialogContextValue {
  open: boolean
  setOpen: (open: boolean) => void
  openSearchDialog: () => void
  closeSearchDialog: () => void
  mode: SearchMode
  setMode: (mode: SearchMode) => void
}

const SearchDialogContext = createContext<SearchDialogContextValue | null>(null)

export function SearchDialogProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const [mode, setModeState] = useState<SearchMode>("hybrid")

  const setMode = useCallback((nextMode: SearchMode) => {
    setModeState(parseSearchMode(nextMode, "hybrid"))
  }, [])

  const openSearchDialog = useCallback(() => {
    setOpen(true)
  }, [])

  const closeSearchDialog = useCallback(() => {
    setOpen(false)
  }, [])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault()
        setOpen(true)
      }
    }

    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [])

  const value = useMemo(
    () => ({
      open,
      setOpen,
      openSearchDialog,
      closeSearchDialog,
      mode,
      setMode,
    }),
    [closeSearchDialog, mode, open, openSearchDialog, setMode]
  )

  return <SearchDialogContext.Provider value={value}>{children}</SearchDialogContext.Provider>
}

export function useSearchDialog() {
  const context = useContext(SearchDialogContext)
  if (!context) {
    throw new Error("useSearchDialog must be used within SearchDialogProvider")
  }
  return context
}
