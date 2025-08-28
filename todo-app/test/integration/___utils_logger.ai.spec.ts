Okay, I need to see the code in `../utils/logger` to provide effective Jest integration tests.  However, I can provide a comprehensive template and examples based on *common* logger implementations.  I'll cover a few typical logger functionalities:

*   **Basic Logging (info, warn, error):**  Tests for logging messages at different severity levels.
*   **Custom Log Levels (if applicable):**  Tests to ensure custom log levels are handled correctly.
*   **Output Destination (console, file, etc.):**  Tests to verify logs are being written to the expected place.
*   **Formatting:** Tests to ensure the output has the expected format (timestamps, log levels, etc.)
*   **Conditional Logging (based on environment, etc.):**  Tests to check if logs are suppressed under certain conditions.

Here's a Jest test suite template with examples:

```javascript
// __tests__/logger.test.js  (or logger.integration.test.js)

const logger = require('../utils/logger'); // Adjust the path if needed
const fs = require('fs');

// Mock console.log, console.warn, console.error to capture output
const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

// Helper function to read the log file (if the logger uses one)
const readLogFile = (filePath) => {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (error) {
    return ''; // File might not exist or be accessible
  }
};

describe('Logger Integration Tests', () => {

  beforeEach(() => {
    // Clear mocks before each test
    consoleLogSpy.mockClear();
    consoleWarnSpy.mockClear();
    consoleErrorSpy.mockClear();

    // Optionally clear the log file before each test.  Careful!  This deletes its content.
    // if (logger.logFilePath) { // Assuming your logger has a property for the file path
    //   try {
    //     fs.writeFileSync(logger.logFilePath, '');
    //   } catch (err) {
    //     // Handle the error, maybe throw it or log it,
    //     // or decide to ignore and let tests run to see if the logger handles it correctly.
    //     console.error("Error clearing log file before test: ", err);
    //   }
    // }

  });

  afterAll(() => {
    // Restore the original console methods after all tests
    consoleLogSpy.mockRestore();
    consoleWarnSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });

  describe('Basic Logging Levels', () => {
    it('should log an info message to the console', () => {
      logger.info('This is an info message');
      expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('This is an info message'));
    });

    it('should log a warning message to the console', () => {
      logger.warn('This is a warning message');
      expect(consoleWarnSpy).toHaveBeenCalledWith(expect.stringContaining('This is a warning message'));
    });

    it('should log an error message to the console', () => {
      logger.error('This is an error message');
      expect(consoleErrorSpy).toHaveBeenCalledWith(expect.stringContaining('This is an error message'));
    });
  });

  describe('Log File Output (if applicable)', () => {
    const logFilePath = 'my-test.log'; // Replace with your logger's actual file path (if it has one)

    beforeEach(() => {
      // Mock the logFilePath within the logger module (if needed)
      // jest.spyOn(logger, 'logFilePath', 'get').mockReturnValue(logFilePath);
      // If your logger configuration is different, you'll need to adjust this.

      // Ensure the test log file is empty before each test
      try {
          fs.writeFileSync(logFilePath, '');
      } catch(error){
          console.warn("Unable to clear log file before test");
      }
    });

    it('should write an info message to the log file', () => {
      // Mock the logFilePath in the logger module
      jest.spyOn(logger, 'logFilePath', 'get').mockReturnValue(logFilePath);

      logger.info('Info message for file');

      // Wait a short time to allow the file to be written.  Adjust this if needed.
      return new Promise((resolve) => setTimeout(() => {
        const logContent = readLogFile(logFilePath);
        expect(logContent).toContain('Info message for file');
        resolve();
      }, 100)); // Adjust the timeout as needed
    });

    it('should write an error message to the log file', () => {
        // Mock the logFilePath in the logger module
        jest.spyOn(logger, 'logFilePath', 'get').mockReturnValue(logFilePath);
      logger.error('Error message for file');
       return new Promise((resolve) => setTimeout(() => {
        const logContent = readLogFile(logFilePath);
        expect(logContent).toContain('Error message for file');
         resolve();
       }, 100));
    });
  });

  describe('Formatting', () => {
    it('should include a timestamp in the log message', () => {
      logger.info('Test timestamp');
      expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringMatching(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/)); // Adjust the regex to match your timestamp format
    });

    it('should include the log level in the log message', () => {
      logger.warn('Test log level');
      expect(consoleWarnSpy).toHaveBeenCalledWith(expect.stringContaining('[WARN]')); // Adjust "[WARN]" to match your logger's level formatting
    });
  });

  describe('Conditional Logging (Environment-Based)', () => {
    it('should not log debug messages in production environment', () => {
      const originalNodeEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';
      logger.debug('Debug message');
      expect(consoleLogSpy).not.toHaveBeenCalled();
      process.env.NODE_ENV = originalNodeEnv; // Restore the original value
    });

    it('should log debug messages in development environment', () => {
       const originalNodeEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';
      logger.debug('Debug message');
      expect(consoleLogSpy).toHaveBeenCalled();
       process.env.NODE_ENV = originalNodeEnv;
    });
  });

  // Add more test cases to cover other functionalities of your logger

});
```

**Key Improvements and Explanations:**

*   **Mocking:**  Uses `jest.spyOn` to mock `console.log`, `console.warn`, and `console.error`.  This allows you to intercept the calls to these methods and assert that they were called with the expected arguments.  Crucially, it uses `.mockImplementation(() => {})` to prevent the actual console output during testing, keeping your test output clean.
*   **`beforeEach` and `afterAll`:**  `beforeEach` clears the mocks before each test.  This is *essential* to ensure that the tests are isolated and don't interfere with each other.  `afterAll` restores the original console methods, preventing unintended side effects in other tests.
*   **Log File Handling:** Includes example tests for writing to a log file. This part needs significant adjustment based on *how* your logger writes to the file (if at all).  The example shows how to read the log file using `fs.readFileSync` and then assert that the expected content is present. Includes a `setTimeout` to allow asynchronous file writing to complete before the assertion. The value of this timeout may need to be adjusted.
*   **Timestamp and Log Level Assertions:** Shows how to use `expect.stringMatching` to check that the log messages include the expected timestamp and log level formats. You'll need to adjust the regular expressions and level strings to match your logger's output.
*   **Environment-Based Logging:**  Demonstrates how to test conditional logging based on the `NODE_ENV` environment variable. It temporarily changes the environment variable, runs the logger, and then restores the original value.
*   **Error Handling:** The `readLogFile` function includes basic error handling in case the log file doesn't exist or is inaccessible.  This prevents the test from crashing if the log file is not properly configured.  Also, includes handling for potential `fs.writeFileSync` errors when clearing the log files.
*   **`jest.spyOn` for `logFilePath`:**  If your logger has a property (like `logFilePath`) that determines where to write the logs, you can use `jest.spyOn` with a getter to mock that property during the test.  This allows you to redirect the logs to a test-specific file.  **Crucially, the example uses `'get'` as the third argument to `jest.spyOn` because you're mocking a getter.**
*   **Asynchronous File Operations:**  The tests that write to a log file use `setTimeout` to allow the asynchronous file writing operations to complete before the assertions are made. This is important to avoid race conditions where the assertions are run before the file has been written. **Remember to adjust the timeout value based on the performance of your file system and the size of the log messages.** The tests now also return a Promise, so jest waits for the timeout to complete before continuing with the test.

**To use this template effectively:**

1.  **Replace Placeholders:** Replace the placeholder values (e.g., `'my-test.log'`, `[WARN]`, the timestamp regex) with the actual values from your logger implementation.
2.  **Adapt to Your Logger:**  Carefully adapt the file reading and writing logic to match how your logger interacts with the file system (if it uses files).
3.  **Add More Tests:** Add more test cases to cover all the functionalities and edge cases of your logger. Consider testing things like:
    *   Logging objects and arrays.
    *   Custom formatting options.
    *   Error handling within the logger itself.
    *   Different log levels (e.g., `trace`, `debug`, `fatal`).
4.  **Integration vs. Unit:** Remember that these are *integration* tests, meaning they test the interaction of different parts of the logger (e.g., logging logic and file writing).  You might also want to write *unit* tests to test individual functions or components of the logger in isolation.

**Example `logger.js` (for context):**

```javascript
// utils/logger.js

const fs = require('fs');

const logLevels = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
  fatal: 4
};

const logLevel = process.env.NODE_ENV === 'production' ? logLevels.info : logLevels.debug;

const logFilePath = 'application.log';  // Default log file.  Can be changed.

function log(level, message) {
  if (logLevels[level] >= logLevel) {
    const timestamp = new Date().toISOString();
    const formattedMessage = `[${level.toUpperCase()}] ${timestamp} - ${message}\n`;

    if (console[level]) {
      console[level](formattedMessage);
    } else {
      console.log(formattedMessage); // Fallback for unknown levels
    }

      fs.appendFile(logFilePath, formattedMessage, (err) => {
        if (err) {
          console.error('Error writing to log file:', err);
        }
      });
  }
}

module.exports = {
  debug: (message) => log('debug', message),
  info: (message) => log('info', message),
  warn: (message) => log('warn', message),
  error: (message) => log('error', message),
  fatal: (message) => log('fatal', message),
  logFilePath // Expose logFilePath for testing (getter)
};
```

Now, if you provide the code from `../utils/logger`, I can give you much more specific and accurate Jest tests tailored to its exact implementation.  Just paste the contents of the file.
