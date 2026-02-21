/**
 * Custom hook to fetch a single user's details from the API
 */
import { useState, useEffect } from "react"

import { GeneralApiProblem } from "@/services/api/apiProblem"
import { getUserById } from "@/services/api/userService"
import { User } from "@/services/api/userTypes"

interface UseUserDetailsReturn {
  user: User | null
  isLoading: boolean
  error: GeneralApiProblem | null
  refetch: () => Promise<void>
}

/**
 * Hook to fetch a single user's details by ID
 * @param userId - The ID of the user to fetch
 * @returns Object containing user data, loading state, and error
 */
export function useUserDetails(userId: number): UseUserDetailsReturn {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<GeneralApiProblem | null>(null)

  const fetchUser = async () => {
    setIsLoading(true)
    setError(null)

    const result = await getUserById(userId)

    if (result.kind === "ok") {
      setUser(result.data)
    } else {
      setError(result.error)
    }

    setIsLoading(false)
  }

  useEffect(() => {
    fetchUser()
  }, [userId])

  return {
    user,
    isLoading,
    error,
    refetch: fetchUser,
  }
}
