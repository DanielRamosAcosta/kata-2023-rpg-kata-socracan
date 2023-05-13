import { describe, expect, it } from "vitest"
import { test, fc } from "@fast-check/vitest"
import { Character } from "./Character.js"

/**
 * 1. All Characters, when created, have:
 *     - Health, starting at 1000
 *     - Level, starting at 1
 *     - May be Alive or Dead, starting Alive (Alive may be a true/false)
 *
 * 1. Characters can Deal Damage to Characters.
 *     - Damage is subtracted from Health
 *     - When damage received exceeds current Health, Health becomes 0 and the character dies
 *
 * 1. A Character can Heal a Character.
 *     - Dead characters cannot be healed
 *     - Healing cannot raise health above 1000
 */

describe("Character", () => {
  describe("spawning", () => {
    it("starts with full hp", () => {
      const character = Character.spawn()

      const initialHealth = 1000
      expect(character.hasHealth(initialHealth)).toBe(true)
    })

    it("is alive when created", () => {
      const character = Character.spawn()

      expect(character.isAlive()).toBe(true)
    })

    it("starts at level one", () => {
      const character = Character.spawn()

      const initialLevel = 1
      expect(character.isLevel(initialLevel)).toBe(true)
    })
  })

  describe("deals damage", () => {
    it("to other character", () => {
      const character = Character.spawn()
      const attacker = Character.spawn()

      const damageDealt = 200
      attacker.dealDamage(character, damageDealt)

      expect(character.hasHealth(800)).toBe(true)
    })

    test.prop([fc.integer({ min: 1, max: 1000 })])("damage never goes below zero", (damageDealt) => {
      const character = Character.spawn()
      const attacker = Character.spawn()

      attacker.dealDamage(character, damageDealt)

      expect(character.hasHealth(1000 - damageDealt)).toBe(true)
    })
  })

  describe("receives damage", () => {
    it("enough to be dead", () => {
      const character = Character.spawn()
      const attacker = Character.spawn()

      attacker.dealDamage(character, 1000)

      expect(character.isDead()).toBe(true)
    })

    it("but never having health below zero", () => {
      const character = Character.spawn()
      const attacker = Character.spawn()

      attacker.dealDamage(character, 1001)

      expect(character.hasHealth(0)).toBe(true)
    })
  })
})
