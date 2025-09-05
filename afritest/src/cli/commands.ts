import { Command } from "commander";
import { ProjectScanner } from "../analyzer/projectScanner";
import { UnitTestGenerator } from "../generators/unitTestGenerator";
import { IntegrationTestGenerator } from "../generators/integrationTestGenerator";
import { DependencyGraph } from "../analyzer/dependencyGraph";

const program = new Command();

program
  .name("afritest")
  .description("AI-Powered Test Generation Tool")
  .version("1.0.0");

program
  .command("analyze <projectPath>")
  .option("--unit", "Generate unit tests only")
  .option("--integration", "Generate integration tests only")
  .option(
    "-o, --output <path>",
    "Specify the output directory for tests",
    "test"
  )
  .description("Analyze the project structure and generate tests")
  .action(async (projectPath, options) => {
    try {
      const generateUnit =
        options.unit || (!options.unit && !options.integration);
      const generateIntegration =
        options.integration || (!options.unit && !options.integration);

      if (generateUnit) {
        const unitTestGenerator = new UnitTestGenerator(projectPath);
        await unitTestGenerator.generate(`${options.output}/unit`);
        console.log("Unit tests generated successfully");
      }

      if (generateIntegration) {
        const scanner = new ProjectScanner(projectPath);
        const files = scanner.scan();
        const dependencyGraph = new DependencyGraph(files);
        const dependencies = dependencyGraph.analyze();
        const integrationTestGenerator = new IntegrationTestGenerator(
          dependencies
        );
        await integrationTestGenerator.generate(
          `${options.output}/integration`
        );
        console.log("Integration tests generated successfully");
      }
    } catch (error) {
      console.error("Error during analysis and test generation:", error);
    }
  });

program.on("command:*", () => {
  console.error("Error: Invalid command");
  process.exit(1);
});

program.parse(process.argv);
