import { FC, memo } from "react"
import { Image, ImageStyle, Pressable, TextStyle, View, ViewStyle } from "react-native"

import { Text } from "@/components/Text"
import { User } from "@/services/api/userTypes"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"

interface UserItemProps {
  user: User
  onPress: () => void
}

export const UserItem: FC<UserItemProps> = memo(function UserItem({ user, onPress }) {
  const { themed } = useAppTheme()

  return (
    <Pressable
      testID={`user-card-${user.id}`}
      style={({ pressed }) => [themed($userItemContainer), pressed && themed($pressed)]}
      onPress={onPress}
    >
      <Image source={{ uri: user.image }} style={$userAvatar} />
      <View style={$userInfo}>
        <Text style={themed($userName)} weight="semiBold" numberOfLines={1} ellipsizeMode="tail">
          {user.firstName} {user.lastName}
        </Text>
        <Text style={themed($userEmail)} size="sm" numberOfLines={1} ellipsizeMode="tail">
          {user.email}
        </Text>
        <View style={$userMetaRow}>
          <Text style={themed($userMeta)} size="xs" numberOfLines={1} ellipsizeMode="tail">
            {user.role} - {user.age} years old
          </Text>
          <Text style={themed($userMeta)} size="xs" numberOfLines={1} ellipsizeMode="tail">
            {user.company.department}
          </Text>
        </View>
      </View>
    </Pressable>
  )
})

const $userItemContainer: ThemedStyle<ViewStyle> = ({ spacing, colors }) => ({
  flexDirection: "row",
  padding: spacing.md,
  marginBottom: spacing.sm,
  backgroundColor: colors.palette.neutral100,
  borderRadius: 12,
  height: 100,
  alignItems: "center",
})

const $userAvatar: ImageStyle = {
  width: 60,
  height: 60,
  borderRadius: 30,
  marginRight: 12,
  flexShrink: 0,
}

const $userInfo: ViewStyle = {
  flex: 1,
  justifyContent: "center",
  overflow: "hidden",
}

const $userName: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.text,
  marginBottom: 4,
})

const $userEmail: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.textDim,
  marginBottom: 4,
})

const $userMetaRow: ViewStyle = {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  gap: 8,
}

const $userMeta: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.textDim,
  flexShrink: 1,
})

const $pressed: ThemedStyle<ViewStyle> = ({ colors }) => ({
  opacity: 0.7,
  backgroundColor: colors.palette.neutral200,
})
