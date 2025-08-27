# AfriTest – AI-Powered Test Generation Tool

AfriTest is an AI-powered CLI tool designed to analyze backend REST API projects (especially Express/Node/TypeScript following clean architecture principles) and automatically generate comprehensive unit and integration tests. It leverages Google Gemini AI to understand code patterns, dependencies, and business logic, producing meaningful Jest tests aligned with your project’s architecture and conventions.

---

## Features

- **AI-Powered Analysis:** Uses Gemini AI to analyze your code and generate tests.
- **Unit Test Generation:** Automatically generates Jest unit tests for your source files.
- **Integration Test Generation:** Analyzes code dependencies and generates Jest integration tests.
- **Customizable Output:** Generated tests are written directly to your target project’s test directories.
- **Architecture Insights:** Detects controllers, services, and repositories for clean architecture projects.
- **Robust Error Handling:** Logs errors for failed AI requests or file writes.
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

2. Ensure your target project (e.g., a Todo app) has a structure like:
   ```
   todo-app/
     src/
     test/
       unit/
       integration/
   ```

---

## Usage

### Analyze and Generate Tests for Another Project

Run AfriTest from its directory, pointing to your target project’s source folder:

```sh
npx ts-node bin/afritest.ts analyze ../todo-app/src --unit
npx ts-node bin/afritest.ts analyze ../todo-app/src --integration
```

- **Unit tests** will be written to `../todo-app/test/unit/`
- **Integration tests** will be written to `../todo-app/test/integration/`

To generate both at once:

```sh
npx ts-node bin/afritest.ts analyze ../todo-app/src
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
- **Dependency Analysis:** Parses import statements to build a dependency graph.
- **AI Test Generation:** Sends code and dependencies to Gemini AI via [`AIClient`](src/utils/aiClient.ts) for test generation.
- **Test Writing:** Writes generated tests to your target project’s `test/unit` and `test/integration` directories.
- **Architecture Detection:** Reports counts of controllers, services, and repositories.

---

## Advanced

- **Error Handling:** All errors are logged to `afritest.log` and the console.
- **Edge Cases:** Handles empty files, files with no functions, and circular dependencies gracefully.
- **Custom Output Paths:** You can modify output directories in the generators if your project uses different paths.

---

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.



