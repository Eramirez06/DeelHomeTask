import { ApiResult } from "@/services/api/apiService"
import { UsersApiResponse } from "@/services/api/userTypes"

export const mockGetUsersPaginated = jest.fn<
  Promise<ApiResult<UsersApiResponse>>,
  [number?, number?]
>()

export const mockSearchUsers = jest.fn<Promise<ApiResult<UsersApiResponse>>, [string]>()

export function resetUserServiceMocks(): void {
  mockGetUsersPaginated.mockReset()
  mockSearchUsers.mockReset()
}
