# Module 1: Unit Testing Fundamentals

Before diving into complex DOM and Component testing, it is absolutely critical to understand the foundation of all testing in modern JavaScript/TypeScript ecosystems. 

Almost all modern testing frameworks (Jasmine, Jest, Vitest, Mocha) use the exact same foundational syntax, heavily inspired by "Behavior Driven Development" (BDD).

## 1. The Anatomy of a Test File

Whenever you generate an Angular construct using the CLI (e.g. `ng g c my-component`), Angular automatically creates a corresponding `.spec.ts` file. This is your test file.

Every test file is built using four main blocks:

### `describe()`
The `describe` block creates a **Test Suite**. It groups related tests together. You typically have one `describe` block per file, named after the class you are testing.
```typescript
describe('TimeAgoPipe', () => { ... });
```

### `it()`
The `it` block is a single **Test Case** (or "Spec"). It should verify exactly one specific behavior. The name should complete the sentence started by "it" (e.g. "it should transform dates correctly").
```typescript
it('should return "Just now" for current dates', () => { ... });
```

### `expect()`
The `expect` block makes an **Assertion**. This is where you actually test the logic.
```typescript
expect(result).toBe('Just now');
```

### `beforeEach()` (Setup & Teardown)
Tests must run in complete isolation. The `beforeEach` block runs before *every single `it` block* in the suite to reset the state.
```typescript
let pipe: TimeAgoPipe;

beforeEach(() => {
  // Reset the pipe instance before every single test!
  pipe = new TimeAgoPipe(); 
});
```

---

## 2. Your Task: Write a Basic Isolated Test

Let's write a pure, isolated test for our `TimeAgoPipe` using the default Jasmine test runner.

Because a Pipe is just a standard TypeScript class with a `@Pipe` decorator, we don't need any complex Angular testing utilities to test it. We can just instantiate it like a normal class!

### Instructions:
1. Open `src/app/shared/pipes/time-ago.pipe.spec.ts`.
2. Replace the default boilerplate with this clean, isolated test suite:

```typescript
import { TimeAgoPipe } from './time-ago.pipe';

describe('TimeAgoPipe', () => {
  let pipe: TimeAgoPipe;

  beforeEach(() => {
    // 1. Arrange: Setup the test state
    pipe = new TimeAgoPipe();
  });

  it('should create an instance', () => {
    // 3. Assert
    expect(pipe).toBeTruthy();
  });

  it('should return "Just now" for a date less than a minute ago', () => {
    // 1. Arrange
    const now = new Date();
    const tenSecondsAgo = new Date(now.getTime() - 10000);
    
    // 2. Act
    const result = pipe.transform(tenSecondsAgo.toISOString());

    // 3. Assert
    expect(result).toBe('Just now');
  });

  it('should return the correct minute string', () => {
    const now = new Date();
    const fiveMinutesAgo = new Date(now.getTime() - (5 * 60000));
    
    expect(pipe.transform(fiveMinutesAgo.toISOString())).toBe('5 mins ago');
  });
});
```

### Run the Tests!
Open your terminal and run:
```bash
npm run test
```
*(Or `ng test`)*

This will compile your app and open a Chrome browser window running the Karma Test Runner. 

### Why are there Failing Tests?
When you ran the test runner, you likely saw something like `TOTAL: 13 FAILED, 5 SUCCESS`. 

Do not panic! This is exactly what happens in real-world Enterprise applications as architecture evolves. 

When you generate a component (e.g. `ng g c issue-card`), Angular generates a basic `.spec.ts` boilerplate. However, throughout the previous 8 phases, we massively overhauled our architecture:
- We injected `HttpClient` into our services.
- We added complex routing logic.
- We switched entirely to Signals.
- We ripped out Zone.js!

The boilerplate tests were never updated to provide these new dependencies or handle Signals, so they crash immediately with `NullInjectorError` and `NG0203` (Injection Context) errors!

### 🎯 Mini Challenge: Why did your `TimeAgoPipe` test fail?
While most of the tests are failing due to architecture changes, you might have noticed that the second test we just wrote in `time-ago.pipe.spec.ts` (`should return the correct minute string`) actually failed too!

**Your Immediate Task:**
1. Look closely at the Karma terminal output. It will tell you exactly what string it *expected*, and what string the pipe *actually* returned.
2. Open `src/app/shared/pipes/time-ago.pipe.ts` and look at the source code.
3. Find the discrepancy between our test assertion (`expect(...)`) and the actual implementation logic.
4. Fix the test in `time-ago.pipe.spec.ts` so that it passes!

### Your Overarching Task
Your mission for the remainder of Phase 9 is to learn the advanced enterprise testing skills required to fix every single one of the remaining broken component/service tests! By the time you finish Module 5, your terminal will report 100% SUCCESS.

Leave the Karma server running, and let's move on to **Module 2: Isolated Testing (Directives)**, where we systematically knock out three more of those failing tests!
