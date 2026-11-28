import assert from "node:assert/strict";
import { test } from "node:test";
import { splitName } from "./name.ts";

test("two words split into first and last name", () => {
  assert.deepEqual(splitName("Ada Lovelace"), { firstName: "Ada", lastName: "Lovelace" });
});

test("one word is a first name with an empty last name", () => {
  assert.deepEqual(splitName("Cher"), { firstName: "Cher", lastName: "" });
});

test("three words keep everything after the first as the last name", () => {
  assert.deepEqual(splitName("Mary Ann Smith"), { firstName: "Mary", lastName: "Ann Smith" });
});

test("repeated and surrounding whitespace collapses", () => {
  assert.deepEqual(splitName("  Mary \t Ann   Smith  "), { firstName: "Mary", lastName: "Ann Smith" });
});

test("a blank name gives two empty parts", () => {
  assert.deepEqual(splitName("   "), { firstName: "", lastName: "" });
});
