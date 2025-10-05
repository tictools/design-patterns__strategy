# CHALLENGE: Discount Calculator — Strategy Pattern

## Challenge Description

You have some existing code that calculates the final price of a purchase by applying a discount based on the client type and additional conditions. The current code is written with many `if`/`switch` statements and is hard to extend or test. Your task is to refactor it using the **Strategy** pattern.

## Objectives and Acceptance Criteria

**Main Objective:**

1. Refactor the code to use Strategy and make the tests pass.

**Acceptance Criteria:**

1. The code no longer uses a large `switch`/`if` structure to select the discount.
2. There is a clear `DiscountStrategy` interface (or similar name) and several concrete implementations.
3. Unit tests have been added to validate each strategy and the Context.
4. It is easy to add a new discount type without touching the existing Context code.

## Branches

🔀 **`starter/strategy`**
Initial branch to start the challenge (legacy code, not refactored).

🔀 **`refactor/strategy`**
Branch containing the implementation of the `Strategy` pattern.

You will find the following files:

- `src/discountCalculator.ts` — main code (currently poorly organized).
- `src/types.ts` — shared types (Client, Order, etc.).
- `tests/discountCalculator.spec.ts` — tests (some pass, others don't).

**`refactor/strategy`**
Branch containing the implementation of the `Strategy` pattern.

## Initial Code (Intentional Problem)

The initial implementation is in `src/discountCalculator.ts` within your starter project.

This code has clear problems:

- Coupling and mixed rules.
- Hard to add a new client type or rule.
- Nearly impossible to mock or swap a strategy for isolated tests.

## Recommended Tasks (Step by Step)

1. **Analyze** the code and identify the rules that vary. Write them down on paper or in a `NOTES.md` file if you prefer.
2. **Define** the `DiscountStrategy` interface (method `calculate(originalPrice: number, order: Order): number` or similar) in `src/strategies/IDiscountStrategy.ts`.
3. **Refactor** the tests to check each strategy and the behavior of the `DiscountService`.
4. **Create** concrete strategies for `Regular`, `Premium`, and `VIP` in `src/strategies/`.
5. **Implement** a `Context` (e.g., `DiscountService`) that accepts a `DiscountStrategy` and returns the final price.
6. **Ensure** that the module's public interface allows selecting strategies (for example, via a simple `factory` or manual injection where it is used).

## Tips and Best Practices (Not the Complete Solution)

- Encapsulate each set of client rules within a separate strategy.
- Keep strategies small; if a strategy grows, consider splitting subrules into small functions.
- Avoid having strategies depend on the `DiscountService` (unidirectionality).
- Write unit tests for each strategy with different `Order` fixtures.
- You can create a small `StrategyFactory` in the starter if you want to select a strategy by `clientType` (this can still be a `switch` _only_ in the registration place, much easier to maintain than scattered logic).

## Extra Tasks (Optional)

- Implement a strategy for temporary promotions (e.g., Black Friday) that only applies if the date falls within a range.
- Add a rule for a configurable `maxDiscountPerOrder` (policy problem: centralize this rule or allow each strategy to have its own limit?).
- Integrate some dependency inversion: register strategies in a simple container and inject them into the `DiscountService`.

## Suggested Tests (Vitest)

- `should apply 5% discount for Regular when total > 100`
- `should combine multiple discounts for Regular` (itemsCount and loyalty)
- `should apply 10% base for Premium`
- `should apply 20% base for VIP and extra when total > 500 and has loyalty card`
- `should cap discount at 50%`

For each test, create `Order` fixtures and ensure the expected values.

## Final Notes from the Tutor

- I won't give you the final solution by default. When you do the refactoring, send me parts of your code (commits, diffs, or specific files) and I'll help you step by step: reviewing, suggesting tests, and giving hints.
- If you get stuck, ask directly: I'll explain where the problem might be and give small code snippets or tests to help you move forward.

Go ahead — when you're ready, create the `starter/strategy` branch with the previous code and share the first commit; I'll guide you through the refactoring process.
