/* global describe, beforeAll, it, device, expect, element, by, waitFor */

const DEV_SERVER_URL = "http://localhost:8081"
const DEV_CLIENT_DEEPLINK = `deelhometest://expo-development-client/?url=${encodeURIComponent(
  DEV_SERVER_URL,
)}`

async function openDevClientAndEnterApp() {
  await device.launchApp({ newInstance: true })

  try {
    await waitFor(element(by.text("Users")))
      .toBeVisible()
      .withTimeout(5000)
    return
  } catch {
    // Continue with dev-client fallback flow.
  }

  // Debug/dev-client path: open app through Expo dev launcher.
  await device.openURL({ url: DEV_CLIENT_DEEPLINK })

  try {
    await waitFor(element(by.text("Users")))
      .toBeVisible()
      .withTimeout(10000)
    return
  } catch {
    // Fallback for Expo launcher screen: tap the local Metro server row.
    await waitFor(element(by.text(DEV_SERVER_URL)))
      .toBeVisible()
      .withTimeout(10000)
    await element(by.text(DEV_SERVER_URL)).tap()
  }
}

describe("App smoke test", () => {
  beforeAll(async () => {
    await openDevClientAndEnterApp()
  })

  it("runs full flow: load users, search, open details, and interact with accordion", async () => {
    await expect(element(by.text("Users"))).toBeVisible()

    // 1) Home screen should load users
    await waitFor(element(by.id("user-card-1")))
      .toBeVisible()
      .withTimeout(15000)

    // 2) Scroll to the end and verify pagination loads more users
    await waitFor(element(by.id("user-card-31")))
      .toBeVisible()
      .whileElement(by.id("home-users-list"))
      .scroll(400, "down")

    // 3) Use search and verify list updates
    await element(by.id("home-search-input")).tap()
    await element(by.id("home-search-input")).replaceText("Emily")
    await waitFor(element(by.text("Emily Johnson")))
      .toBeVisible()
      .withTimeout(10000)

    // 4) Tap a user and validate details screen opens
    await element(by.id("user-card-1")).tap()
    await expect(element(by.text("User Details"))).toBeVisible()

    // 5) Interact with animated accordion element
    await element(by.id("details-section-contact-toggle")).tap()
    await waitFor(element(by.id("details-row-email")))
      .toBeVisible()
      .withTimeout(8000)
  })
})
