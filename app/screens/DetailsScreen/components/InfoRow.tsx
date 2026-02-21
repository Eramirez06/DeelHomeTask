import { FC } from "react"
import { TextStyle, View, ViewStyle } from "react-native"

import { Text } from "@/components/Text"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"

export interface InfoRowProps {
  /**
   * Label for the info row
   */
  label: string
  /**
   * Value to display
   */
  value: string
  /**
   * Optional test id for e2e checks
   */
  testID?: string
}

/**
 * Component to display a labeled information row
 */
export const InfoRow: FC<InfoRowProps> = ({ label, value, testID }) => {
  const { themed } = useAppTheme()

  return (
    <View testID={testID} style={themed($container)}>
      <Text style={themed($label)} size="sm">
        {label}
      </Text>
      <Text style={themed($value)} size="sm">
        {value}
      </Text>
    </View>
  )
}

const $container: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "row",
  justifyContent: "space-between",
  paddingVertical: spacing.xs,
  gap: spacing.sm,
})

const $label: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.textDim,
  flex: 1,
})

const $value: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.text,
  flex: 2,
  textAlign: "right",
})
