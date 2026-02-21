import { NavigationContainer } from "@react-navigation/native"
import { fireEvent, render } from "@testing-library/react-native"
import { SafeAreaProvider } from "react-native-safe-area-context"

import { ThemeProvider } from "@/theme/context"
import { useUsers } from "@/utils/useUsers"

import { HomeScreen } from "./HomeScreen"
import { buildUser } from "../../test/factories/userFactory"

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
  const screen = render(
    <SafeAreaProvider>
      <ThemeProvider>
        <NavigationContainer>
          <HomeScreen navigation={props.navigation as never} route={props.route as never} />
        </NavigationContainer>
      </ThemeProvider>
    </SafeAreaProvider>,
  )

  return { ...screen, props }
}

describe("HomeScreen", () => {
  beforeEach(() => {
    mockedUseUsers.mockReset()
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
})
