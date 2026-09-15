# CodeLens AI Architecture

## Initial Architecture

The application will eventually contain four major layers:

```text
Frontend
    |
    v
Backend API
    |
    +-------------------+
    |                   |
    v                   v
Repository Analysis   AI Service
    |                   |
    v                   v
Code Graph          Context Retrieval
    |
    v
Database
```

## Frontend

Technology:

* React
* TypeScript
* Vite
* Tailwind CSS

Responsibilities:

* User interface
* Repository explorer
* Code viewer
* Search
* AI chat
* Analysis dashboard
* Architecture visualization

## Backend

Technology:

* Node.js
* TypeScript
* Express

Responsibilities:

* API endpoints
* Repository ingestion
* File processing
* Code analysis
* Dependency analysis
* AI orchestration
* Security checks
* Performance checks

## Repository Analysis

The repository analysis system will:

1. Receive a repository
2. Extract source files
3. Ignore unnecessary files
4. Identify source-code structures
5. Extract relationships
6. Build a dependency graph
7. Store analysis results

## AI Layer

The AI layer should not receive the entire repository blindly.

Instead:

```text
User Question
      |
      v
Search / Retrieval
      |
      v
Relevant Files
      |
      v
Relevant Code
      |
      v
AI Model
      |
      v
Evidence-based Answer
```

## Design Principle

The AI layer should be separated from repository analysis.

Static analysis should provide factual repository information.

AI should explain and reason about that information.

This creates a hybrid system:

```text
Static Analysis + Retrieval + AI
```

rather than relying entirely on AI guesses.
