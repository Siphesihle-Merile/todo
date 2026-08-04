# Todo Board

A local-first todo application built with Next.js and SQLite, presented as a dark, Trello-style Kanban board.

This application is not deployed anywhere. It runs entirely on your own machine.

## Features

- Create, edit, and archive tasks (title, description, due date, topic)
- Tasks are never deleted — archived tasks remain viewable
- Kanban board with drag-and-drop to change status (Todo / In Progress / Complete)
- Sortable by due date or topic
- Overdue tasks are automatically flagged, without overdue ever being a selectable status
- All data persists in a local SQLite file and survives restarts

## Getting Started

See [`docs/running-it.md`](docs/running-it.md) for exact install, run, and test commands.

## Documentation

- [Third-Party Code](docs/third-party-code.md)
- [Database Design](docs/database-design.md)
- [Running It](docs/running-it.md)