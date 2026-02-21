import { FC, ReactNode, useState } from "react"
import { LayoutChangeEvent, Pressable, TextStyle, View, ViewStyle } from "react-native"
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated"

import { Text } from "@/components/Text"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"

export interface InfoSectionProps {
  /**
   * Section title
   */
  title: string
  /**
   * Content to display when expanded
   */
  children: ReactNode
  /**
   * Initially expanded state
   */
  defaultExpanded?: boolean
}

/**
 * Animated accordion section component for displaying collapsible information
 */
export const InfoSection: FC<InfoSectionProps> = ({ title, children, defaultExpanded = false }) => {
  const { themed } = useAppTheme()
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)
  const [measuredHeight, setMeasuredHeight] = useState(0)
  const rotation = useSharedValue(defaultExpanded ? 180 : 0)
  const animatedHeight = useSharedValue(defaultExpanded ? 1 : 0)

  const onContentLayout = (event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout
    if (height > 0 && measuredHeight !== height) {
      setMeasuredHeight(height)
    }
  }

  const toggleExpanded = () => {
    const newExpandedState = !isExpanded
    setIsExpanded(newExpandedState)

    rotation.value = withSpring(newExpandedState ? 180 : 0)
    animatedHeight.value = withTiming(newExpandedState ? 1 : 0, {
      duration: 300,
    })
  }

  const chevronStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }))

  const contentContainerStyle = useAnimatedStyle(() => {
    return {
      height: animatedHeight.value * measuredHeight,
      opacity: animatedHeight.value,
      overflow: "hidden",
    }
  })

  return (
    <View style={themed($container)}>
      <Pressable
        style={({ pressed }) => [themed($header), pressed && themed($pressed)]}
        onPress={toggleExpanded}
      >
        <Text preset="subheading" style={themed($title)}>
          {title}
        </Text>
        <Animated.View style={chevronStyle}>
          <Text style={themed($chevron)}>▼</Text>
        </Animated.View>
      </Pressable>

      <Animated.View style={contentContainerStyle}>
        <View style={themed($content)} onLayout={onContentLayout}>
          {children}
        </View>
      </Animated.View>
    </View>
  )
}

const $container: ThemedStyle<ViewStyle> = ({ colors }) => ({
  borderBottomWidth: 1,
  borderBottomColor: colors.border,
})

const $header: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  paddingHorizontal: spacing.lg,
  paddingVertical: spacing.md,
})

const $pressed: ThemedStyle<ViewStyle> = ({ colors }) => ({
  backgroundColor: colors.palette.neutral100,
})

const $title: ThemedStyle<TextStyle> = () => ({
  flex: 1,
})

const $chevron: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.text,
  fontSize: 14,
})

const $content: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingHorizontal: spacing.lg,
  paddingBottom: spacing.sm,
})
