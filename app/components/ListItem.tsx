import { FlatList, FlatListProps } from "react-native"

export interface ListItemListProps<T> extends FlatListProps<T> {}

export function ListItemList<T>(props: Readonly<ListItemListProps<T>>) {
  return (
    <FlatList
      initialNumToRender={10}
      maxToRenderPerBatch={10}
      windowSize={5}
      removeClippedSubviews={true}
      onEndReachedThreshold={0.5}
      {...props}
    />
  )
}
