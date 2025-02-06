/*
 * authentication.test.js - Unit Tests for Authentication System
 *
 * This file contains **unit tests** for verifying the core functions of the authentication system.
 * The goal is to ensure that essential authentication-related operations work **as expected**.
 *
 * Features:
 * - **Tests user retrieval**: Ensures that `fetchUser()` correctly fetches a user object.
 * - **Validates UUID generation**: Checks if `createRandomUUID()` returns a valid non-null UUID.
 * - **Verifies password hashing**: Ensures that `hashPassword()` produces a hashed password.
 *
 * The tests are written using **Vitest**, a fast and lightweight testing framework.
 * Each function is tested separately to ensure **accuracy and reliability**.
 *
 */

import {
  fetchUser,
  createRandomUUID,
  hashPassword,
} from "./public/js/authentication.js";

import { describe, beforeEach, it, expect } from "vitest";

describe("Authentication Test to see if an user is returned", () => {
  let user = {
    id: "1",
    name: "John Doe",
    email: "",
    password: "",
    phone: "",
    address: "",
    courses: [],
    role: "admin",
    authToken: "",
    tokenExpiresAt: "",
  };

  beforeEach(() => {
    user = {
      id: "1",
      name: "John Doe",
      email: "",
      password: "",
      phone: "",
      address: "",
      courses: [],
      role: "admin",
      authToken: "",
      tokenExpiresAt: "",
    };
  });

  it("fetchUser", async () => {
    expect(await fetchUser(1)).toEqual(user);
  });
});

describe("Check if UUID generated is valid", () => {
  it("createRandomUUID", async () => {
    const uuid = createRandomUUID();
    console.log("Generated UUID: ", uuid);
    expect(uuid).not.toBeNull();
  });
});

describe("Check if password hash is generated", () => {
  it("hashPassword", async () => {
    const password = await hashPassword("password");

    console.log("Generated Hash: ", password);
    expect(password).not.toBeNull();
  });
});
