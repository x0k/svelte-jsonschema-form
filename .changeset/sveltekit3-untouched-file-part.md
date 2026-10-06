---
"@sjsf/sveltekit3": patch
---

Fix the FormData submission path crashing the page on a form with a file field. Every untouched `<input type="file">` reports `File("")`, which `connect()` copied into the submission form through a `DataTransfer`. That file was built in script rather than chosen by the user, so Chromium terminates the renderer that uploads one (`bad IPC message, reason 2`), which reads to Playwright as an empty field or a page crash. The empty part carried nothing — `convertFormDataEntry` drops it — so it is now left out, as the JSON path already did.
