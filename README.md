# Strategy Pattern — Discount Calculator

## Summary

This document explains the **Strategy** pattern and how to apply it in a small learning project: a _discount calculator_ for an online store. The goal is to learn how to identify code with multiple conditions, encapsulate behaviors into strategies, and improve code testability and maintainability.

## Pattern Intent

The **Strategy** pattern belongs to the group of **behavioral patterns**. These patterns focus on how objects interact and how responsibilities and behaviors are assigned among them.

### When to Use It

- When you have a set of algorithms or rules that change (e.g., discount calculations, filters, sorting, payment strategies).
- When the original code has many `if`/`switch` statements to determine behavior.
- When you want to improve testability: test each strategy separately.

## Typical Components in TypeScript

- **Strategy (INTERFACE)**: defines the contract that all strategies implement.
- **Concrete Strategies**: concrete implementations of the contract.
- **Context**: uses a Strategy to execute the algorithm. The context only knows the contract, not the concrete implementation.

### Example Signatures (TypeScript)

```ts
// contract for any discount strategy
export interface DiscountStrategy {
  calculate(originalPrice: number, context?: Record<string, any>): number;
}

// minimal usage example (not the full implementation)
function applyDiscount(price: number, strategy: DiscountStrategy) {
  return strategy.calculate(price);
}
```

## Benefits You'll Gain in the Challenge

- Cleaner and more extensible code.
- Easier to add new discount types without changing existing code (Open/Closed Principle).
- Less coupling and more dependency on abstractions (DIP).
- Better unit tests.

## Related Anti-patterns

- Chained `switch`/`if` statements to choose the algorithm. This makes the module grow in complexity and hard to extend.
- Strategies with a large number of dependencies and knowledge of the context's internal state (breaking SRP).

## Testing Recommendations

- Write separate tests for each concrete strategy.
- Test the _Context_ by applying a stub or mock strategy.
- Use Vitest (already set up in the repo) to run the tests.

## Practical Summary

In the challenge, you'll find a `starter/` with intentionally poorly organized code (many `switch` statements), and tests that show the expected behavior (some will fail). Your mission: refactor using Strategy, add tests if needed, and do not change the public contract (APIs) more than necessary.
