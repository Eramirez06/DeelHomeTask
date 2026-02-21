import { NavigationContainer } from "@react-navigation/native"
import { fireEvent, render } from "@testing-library/react-native"
import { SafeAreaProvider } from "react-native-safe-area-context"

import { ThemeProvider } from "@/theme/context"
import { useUsers } from "@/utils/useUsers"

import { HomeScreen } from "./HomeScreen"
import { buildUser } from "../../../test/factories/userFactory"
import { mockSearchUsers, resetUserServiceMocks } from "../../../test/mocks/userServiceMock"

jest.mock("@/utils/useUsers", () => ({
  useUsers: jest.fn(),
}))

const mockedUseUsers = jest.mocked(useUsers)

function createHomeScreenProps() {
  return {
    navigation: {
      navigate: jest.fn(),
    },
    route: {
      key: "Home-test",
      name: "Home",
      params: undefined,
    },
  }
}

function renderHomeScreen() {
  const props = createHomeScreenProps()
  const buildTree = () => (
    <SafeAreaProvider>
      <ThemeProvider>
        <NavigationContainer>
          <HomeScreen navigation={props.navigation as never} route={props.route as never} />
        </NavigationContainer>
      </ThemeProvider>
    </SafeAreaProvider>
  )
  const screen = render(buildTree())

  const rerenderScreen = () => {
    screen.rerender(buildTree())
  }

  return { ...screen, props, rerenderScreen }
}

describe("HomeScreen", () => {
  beforeEach(() => {
    mockedUseUsers.mockReset()
    resetUserServiceMocks()
  })

  const baseUseUsersState = {
    users: [],
    isLoading: false,
    isLoadingMore: false,
    isRefreshing: false,
    error: null,
    loadMore: jest.fn(),
    refresh: jest.fn(),
    hasMore: false,
    searchQuery: "",
    setSearchQuery: jest.fn(),
    isSearching: false,
    isTyping: false,
  }

  it("renders loading state", () => {
    mockedUseUsers.mockReturnValue({
      ...baseUseUsersState,
      isLoading: true,
    })

    const { getByText } = renderHomeScreen()

    expect(getByText("Loading users...")).toBeTruthy()
  })

  it("renders users and navigates to details on user press", () => {
    mockedUseUsers.mockReturnValue({
      ...baseUseUsersState,
      users: [buildUser({ id: 1, firstName: "John", lastName: "Doe" })],
      hasMore: true,
    })

    const { getByText, props } = renderHomeScreen()

    fireEvent.press(getByText("John Doe"))

    expect(props.navigation.navigate).toHaveBeenCalledWith("Details", { userId: 1 })
    expect(getByText("1 users available")).toBeTruthy()
  })

  it("handles search flow: calls API, shows results, and renders empty/error states", () => {
    const searchResultUser = buildUser({ id: 2, firstName: "John", lastName: "Search" })
    const state: ReturnType<typeof useUsers> = {
      ...baseUseUsersState,
      users: [buildUser({ id: 1, firstName: "Emily", lastName: "Johnson" })],
      hasMore: true,
    }

    state.setSearchQuery = jest.fn((query: string) => {
      state.searchQuery = query
      if (query.trim().length > 0) {
        void mockSearchUsers(query)
        state.users = [searchResultUser]
      }
    })

    mockedUseUsers.mockImplementation(() => state)

    const { getByPlaceholderText, getByText, rerenderScreen, queryByText } = renderHomeScreen()

    fireEvent.changeText(getByPlaceholderText("Search users..."), "John")
    rerenderScreen()

    expect(state.setSearchQuery).toHaveBeenCalledWith("John")
    expect(mockSearchUsers).toHaveBeenCalledWith("John")
    expect(getByText("John Search")).toBeTruthy()

    state.users = []
    rerenderScreen()
    expect(getByText("No Results")).toBeTruthy()

    state.error = { kind: "unknown", temporary: true }
    state.searchQuery = ""
    rerenderScreen()
    expect(getByText("Oops!")).toBeTruthy()
    expect(queryByText("No Results")).toBeNull()
  })
})
