import { FC } from "react"
import {
  ActivityIndicator,
  Image,
  ImageStyle,
  ScrollView,
  TextStyle,
  View,
  ViewStyle,
} from "react-native"

import { ListEmptyState } from "@/components/ListEmptyState"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { EMPTY_STATE_ERROR } from "@/constants/emptyStates"
import type { AppStackScreenProps } from "@/navigators/navigationTypes"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"
import { useUserDetails } from "@/utils/useUserDetails"

import { InfoRow, InfoSection } from "./components"

export const DetailsScreen: FC<AppStackScreenProps<"Details">> = function DetailsScreen({ route }) {
  const { userId } = route.params
  const { themed, theme } = useAppTheme()
  const { user, isLoading, error } = useUserDetails(userId)

  if (isLoading) {
    return (
      <Screen preset="fixed" contentContainerStyle={themed($centerContainer)}>
        <ActivityIndicator size="large" color={theme.colors.tint} />
        <Text style={themed($loadingText)} preset="subheading">
          Loading user details...
        </Text>
      </Screen>
    )
  }

  if (error || !user) {
    return (
      <Screen preset="fixed" contentContainerStyle={themed($centerContainer)}>
        <ListEmptyState {...EMPTY_STATE_ERROR} />
      </Screen>
    )
  }

  return (
    <Screen preset="scroll" safeAreaEdges={["bottom"]}>
      <ScrollView contentContainerStyle={themed($container)}>
        {/* Header with Identity & Profile */}
        <View style={themed($headerSection)}>
          <Image source={{ uri: user.image }} style={$avatar} />
          <View style={$headerInfo}>
            <Text preset="heading" style={themed($name)}>
              {user.firstName} {user.lastName}
            </Text>
            <Text style={themed($subtitle)}>@{user.username}</Text>

            {/* Age and Gender badges */}
            <View style={$badgesContainer}>
              <View style={themed($badge)}>
                <Text style={themed($badgeText)} size="xs">
                  {user.age} years old
                </Text>
              </View>
              <View style={themed($badge)}>
                <Text style={themed($badgeText)} size="xs">
                  {user.gender}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Contact / Location */}
        <InfoSection title="Contact / Location">
          <InfoRow label="Email" value={user.email} />
          <InfoRow label="Phone" value={user.phone} />
          <InfoRow label="City" value={user.address.city} />
          <InfoRow label="Country" value={user.address.country} />
        </InfoSection>

        {/* Work / Education */}
        <InfoSection title="Work / Education">
          <InfoRow label="Company" value={user.company.name} />
          <InfoRow label="Title" value={user.company.title} />
          <InfoRow label="University" value={user.university} />
        </InfoSection>
      </ScrollView>
    </Screen>
  )
}

const $centerContainer: ThemedStyle<ViewStyle> = () => ({
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
})

const $loadingText: ThemedStyle<TextStyle> = ({ spacing, colors }) => ({
  marginTop: spacing.md,
  color: colors.textDim,
})

const $container: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingBottom: spacing.xl,
})

const $headerSection: ThemedStyle<ViewStyle> = ({ spacing, colors }) => ({
  flexDirection: "row",
  padding: spacing.lg,
  backgroundColor: colors.palette.neutral100,
  borderBottomWidth: 1,
  borderBottomColor: colors.border,
  alignItems: "center",
})

const $avatar: ImageStyle = {
  width: 100,
  height: 100,
  borderRadius: 50,
  marginRight: 16,
}

const $headerInfo: ViewStyle = {
  flex: 1,
  justifyContent: "center",
}

const $name: ThemedStyle<TextStyle> = ({ spacing }) => ({
  marginBottom: spacing.xxxs,
})

const $subtitle: ThemedStyle<TextStyle> = ({ colors, spacing }) => ({
  color: colors.textDim,
  marginBottom: spacing.sm,
})

const $badgesContainer: ViewStyle = {
  flexDirection: "row",
  gap: 8,
  flexWrap: "wrap",
}

const $badge: ThemedStyle<ViewStyle> = ({ colors }) => ({
  backgroundColor: colors.palette.neutral200,
  paddingHorizontal: 12,
  paddingVertical: 6,
  borderRadius: 16,
})

const $badgeText: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.text,
  fontWeight: "500",
  textTransform: "capitalize",
})
