import { Command } from 'commander';
import { ProjectScanner } from '../analyzer/projectScanner';
import { UnitTestGenerator } from '../generators/unitTestGenerator';
import { IntegrationTestGenerator } from '../generators/integrationTestGenerator';
import { DependencyGraph } from '../analyzer/dependencyGraph';

const program = new Command();

program
  .name('afritest')
  .description('AI-Powered Test Generation Tool')
  .version('1.0.0');

program
  .command('analyze <projectPath>')
  .option('--unit', 'Generate unit tests only')
  .option('--integration', 'Generate integration tests only')
  .description('Analyze the project structure and generate tests')
  .action(async (projectPath, options) => {
    try {
      const scanner = new ProjectScanner(projectPath);
      const files = scanner.scan();

      if (options.unit) {
        const unitTestGenerator = new UnitTestGenerator(projectPath);
        await unitTestGenerator.generate();
        console.log('Unit tests generated successfully');
        return;
      }

      if (options.integration) {
        const dependencyGraph = new DependencyGraph(files);
        const dependencies = dependencyGraph.analyze();
        const integrationTestGenerator = new IntegrationTestGenerator(dependencies);
        await integrationTestGenerator.generate();
        console.log('Integration tests generated successfully');
        return;
      }

      // If neither option is provided, generate both
      const unitTestGenerator = new UnitTestGenerator(projectPath);
      await unitTestGenerator.generate();
      const dependencyGraph = new DependencyGraph(files);
      const dependencies = dependencyGraph.analyze();
      const integrationTestGenerator = new IntegrationTestGenerator(dependencies);
      await integrationTestGenerator.generate();
      console.log('Unit tests generated successfully');
      console.log('Integration tests generated successfully');
    } catch (error) {
      console.error('Error during analysis and test generation:', error);
    }
  });

program
  .command('generate')
  .description('Generate tests based on the analyzed project')
  .action(async () => {
    console.log('Generating tests...');
  });

program.on('command:*', () => {
  console.error('Error: Invalid command');
});

program.parse(process.argv);