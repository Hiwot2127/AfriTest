Okay, I'll provide you with Jest integration tests for a TypeScript code snippet.  To give you the best tests, **please provide the TypeScript code you want me to create tests for.**

However, I can illustrate a typical structure and examples with some generic TypeScript code.  This will allow you to understand the principles and then adapt it to your specific use case once you provide the code.

**Example TypeScript Code (Let's assume this is your code):**

```typescript
// src/api.ts (or whatever your file is named)

import axios from 'axios';

const API_BASE_URL = 'https://api.example.com'; // Replace with a real API

export interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

export async function getTodos(): Promise<Todo[]> {
  try {
    const response = await axios.get<Todo[]>(`${API_BASE_URL}/todos`);
    return response.data;
  } catch (error) {
    console.error("Error fetching todos:", error);
    throw new Error('Failed to fetch todos'); // Rethrow for error handling upstream
  }
}

export async function createTodo(title: string): Promise<Todo> {
  try {
    const response = await axios.post<Todo>(`${API_BASE_URL}/todos`, { title, completed: false });
    return response.data;
  } catch (error) {
    console.error("Error creating todo:", error);
    throw new Error('Failed to create todo');
  }
}

export async function updateTodo(id: number, completed: boolean): Promise<Todo> {
  try {
    const response = await axios.put<Todo>(`${API_BASE_URL}/todos/${id}`, { completed });
    return response.data;
  } catch (error) {
    console.error("Error updating todo:", error);
    throw new Error('Failed to update todo');
  }
}


//src/utils.ts (Optional Example)
export function capitalize(str: string): string {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

```

**Jest Integration Tests (Example):**

```typescript
// tests/api.test.ts (or whatever you name your test file)

import { getTodos, createTodo, updateTodo, Todo } from '../src/api'; // Adjust path as needed
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';  // Use axios-mock-adapter for mocking
import { capitalize } from '../src/utils'; //Example Import
// Mock the API base URL (if needed, especially for different environments)
// jest.mock('../src/api', () => ({
//   ...jest.requireActual('../src/api'), // Import the original module
//   API_BASE_URL: 'http://localhost:3000' // Mocked API URL for tests
// }));

const mockAxios = new MockAdapter(axios);

describe('Todo API Integration Tests', () => {

  beforeEach(() => {
    mockAxios.reset(); // Reset the mock adapter before each test
  });

  it('should fetch todos successfully', async () => {
    const mockTodos: Todo[] = [
      { id: 1, title: 'Learn Jest', completed: false },
      { id: 2, title: 'Write Tests', completed: true },
    ];

    mockAxios.onGet('https://api.example.com/todos').reply(200, mockTodos);

    const todos = await getTodos();
    expect(todos).toEqual(mockTodos);
  });

  it('should handle errors when fetching todos', async () => {
    mockAxios.onGet('https://api.example.com/todos').reply(500, 'Internal Server Error');

    await expect(getTodos()).rejects.toThrow('Failed to fetch todos');
  });

  it('should create a todo successfully', async () => {
    const newTodo = { id: 3, title: 'New Todo', completed: false };
    mockAxios.onPost('https://api.example.com/todos').reply(201, newTodo);

    const createdTodo = await createTodo('New Todo');
    expect(createdTodo).toEqual(expect.objectContaining({
      title: 'New Todo',
      completed: false
    }));

    expect(mockAxios.history.post[0].data).toEqual(JSON.stringify({ title: 'New Todo', completed: false }));

  });

  it('should handle errors when creating a todo', async () => {
    mockAxios.onPost('https://api.example.com/todos').reply(500, 'Internal Server Error');
    await expect(createTodo('New Todo')).rejects.toThrow('Failed to create todo');
  });

  it('should update a todo successfully', async () => {
    const updatedTodo = { id: 1, title: 'Learn Jest', completed: true };
    mockAxios.onPut('https://api.example.com/todos/1').reply(200, updatedTodo);

    const result = await updateTodo(1, true);
    expect(result).toEqual(updatedTodo);
    expect(mockAxios.history.put[0].data).toEqual(JSON.stringify({ completed: true }));
  });

  it('should handle errors when updating a todo', async () => {
    mockAxios.onPut('https://api.example.com/todos/1').reply(500, 'Internal Server Error');
    await expect(updateTodo(1, true)).rejects.toThrow('Failed to update todo');
  });

  it('should capitalize a string', () => {
    expect(capitalize("hello")).toBe("Hello");
    expect(capitalize("")).toBe("");
    expect(capitalize(undefined as any)).toBe(undefined);
  });
});
```

**Key Improvements and Explanations:**

1. **`axios-mock-adapter`:** This is crucial.  `axios-mock-adapter` allows you to intercept the actual API calls made by your `getTodos`, `createTodo`, and `updateTodo` functions and replace them with mocked responses.  This prevents your tests from making real network requests (which can be slow, unreliable, and potentially modify data).  Install it: `npm install axios-mock-adapter --save-dev`

2. **`beforeEach`:**  The `beforeEach(() => { ... });` block is used to reset the `axios-mock-adapter` before each test.  This ensures that each test starts with a clean slate and avoids unexpected behavior due to previous test mocks.  Crucially, it's `mockAxios.reset()`.

3. **Mocking Responses:** The core of the tests is mocking the responses from the API.  Here's how it works:

   - `mockAxios.onGet('https://api.example.com/todos').reply(200, mockTodos);`  This line tells `axios-mock-adapter` that whenever a GET request is made to `https://api.example.com/todos`, it should respond with a status code of 200 (OK) and the `mockTodos` array as the response data.

   - `mockAxios.onPost('https://api.example.com/todos').reply(201, newTodo);`  Similar, but for POST requests.  The `201` status code is typically used for successful creation.

   - `mockAxios.onPut('https://api.example.com/todos/1').reply(200, updatedTodo);` Similar, but for PUT requests.

4. **Error Handling Tests:**  It's vital to test error handling.  The tests that use `.rejects.toThrow()` ensure that your functions correctly throw errors when the API returns error status codes (like 500).

5. **Assertions:**

   - `expect(todos).toEqual(mockTodos);`  This asserts that the `todos` array returned by `getTodos` is exactly equal to the `mockTodos` array you defined.

   - `expect(getTodos()).rejects.toThrow('Failed to fetch todos');`  This asserts that calling `getTodos` will result in a rejected promise (an error) and that the error message will be 'Failed to fetch todos'.

6. **Mocking API Base URL (Conditional):**  I've included a commented-out example of how to mock the `API_BASE_URL`.  This is useful if you want to run your tests against a different API endpoint (e.g., a local development server).  Uncomment and adjust the `API_BASE_URL` value if needed.  This avoids hardcoding the real API URL in your tests. This approach is generally cleaner than directly modifying the original module.

7. **Testing Request Body:**  `expect(mockAxios.history.post[0].data).toEqual(JSON.stringify({ title: 'New Todo', completed: false }));`  This is *very* important.  It verifies that the data you are sending in the POST request is correct.  `mockAxios.history.post` keeps track of all the POST requests that were intercepted.  `[0]` gets the first POST request.  `.data` contains the request body.  Since Axios typically stringifies the body, you need to compare it to `JSON.stringify(...)`.

8. **Integration vs. Unit Tests:** These are *integration* tests because they test the interaction between your code (the `getTodos`, `createTodo`, `updateTodo` functions) and the external API (which is mocked, but still simulates the API interaction).  Unit tests, on the other hand, would test smaller, isolated units of code (e.g., a single function) without involving external dependencies.

9. **`expect.objectContaining`:**  In the `createTodo` test, `expect.objectContaining` is used.  This is useful if you only want to verify that certain properties exist in the created object and have the expected values, without checking all properties.  For example, the ID might be auto-generated by the API, so you don't want to hardcode it in your test.

10. **TypeScript Types:**  Using the `Todo` interface ensures type safety in your tests.

**How to Use This:**

1. **Install Dependencies:**
   ```bash
   npm install jest @types/jest axios axios-mock-adapter --save-dev
   # Or, if you use yarn:
   # yarn add jest @types/jest axios axios-mock-adapter --dev
   ```

2. **Configure Jest:**  Make sure you have a `jest.config.js` (or similar) file in your project root.  A basic configuration might look like this:

   ```javascript
   // jest.config.js
   module.exports = {
     preset: 'ts-jest',
     testEnvironment: 'node', // Or 'jsdom' if you're testing browser code
     testMatch: ['**/tests/**/*.test.ts'], //Where your tests live
     moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
   };
   ```

3. **Create Test File:** Create a file named `api.test.ts` (or something similar) in your `tests` directory.

4. **Paste and Adapt:**  Copy the Jest test code I provided above into your `api.test.ts` file.  Adjust the import paths to match the actual location of your `api.ts` file and adjust the API base URL if needed.

5. **Run Tests:**
   ```bash
   npm test  # Or yarn test
   ```
   (This assumes you have a `test` script in your `package.json` that runs `jest`.)

**Important Considerations:**

* **Real API Endpoints:**  For true end-to-end testing (which is different from integration testing), you *would* test against a real API endpoint.  However, these tests should be separate and clearly marked as such, because they are much more fragile and take longer to run. You'd typically run them only in a CI/CD pipeline.

* **Environment Variables:** If your API base URL is configurable via environment variables, use `process.env.API_BASE_URL` in your code, and then mock the environment variable in your tests (if necessary).

* **Authentication:** If your API requires authentication, you'll need to mock the authentication process in your tests (e.g., by mocking the `Authorization` header).

* **Data Setup/Teardown:**  If your tests create or modify data in a real database, you'll need to implement setup and teardown logic to ensure that your tests don't interfere with each other.  Use `beforeAll`, `afterAll`, `beforeEach`, and `afterEach` hooks for this purpose. However, since we're using `axios-mock-adapter`, this is less of a concern.

**Now, please provide the *actual* TypeScript code you want me to write tests for, and I will tailor the Jest tests to your specific code and requirements.**  The more context you give me, the better I can help!
