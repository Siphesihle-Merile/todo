# Database Design

## Overview

The application uses a single SQLite table, `tasks`, accessed via `better-sqlite3`. There is only one table because the application has no relationships to model — a single user, no accounts, no categories stored separately from the task itself (topic is a free-text field on the task, not a foreign key to a separate table).

## Schema

```sql
CREATE TABLE tasks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT,
  due_date TEXT NOT NULL,
  topic TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'todo' CHECK(status IN ('todo', 'in_progress', 'complete')),
  archived_at TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
```

## Column notes

| Column | Purpose |
|---|---|
| `id` | Primary key, auto-incrementing. |
| `title`, `description`, `due_date`, `topic` | The four required task fields from the brief. `description` is nullable; the other three are required. |
| `status` | One of exactly three fixed values, enforced at the database level via a `CHECK` constraint, not just in application code. This guarantees no invalid status can ever be written, even by a bug elsewhere in the codebase. |
| `archived_at` | Nullable timestamp. `NULL` means the task is active; any timestamp means the task has been archived at that time. Archiving never deletes a row — it only sets this column. |
| `created_at`, `updated_at` | Standard audit timestamps, defaulted and maintained by SQLite itself. |

## Design decisions

### Overdue is derived, not stored
There is no `overdue` column. Whether a task is overdue is computed at read time, in `lib/tasks.ts`, by comparing `due_date` against the current date and checking that `status` is not `'complete'`. This was a deliberate choice: overdue is a *consequence* of a due date passing, not an independent fact that needs to be tracked and kept in sync. Storing it as a column would require remembering to update it on every read (or worse, on a schedule), and it would risk becoming a fourth, informal "status" — which the brief explicitly says overdue must not be.

### Archiving is a flag, not a deletion
Archived tasks remain in the `tasks` table permanently; only `archived_at` changes. This satisfies the requirement that tasks can never be deleted and archived tasks must remain viewable. The application filters on `archived_at IS NULL` for the default active view, and can query the full table (including archived rows) when the user chooses to view the archive.

### Status as a single column with a CHECK constraint
Status is modelled as one `TEXT` column with three enumerated values, rather than as a separate `statuses` lookup table. Since the three statuses are fixed and not user-customisable (per the brief), a lookup table would add an unnecessary join for no benefit — the `CHECK` constraint achieves the same integrity guarantee more simply.

### No relationships / no foreign keys
The schema has one table because the application has no entities besides tasks. Topic is stored as free text directly on the task rather than as a reference to a separate `topics` table, since the brief does not require topics to be managed, listed, or constrained independently of the tasks that use them.