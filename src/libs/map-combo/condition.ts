/**
 * Structured condition system for mod dependencies and compatibility rules
 * This replaces the old JavaScript-like string expressions with type-safe, structured objects
 */

// Type definitions
export type ConditionType = "mod" | "and" | "or" | "not";

export interface ModCondition {
  type: "mod";
  value: string;
}

export interface AndCondition {
  type: "and";
  conditions: Condition[];
}

export interface OrCondition {
  type: "or";
  conditions: Condition[];
}

export interface NotCondition {
  type: "not";
  condition: Condition;
}

export type Condition =
  | ModCondition
  | AndCondition
  | OrCondition
  | NotCondition;

// New simplified result type that extends Condition with passed status
export type ConditionResult = Condition & {
  /** Whether this condition passed */
  passed: boolean;
  /** Child condition results for and/or/not conditions */
  children?: ConditionResult[];
};

// Type guards
export function isModCondition(
  condition: Condition,
): condition is ModCondition {
  return condition.type === "mod";
}

export function isNotCondition(
  condition: Condition,
): condition is NotCondition {
  return condition.type === "not";
}

export function hasChildConditions(
  condition: Condition,
): condition is AndCondition | OrCondition {
  return condition.type === "and" || condition.type === "or";
}

/**
 * Evaluates a condition against a set of selected mods
 * @param condition The condition to evaluate
 * @param selectedMods Set of currently selected mod names
 * @returns true if the condition is satisfied, false otherwise
 */
export function evaluateCondition(
  condition: Condition,
  selectedMods: Set<string>,
): boolean {
  switch (condition.type) {
    case "mod":
      return selectedMods.has(condition.value);

    case "and":
      return condition.conditions.every((c) =>
        evaluateCondition(c, selectedMods),
      );

    case "or":
      return condition.conditions.some((c) =>
        evaluateCondition(c, selectedMods),
      );

    case "not":
      return !evaluateCondition(condition.condition, selectedMods);

    default:
      // This should never happen with proper TypeScript usage
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      throw new Error(`Unknown condition type: ${(condition as any).type}`);
  }
}

/**
 * Evaluates a condition and returns a tree structure with pass/fail status
 * This is the new simplified evaluation function
 */
export function evaluateConditionTree(
  condition: Condition,
  selectedMods: Set<string>,
): ConditionResult {
  const baseResult = { ...condition };

  switch (condition.type) {
    case "mod": {
      return {
        ...baseResult,
        passed: selectedMods.has(condition.value),
      };
    }

    case "and": {
      const children = condition.conditions.map((child) =>
        evaluateConditionTree(child, selectedMods),
      );
      return {
        ...baseResult,
        passed: children.every((child) => child.passed),
        children,
      };
    }

    case "or": {
      const children = condition.conditions.map((child) =>
        evaluateConditionTree(child, selectedMods),
      );
      return {
        ...baseResult,
        passed: children.some((child) => child.passed),
        children,
      };
    }

    case "not": {
      const child = evaluateConditionTree(condition.condition, selectedMods);
      return {
        ...baseResult,
        passed: !child.passed,
        children: [child],
      };
    }

    default:
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      throw new Error(`Unknown condition type: ${(condition as any).type}`);
  }
}

/**
 * Helper functions for creating conditions
 */
export const createCondition = {
  /**
   * Creates a mod condition
   */
  mod: (name: string): ModCondition => ({
    type: "mod",
    value: name,
  }),

  /**
   * Creates an AND condition
   */
  and: (...conditions: Condition[]): AndCondition => ({
    type: "and",
    conditions,
  }),

  /**
   * Creates an OR condition
   */
  or: (...conditions: Condition[]): OrCondition => ({
    type: "or",
    conditions,
  }),

  /**
   * Creates a NOT condition
   */
  not: (condition: Condition): NotCondition => ({
    type: "not",
    condition,
  }),
};

/**
 * Converts a structured condition back to a readable string format
 * @param condition The condition to convert
 * @returns A human-readable string representation
 */
export function conditionToString(condition: Condition): string {
  switch (condition.type) {
    case "mod":
      return condition.value;

    case "and": {
      const andParts = condition.conditions.map((c) => {
        const str = conditionToString(c);
        // Add parentheses for OR conditions to maintain precedence
        return c.type === "or" ? `(${str})` : str;
      });
      return andParts.join(" && ");
    }

    case "or": {
      const orParts = condition.conditions.map((c) => conditionToString(c));
      return orParts.join(" || ");
    }

    case "not": {
      const notStr = conditionToString(condition.condition);
      // Add parentheses for complex conditions
      const needsParens = condition.condition.type !== "mod";
      return needsParens ? `!(${notStr})` : `!${notStr}`;
    }

    default:
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      throw new Error(`Unknown condition type: ${(condition as any).type}`);
  }
}

/**
 * Validates that a condition object has the correct structure
 * @param condition The condition to validate
 * @returns true if valid, false otherwise
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function validateCondition(condition: any): condition is Condition {
  if (!condition || typeof condition !== "object") {
    return false;
  }

  switch (condition.type) {
    case "mod":
      return typeof condition.value === "string";

    case "and":
    case "or":
      return (
        Array.isArray(condition.conditions) &&
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        condition.conditions.every((c: any) => validateCondition(c))
      );

    case "not":
      return validateCondition(condition.condition);

    default:
      return false;
  }
}

/**
 * Gets all mod names referenced in a condition
 * @param condition The condition to analyze
 * @returns Array of unique mod names
 */
export function getReferencedMods(condition: Condition): string[] {
  const mods = new Set<string>();

  function collectMods(cond: Condition) {
    switch (cond.type) {
      case "mod":
        mods.add(cond.value);
        break;

      case "and":
      case "or":
        cond.conditions.forEach(collectMods);
        break;

      case "not":
        collectMods(cond.condition);
        break;
    }
  }

  collectMods(condition);
  return Array.from(mods);
}
