import { FC } from "react"
import { TextStyle, View, ViewStyle } from "react-native"

import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"

import { Text } from "./Text"

export interface ListEmptyStateProps {
  /**
   * The emoji icon to display
   */
  icon: string
  /**
   * The title/heading text
   */
  title: string
  /**
   * The descriptive message
   */
  message: string
  /**
   * Optional style override for the container
   */
  style?: ViewStyle
}

/**
 * A simple, reusable empty state component for lists
 * Displays an icon (emoji), title, and message
 */
export const ListEmptyState: FC<ListEmptyStateProps> = ({ icon, title, message, style }) => {
  const { themed } = useAppTheme()

  return (
    <View style={[themed($container), style]}>
      <Text style={themed($icon)} size="xxl">
        {icon}
      </Text>
      <Text preset="heading" style={themed($title)}>
        {title}
      </Text>
      <Text style={themed($message)}>{message}</Text>
    </View>
  )
}

const $container: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
  paddingHorizontal: spacing.xl,
  paddingVertical: spacing.xxxl,
})

const $icon: ThemedStyle<TextStyle> = ({ spacing }) => ({
  marginBottom: spacing.md,
})

const $title: ThemedStyle<TextStyle> = ({ spacing, colors }) => ({
  color: colors.text,
  marginBottom: spacing.sm,
  textAlign: "center",
})

const $message: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.textDim,
  textAlign: "center",
  lineHeight: 22,
})
