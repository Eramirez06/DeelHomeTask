/**
 * Custom hook to fetch users from the API with pagination support
 */
import { useState, useEffect, useCallback, useRef } from "react"

import { GeneralApiProblem } from "@/services/api/apiProblem"
import { getUsersPaginated, searchUsers } from "@/services/api/userService"
import { User } from "@/services/api/userTypes"

interface UseUsersReturn {
  users: User[]
  isLoading: boolean
  isLoadingMore: boolean
  isRefreshing: boolean
  error: GeneralApiProblem | null
  loadMore: () => Promise<void>
  refresh: () => Promise<void>
  hasMore: boolean
  searchQuery: string
  setSearchQuery: (query: string) => void
  isSearching: boolean
  isTyping: boolean
}

const LIMIT = 30

/**
 * Hook to fetch users from the DummyJSON API with infinite scroll pagination
 * @returns Object containing users array, loading states, error, and pagination functions
 */
export function useUsers(): UseUsersReturn {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false)
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false)
  const [error, setError] = useState<GeneralApiProblem | null>(null)
  const [total, setTotal] = useState<number>(0)
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [isSearching, setIsSearching] = useState<boolean>(false)
  const [isTyping, setIsTyping] = useState<boolean>(false)

  const skipRef = useRef<number>(0)
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const isInitialMount = useRef<boolean>(true)

  const fetchUsers = useCallback(async (reset: boolean = false) => {
    if (reset) {
      skipRef.current = 0
      setIsLoadingMore(false)
    } else {
      setIsLoadingMore(true)
    }

    setError(null)
    const result = await getUsersPaginated(LIMIT, skipRef.current)

    if (result.kind === "ok") {
      setTotal(result.data.total)
      setUsers((prev) => (reset ? result.data.users : [...prev, ...result.data.users]))
      skipRef.current += LIMIT
    } else {
      setError(result.error)
    }

    setIsLoading(false)
    setIsLoadingMore(false)
  }, [])

  const loadMore = useCallback(async () => {
    if (isLoadingMore || skipRef.current >= total) return
    await fetchUsers(false)
  }, [isLoadingMore, total, fetchUsers])

  const performSearch = useCallback(
    async (query: string) => {
      if (!query.trim()) {
        skipRef.current = 0
        await fetchUsers(true)
        return
      }

      setError(null)
      const result = await searchUsers(query)

      if (result.kind === "ok") {
        setUsers(result.data.users)
        setTotal(result.data.total)
        skipRef.current = result.data.users.length
      } else {
        setError(result.error)
      }
    },
    [fetchUsers],
  )

  const refresh = useCallback(async () => {
    setIsRefreshing(true)
    if (searchQuery.trim()) {
      await performSearch(searchQuery)
    } else {
      skipRef.current = 0
      await fetchUsers(true)
    }
    setIsRefreshing(false)
  }, [searchQuery, fetchUsers, performSearch])

  // Debounce search with 500ms delay
  useEffect(() => {
    if (isInitialMount.current) return

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }

    setIsTyping(true)
    setIsSearching(false)

    searchTimeoutRef.current = setTimeout(async () => {
      setIsTyping(false)
      setIsSearching(true)
      await performSearch(searchQuery)
      setIsSearching(false)
    }, 500)

    return () => {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current)
    }
  }, [searchQuery, performSearch])

  // Initial load
  useEffect(() => {
    fetchUsers(true).then(() => {
      isInitialMount.current = false
    })
  }, [fetchUsers])

  const hasMore = total > 0 && skipRef.current < total && !searchQuery.trim()

  return {
    users,
    isLoading,
    isLoadingMore,
    isRefreshing,
    error,
    loadMore,
    refresh,
    hasMore,
    searchQuery,
    setSearchQuery,
    isSearching,
    isTyping,
  }
}
