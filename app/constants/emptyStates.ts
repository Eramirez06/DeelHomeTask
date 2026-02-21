/**
 * Empty state configurations used across the app
 */

export interface EmptyStateConfig {
  icon: string
  title: string
  message: string
}

export const EMPTY_STATE_ERROR: EmptyStateConfig = {
  icon: "⚠️",
  title: "Oops!",
  message: "Something went wrong loading the users. Pull down to try again.",
}

export const EMPTY_STATE_NO_RESULTS: EmptyStateConfig = {
  icon: "🔍",
  title: "No Results",
  message: "No users found matching your search. Try a different search.",
}

export const EMPTY_STATE_NO_USERS: EmptyStateConfig = {
  icon: "👥",
  title: "No Users",
  message: "No users available at the moment. Pull down to refresh.",
}

export const getSearchEmptyState = (query: string): EmptyStateConfig => ({
  icon: "🔍",
  title: "No Results",
  message: `No users found matching "${query}". Try a different search.`,
})
