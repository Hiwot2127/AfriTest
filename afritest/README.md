# AfriTest – AI-Powered Test Generation Tool

AfriTest is an AI-powered CLI tool designed to analyze backend REST API projects (especially Express/Node/TypeScript following clean architecture principles) and automatically generate **relevant** unit and integration tests. It leverages Google Gemini AI to understand code patterns, dependencies, and business logic, producing meaningful Jest tests aligned with your project’s architecture and conventions.

---

## Features

- **AI-Powered Analysis:** Uses Gemini AI to analyze your code and generate tests.
- **Unit Test Generation:** Automatically generates Jest unit tests for your source files.
- **Integration Test Generation:** Analyzes code dependencies and generates Jest integration tests for API endpoints.
- **Customizable Output:** Generated tests are written directly to your target project’s test directories.
- **Robust Error Handling:** Errors are logged to the console for failed AI requests or file writes.
- **Edge Case Coverage:** Handles empty files, files with no functions, and circular dependencies.

---

## Getting Started

### Prerequisites

- Node.js (v14+)
- TypeScript
- Jest
- A `.env` file with your Gemini API key:
  ```
  GEMINI_API_KEY=your-gemini-api-key
  ```

### Installation

1. Clone AfriTest:
   ```sh
   git clone https://github.com/yourusername/afritest.git
   cd afritest
   npm install
   ```

2. Ensure your target project (e.g., a Restaurant API) has a structure like:
   ```
   Restaurant-API/
     controllers/
     services/
     routes/
     __tests__/
       unit/
       integration/
   ```

---

## Usage

### Analyze and Generate Tests for Another Project

Run AfriTest from its directory, pointing to your target project’s root folder:

```sh
npx ts-node bin/afritest.ts analyze ../Restaurant-API --output ../Restaurant-API/__tests__ --unit
npx ts-node bin/afritest.ts analyze ../Restaurant-API --output ../Restaurant-API/__tests__ --integration
```

- **Unit tests** will be written to `../Restaurant-API/__tests__/unit/`
- **Integration tests** will be written to `../Restaurant-API/__tests__/integration/`

To generate both at once:

```sh
npx ts-node bin/afritest.ts analyze ../Restaurant-API --output ../Restaurant-API/__tests__
```

### Run Generated Tests

In your target project directory:

```sh
npm test
```
or
```sh
npx jest
```

---

## How It Works

- **Project Scanning:** Scans your source directory for `.ts` files, excluding test files and `node_modules`.
- **Dependency Analysis:** Parses import statements to build a flat list of dependencies.
- **AI Test Generation:** Sends code and dependencies to Gemini AI via [`AIClient`](src/utils/aiClient.ts) for test generation, using improved prompts for relevance.
- **Test Writing:** Writes generated tests to your target project’s `__tests__/unit` and `__tests__/integration` directories.

---

## Advanced

- **Error Handling:** All errors are logged to the console.
- **Edge Cases:** Handles empty files, files with no functions, and circular dependencies gracefully.
- **Custom Output Paths:** Use the `--output` option to specify where tests are written.
- **Prompt Customization:** Prompts can be further tuned in [`src/utils/aiClient.ts`](src/utils/aiClient.ts) for your project’s needs.

---

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug