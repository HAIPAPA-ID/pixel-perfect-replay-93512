import { describe, expect, it } from "vitest";

import { checkProfile, mapProfileRole, signInErrorMessage } from "@/lib/auth-profile";

const base = { id: "u1", full_name: "Budi", role: "owner", is_active: true };

describe("checkProfile", () => {
  it("accepts an active owner", () => {
    expect(checkProfile(base)).toEqual({ ok: true, role: "owner", name: "Budi" });
  });

  it("maps cashier and manager roles", () => {
    expect(mapProfileRole("cashier")).toBe("cashier");
    expect(mapProfileRole("manager")).toBe("manager");
  });

  it("rejects an inactive profile", () => {
    expect(checkProfile({ ...base, is_active: false }).ok).toBe(false);
  });

  it("rejects a missing profile", () => {
    expect(checkProfile(null).ok).toBe(false);
  });

  it("rejects roles the app does not support yet, including admin", () => {
    expect(checkProfile({ ...base, role: "admin" }).ok).toBe(false);
    expect(checkProfile({ ...base, role: "" }).ok).toBe(false);
  });
});

describe("signInErrorMessage", () => {
  it("translates wrong credentials", () => {
    expect(signInErrorMessage("Invalid login credentials")).toBe("Email atau kata sandi salah.");
  });
});
