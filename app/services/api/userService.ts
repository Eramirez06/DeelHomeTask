/**
 * User Service
 * Handles all user-related API calls
 */
import { ApiService, ApiResult } from "./apiService"
import { User, UsersApiResponse } from "./userTypes"

// Create a dedicated instance for the DummyJSON API
const userApiService = new ApiService({
  baseURL: "https://dummyjson.com",
  timeout: 10000,
})

/**
 * Get all users from the API
 */
export async function getUsers(): Promise<ApiResult<UsersApiResponse>> {
  return userApiService.get<UsersApiResponse>("/users")
}

/**
 * Get users with pagination
 */
export async function getUsersPaginated(
  limit: number = 30,
  skip: number = 0,
): Promise<ApiResult<UsersApiResponse>> {
  return userApiService.get<UsersApiResponse>("/users", { limit, skip })
}

/**
 * Get a single user by ID
 */
export async function getUserById(id: number): Promise<ApiResult<User>> {
  return userApiService.get<User>(`/users/${id}`)
}

/**
 * Search users by query
 */
export async function searchUsers(query: string): Promise<ApiResult<UsersApiResponse>> {
  return userApiService.get<UsersApiResponse>("/users/search", { q: query })
}
