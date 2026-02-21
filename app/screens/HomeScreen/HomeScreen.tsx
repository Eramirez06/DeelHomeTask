import { FC, useCallback } from "react"
import { ActivityIndicator, RefreshControl, TextStyle, View, ViewStyle } from "react-native"

import { ListEmptyState } from "@/components/ListEmptyState"
import { ListItemList } from "@/components/ListItem"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { TextField } from "@/components/TextField"
import {
  EMPTY_STATE_ERROR,
  EMPTY_STATE_NO_USERS,
  getSearchEmptyState,
} from "@/constants/emptyStates"
import type { AppStackScreenProps } from "@/navigators/navigationTypes"
import { User } from "@/services/api/userTypes"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"
import { useUsers } from "@/utils/useUsers"

import { UserItem } from "./components/UserItem"

const ITEM_HEIGHT = 100

export const HomeScreen: FC<AppStackScreenProps<"Home">> = function HomeScreen({ navigation }) {
  const { themed, theme } = useAppTheme()
  const {
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
  } = useUsers()

  const renderSearchSpinner = useCallback(() => {
    if (!isTyping && !isSearching) return null
    return <ActivityIndicator size="small" color={theme.colors.tint} style={$searchIndicator} />
  }, [isTyping, isSearching, theme.colors.tint])

  const handleUserPress = useCallback(
    (userId: number) => {
      navigation.navigate("Details", { userId })
    },
    [navigation],
  )

  const renderItem = useCallback(
    ({ item }: { item: User }) => <UserItem user={item} onPress={() => handleUserPress(item.id)} />,
    [handleUserPress],
  )

  const keyExtractor = useCallback((item: User) => item.id.toString(), [])

  const getItemLayout = useCallback(
    (_: ArrayLike<User> | null | undefined, index: number) => ({
      length: ITEM_HEIGHT,
      offset: ITEM_HEIGHT * index,
      index,
    }),
    [],
  )

  const handleEndReached = useCallback(() => {
    if (hasMore && !isLoadingMore) {
      loadMore()
    }
  }, [hasMore, isLoadingMore, loadMore])

  const renderFooter = useCallback(() => {
    if (!isLoadingMore) return null

    return (
      <View style={themed($footerContainer)}>
        <ActivityIndicator size="small" color={theme.colors.tint} />
        <Text style={themed($footerText)} size="sm">
          Loading more users...
        </Text>
      </View>
    )
  }, [isLoadingMore, themed, theme.colors.tint])

  const renderRefreshControl = useCallback(
    () => (
      <RefreshControl
        refreshing={isRefreshing}
        onRefresh={refresh}
        tintColor={theme.colors.tint}
        colors={[theme.colors.tint]}
      />
    ),
    [isRefreshing, refresh, theme.colors.tint],
  )

  const renderEmpty = useCallback(() => {
    if (isLoading) return null

    const hasSearchQuery = searchQuery.trim().length > 0
    const hasError = error !== null

    let emptyState = EMPTY_STATE_NO_USERS

    if (hasError) {
      emptyState = EMPTY_STATE_ERROR
    } else if (hasSearchQuery) {
      emptyState = getSearchEmptyState(searchQuery)
    }

    return <ListEmptyState {...emptyState} />
  }, [isLoading, searchQuery, error])

  if (isLoading) {
    return (
      <Screen preset="fixed" contentContainerStyle={themed($centerContainer)}>
        <ActivityIndicator size="large" color={theme.colors.tint} />
        <Text style={themed($loadingText)} preset="subheading">
          Loading users...
        </Text>
      </Screen>
    )
  }

  return (
    <Screen preset="fixed" safeAreaEdges={["top"]}>
      <View style={themed($header)}>
        <View style={$headerRow}>
          <Text preset="heading">Users</Text>
          <Text size="sm" style={themed($subtitle)}>
            {users.length} users available
          </Text>
        </View>
        <TextField
          testID="home-search-input"
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search users..."
          containerStyle={themed($searchContainer)}
          inputWrapperStyle={themed($searchInputWrapper)}
          RightAccessory={renderSearchSpinner}
        />
      </View>
      <ListItemList
        testID="home-users-list"
        data={users}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        getItemLayout={getItemLayout}
        onEndReached={handleEndReached}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmpty}
        refreshControl={renderRefreshControl()}
        contentContainerStyle={themed($listContent)}
      />
    </Screen>
  )
}

const $header: ThemedStyle<ViewStyle> = ({ spacing, colors }) => ({
  paddingHorizontal: spacing.lg,
  paddingTop: spacing.md,
  paddingBottom: spacing.md,
  backgroundColor: colors.background,
  borderBottomWidth: 1,
  borderBottomColor: colors.border,
})

const $headerRow: ViewStyle = {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 12,
}

const $subtitle: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.textDim,
})

const $searchContainer: ThemedStyle<ViewStyle> = () => ({
  marginTop: 0,
  marginBottom: 0,
})

const $searchInputWrapper: ThemedStyle<ViewStyle> = ({ colors }) => ({
  backgroundColor: colors.palette.neutral100,
  borderRadius: 8,
})

const $searchIndicator: ViewStyle = {
  marginRight: 8,
  alignSelf: "center",
}

const $listContent: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingHorizontal: spacing.md,
  paddingTop: spacing.sm,
})

const $centerContainer: ThemedStyle<ViewStyle> = () => ({
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
})

const $loadingText: ThemedStyle<TextStyle> = ({ spacing, colors }) => ({
  marginTop: spacing.md,
  color: colors.textDim,
})

const $footerContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingVertical: spacing.lg,
  alignItems: "center",
  justifyContent: "center",
})

const $footerText: ThemedStyle<TextStyle> = ({ spacing, colors }) => ({
  marginTop: spacing.xs,
  color: colors.textDim,
})
