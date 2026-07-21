# Module 6, Lesson 1: Unit Testing Fundamentals

Before diving into complex DOM and Component testing, it is absolutely critical to understand the foundation of all testing in modern JavaScript/TypeScript ecosystems. 

Almost all modern testing frameworks (Jasmine, Jest, Vitest) use the exact same foundational syntax, heavily inspired by "Behavior Driven Development" (BDD).

In our modern Nx Monorepo Enterprise Architecture, we are using **Vitest**. Vitest is insanely fast because it uses the Vite build tool under the hood, perfectly matching our Angular Application Builder!

## 1. The Anatomy of a Test File

Whenever you generate an Angular construct using the CLI, Angular automatically creates a corresponding `.spec.ts` file. This is your test file.

Every test file is built using four main blocks:

### `describe()`
The `describe` block creates a **Test Suite**. It groups related tests together. You typically have one `describe` block per file, named after the class you are testing.
```typescript
import { describe, it, expect, beforeEach } from 'vitest';

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

Let's write a pure, isolated test for our `TimeAgoPipe` using Vitest!

Because a Pipe is just a standard TypeScript class with a `@Pipe` decorator, we don't need any complex Angular testing utilities to test it. We can just instantiate it like a normal class!

### Instructions:
1. Since we didn't generate a `.spec.ts` file when we created our UI Pipes library, you need to create it! 
Create a new file: `libs/shared/ui-pipes/src/lib/time-ago.pipe.spec.ts`.
2. Add this clean, isolated test suite:

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
    
    expect(pipe.transform(fiveMinutesAgo.toISOString())).toBe('5 mins ago'); // Will this actually pass? Let's find out!
  });
});
```

### Run the Tests!
Because we are using an Nx Monorepo, we can run all tests in our workspace, or just the tests for a specific library! 

Open your terminal and run tests just for the shared pipes library:
```bash
npx nx test shared-ui-pipes
```

### 🎯 Mini Challenge: Why did your `TimeAgoPipe` test fail?
While most of your tests passed, you will notice that the second test we just wrote (`should return the correct minute string`) actually **FAILED**!

**Your Immediate Task:**
1. Look closely at the terminal output. Vitest will tell you exactly what string it *expected*, and what string the pipe *actually* returned.
2. Open `libs/shared/ui-pipes/src/lib/time-ago.pipe.ts` and look at the source code.
3. Find the discrepancy between our test assertion (`expect(...)`) and the actual implementation logic.
4. Fix the test in `time-ago.pipe.spec.ts` so that it passes!

Once you get a beautiful green checkmark from Vitest, you are ready to move on to the next lesson!
