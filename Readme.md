# Sentinel AST Example

## Running Tests

```bash
npm run start-services
```

```bash
npm run test
```

```bash
npm run stop-services
```

### Scenarios
You can add any cucumber cli args like so:  
```bash
npm run test -- <cucumber-args>
```

If you want to run a specific test or feature:  
```bash
npm run test -- ./path/to/file.feature:3
```

If you have your own containers/services to run:  
```bash
npm run start-services -- --yaml ./path/to/docker-compose.yml
```

### Sentinel
```bash
npm install -g sentinel-ast
```

Command Line Help:  
```bash
sentinel --help
```

Run Docker Compose Commands:  
```bash
sentinel run-compose <docker-compose-action> <docker-compose-args>
```

Read service logs:  
```bash
sentinel run-compose logs zap
```