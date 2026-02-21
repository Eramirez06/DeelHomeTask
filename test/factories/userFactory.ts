import { User, UsersApiResponse } from "@/services/api/userTypes"

export function buildUser(overrides: Partial<User> = {}): User {
  return {
    id: 1,
    firstName: "John",
    lastName: "Doe",
    maidenName: "",
    age: 30,
    gender: "male",
    email: "john.doe@example.com",
    phone: "+1 555 555 5555",
    username: "johndoe",
    password: "password",
    birthDate: "1994-01-01",
    image: "https://dummyjson.com/icon/john/128",
    bloodGroup: "O+",
    height: 180,
    weight: 75,
    eyeColor: "Brown",
    hair: {
      color: "Brown",
      type: "Straight",
    },
    ip: "127.0.0.1",
    address: {
      address: "123 Main St",
      city: "New York",
      state: "NY",
      stateCode: "NY",
      postalCode: "10001",
      coordinates: {
        lat: 40.7128,
        lng: -74.006,
      },
      country: "United States",
    },
    macAddress: "00:00:00:00:00:00",
    university: "MIT",
    bank: {
      cardExpire: "01/30",
      cardNumber: "0000000000000000",
      cardType: "Visa",
      currency: "USD",
      iban: "US0000000000000000000000",
    },
    company: {
      department: "Engineering",
      name: "Acme Inc.",
      title: "Software Engineer",
      address: {
        address: "500 Business Ave",
        city: "San Francisco",
        state: "CA",
        stateCode: "CA",
        postalCode: "94105",
        coordinates: {
          lat: 37.7749,
          lng: -122.4194,
        },
        country: "United States",
      },
    },
    ein: "00-0000000",
    ssn: "000-00-0000",
    userAgent: "Jest",
    crypto: {
      coin: "Bitcoin",
      wallet: "0x0000000000000000000000000000000000000000",
      network: "Ethereum",
    },
    role: "user",
    ...overrides,
  }
}

export function buildUsersApiResponse(
  users: User[],
  overrides: Partial<UsersApiResponse> = {},
): UsersApiResponse {
  return {
    users,
    total: users.length,
    skip: 0,
    limit: 30,
    ...overrides,
  }
}
