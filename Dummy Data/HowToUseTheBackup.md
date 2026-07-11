# How to Load Dummy Data Into Your Tracker App

This guide works for **any** of these self-contained HTML apps (e.g. the Ledger finance tracker, the Kindred relationship/mind tracker, or similar tools built the same way). They all follow the same pattern, so the same steps apply regardless of which one you're using.

## Why this works the same way everywhere

Each app:
- Runs entirely in your browser — there's no server involved.
- Keeps all your data (transactions, entries, people, habits, etc.) in the browser's local storage for that file, or in Claude's artifact storage if you're running it as an artifact.
- Has a **Settings** page (or panel) with three data controls:
  - **Export backup (.json)** — downloads everything as a single JSON file.
  - **Restore backup** — lets you upload a JSON file and replace all current data with it.
  - **Reset all data** — wipes everything.

A "dummy data" file is just a JSON file shaped exactly like a real backup, pre-filled with sample entries. Restoring it is identical to restoring your own backup.

## Steps to import dummy data

1. **Open the app** (in your browser, or wherever you're running the HTML file / artifact).
2. **Back up anything real first, if it matters to you.** Restoring dummy data overwrites everything currently stored. If you have real entries you care about, go to **Settings → Export backup**, save that file somewhere safe, before continuing.
3. Go to the **Settings** page.
4. Click **Restore backup** (sometimes shown with an up-arrow icon, e.g. "⭱ Restore backup").
5. In the file picker, select the dummy data `.json` file (e.g. `ledger_Sample.json` or a similarly named Kindred sample file).
6. Confirm the prompt if one appears (some apps ask "This replaces everything currently in the app — continue?").
7. The app will reload its views with the sample data — dashboards, charts, lists, and cards should now show populated content instead of empty states.

## Getting back to normal afterward

- To remove the dummy data: go to **Settings → Reset all data**, or restore your own previously exported backup from step 2.
- To keep the dummy data as a starting point: just keep using the app — new entries you add will merge in normally alongside the sample data.

## Notes

- The JSON file must match the app's expected structure (same field names as what **Export backup** produces). A dummy data file generated for one app (e.g. Ledger) will **not** work in a different app (e.g. Kindred) — each has its own schema. Use the dummy file that was made for the specific app you're populating.
- If the app rejects the file with a message like *"doesn't look like a backup"*, double check you're uploading the correct dummy file for that specific app.
- Nothing leaves your browser during this process — importing is just loading a local file into local storage (or artifact storage), the same as restoring your own backup.