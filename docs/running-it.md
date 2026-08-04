# Running It

## Requirements

- Node.js v20.20.2 (or any Node 20.x LTS release)
- npm (bundled with Node)

## Install

From a clean clone of the repository:

```bash
npm install
```

This installs all dependencies listed in `package.json`, including `better-sqlite3`, which compiles a native binding during install — this step may take slightly longer than a typical `npm install`.

## Run

```bash
npm run dev
```

Then open `http://localhost:3000` in a browser.

On first run, no database file exists yet. The application creates `todo.db` automatically in the project root the first time it starts, along with the `tasks` table. No manual setup or seeding is required.

## Test

```bash
npm test
```

This runs the full Vitest suite once and exits. Tests run against a separate `test.db` file, created and cleared automatically — they do not touch or depend on `todo.db` or any existing task data.

## Stopping the application

Press `Ctrl+C` in the terminal running `npm run dev`. All data is already persisted to `todo.db` on disk at this point; restarting with `npm run dev` again will show the same tasks exactly as they were left.

## Troubleshooting

### "Could not locate the bindings file" error involving better-sqlite3

`better-sqlite3` includes a native binary that must be compiled or downloaded for your specific operating system and Node version as part of installation. On some systems this step does not complete correctly during a normal `npm install`. If you see this error when running the application, run:

```bash
npm rebuild better-sqlite3
```

then restart the application with `npm run dev`. If the error persists, perform a full clean reinstall:

```bash
rm -rf node_modules package-lock.json
npm install
```