# DeelHomeTask

## How to run the app (iOS / Android)

```bash
npm install
```

```bash
# iOS simulator
npm run build:ios:sim
npm run start
npm run ios
```

```bash
# Android emulator/device
npm run build:android:sim
npm run start
npm run android
```

## How to run unit/integration tests

```bash
npm test
```

```bash
# Optional: run only specific suites
npm test -- app/screens/HomeScreen/HomeScreen.test.tsx
npm test -- app/utils/useUsers.test.ts
```

## How to run E2E tests (Detox)

```bash
# iOS Debug (Expo Dev Client)
npx expo start --dev-client --host localhost
detox test --configuration ios.sim.debug
```

```bash
# iOS Release
detox test --configuration ios.sim.release
```

## Key decisions & tradeoffs

- **Architecture:** Feature-based screen organization (`HomeScreen`, `DetailsScreen`) with reusable UI components and dedicated hooks for business logic.
- **Data fetching:** Centralized API layer (`ApiService` + `userService`) to standardize request/response handling and errors.
- **Search approach:** Debounced search (500ms) to reduce request volume and improve UX while typing.
- **Scalability/performance:** FlatList tuning (`getItemLayout`, batching/window props, clipped subviews), memoized render callbacks, and pagination to avoid loading all users at once.

## What I would improve with more time

- Add a reusable test utility layer for RTL and Detox (shared render helpers, selectors, and fixtures) to reduce test duplication.
- Strengthen E2E reliability by running primarily on release builds and adding deterministic API stubs for critical flows.
- Improve loading/search UX with skeleton states and clearer feedback for pagination/search transitions.
- Add client-side caching (stale-while-revalidate) to reduce repeated network calls and improve perceived performance.
- Introduce stricter API contract validation and analytics/error reporting hooks for better production observability.
