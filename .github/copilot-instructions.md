# Copilot Workspace Instructions

## Overview

This workspace contains a simple web project with the following files:

- `index.html`: Main HTML file
- `script.js`: JavaScript logic
- `data.json`: Data file

## Conventions

- Keep all scripts in `script.js` unless the project grows and modularization is needed.
- Use `data.json` for static or mock data.
- Keep all styling inline or add a `style.css` if needed.

## Build & Test

- No build step required; open `index.html` directly in a browser.
- Test changes by refreshing the browser.

## Documentation

- Update this file if project structure or conventions change.

## Potential Pitfalls

- Ensure all file references in `index.html` are correct.
- If using external libraries, link via CDN in `index.html`.

---

## Example Prompts

- "Add a new function to script.js that loads data from data.json and displays it in index.html."
- "Refactor script.js to use ES6 modules."
- "Add a button to index.html that triggers a function in script.js."

---

## Next Steps

- For more complex workflows, consider adding agent customizations for frontend, data, or testing tasks.
- To create a new instruction or agent, use `/create-instruction` or `/create-agent` and specify the area (e.g., data handling, UI updates).
