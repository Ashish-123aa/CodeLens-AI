Build the frontend UI for a developer tool called CodeLens AI.

Product concept:

CodeLens AI helps developers understand and analyze unfamiliar codebases.

Important:
For this stage, focus on the frontend experience and realistic mock data. Do not attempt to build the complete backend or complex AI functionality.

Technology:

* React
* TypeScript
* Tailwind CSS
* Vite

Create the following pages:

1. Landing Page

* Product name: CodeLens AI
* Tagline: "Understand your codebase. Find problems. Learn how it works."
* CTA: "Analyze Repository"
* Secondary CTA: "Explore Demo"

2. Dashboard
   Show:

* Repository name
* Number of files
* Number of components
* Number of API endpoints
* Number of functions
* Security score
* Performance score
* Code quality score
* Reliability score
* Recent findings

3. Repository Explorer
   Create a three-panel developer interface:

* left: file tree
* center: code viewer
* right: AI explanation/details panel

4. Ask Your Code
   Create a chat interface where the user can ask:

* Where is authentication implemented?
* How does the checkout flow work?
* Which files handle database access?
* What happens when a user logs in?

Use realistic mock answers.

5. Analysis page
   Display:

* Security findings
* Performance findings
* Code quality findings
* Reliability findings
* Severity levels: Critical, High, Medium, Low

6. Architecture page
   Create a visual architecture/dependency graph UI using mock data.

7. Repository import page
   Allow the user to choose:

* GitHub repository
* ZIP upload

For now these can be UI-only.

Design requirements:

* Professional developer-tool aesthetic
* Clean and modern
* Responsive
* Dark mode
* Strong typography
* Avoid excessive gradients
* Avoid generic AI landing-page design
* Use reusable components
* Keep the code modular

Do not add fake functionality that appears to call a real backend.
Clearly separate mock data from UI components so the mock data can later be replaced with real APIs.
