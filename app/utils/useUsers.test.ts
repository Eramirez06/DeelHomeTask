import { act, renderHook, waitFor } from "@testing-library/react-native"

import { useUsers } from "./useUsers"
import { buildUser, buildUsersApiResponse } from "../../test/factories/userFactory"
import {
  mockGetUsersPaginated,
  mockSearchUsers,
  resetUserServiceMocks,
} from "../../test/mocks/userServiceMock"

jest.mock("@/services/api/userService", () => ({
  getUsersPaginated: (...args: [number?, number?]) => mockGetUsersPaginated(...args),
  searchUsers: (...args: [string]) => mockSearchUsers(...args),
}))

describe("useUsers", () => {
  beforeEach(() => {
    resetUserServiceMocks()
  })

  it("loads first page on mount and requests next page on loadMore", async () => {
    const firstPageUsers = Array.from({ length: 30 }, (_, index) =>
      buildUser({ id: index + 1, firstName: `User${index + 1}` }),
    )
    const secondPageUsers = Array.from({ length: 30 }, (_, index) =>
      buildUser({ id: index + 31, firstName: `User${index + 31}` }),
    )

    mockGetUsersPaginated
      .mockResolvedValueOnce({
        kind: "ok",
        data: buildUsersApiResponse(firstPageUsers, { total: 60, skip: 0, limit: 30 }),
      })
      .mockResolvedValueOnce({
        kind: "ok",
        data: buildUsersApiResponse(secondPageUsers, { total: 60, skip: 30, limit: 30 }),
      })

    const { result } = renderHook(() => useUsers())

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(mockGetUsersPaginated).toHaveBeenNthCalledWith(1, 30, 0)
    expect(result.current.users).toHaveLength(30)

    await act(async () => {
      await result.current.loadMore()
    })

    expect(mockGetUsersPaginated).toHaveBeenNthCalledWith(2, 30, 30)
    expect(result.current.users).toHaveLength(60)
    expect(result.current.hasMore).toBe(false)
  })
})
