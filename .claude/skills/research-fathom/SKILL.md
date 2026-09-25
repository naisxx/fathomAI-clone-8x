---
name: research-fathom
description: Evidence checklist and write-up format for exploring Fathom (or a competitor) end to end. Use when carrying out product research, recording observed flows and screenshots, or writing docs/research/FINDINGS.md.
---

# Research a product with evidence

The output is only worth what its provenance is worth. Tag everything.

## Provenance tags — mandatory

| Tag | Means |
|---|---|
| `[OBSERVED]` | You loaded it and saw it. Screenshot exists. |
| `[MARKETING]` | The vendor's own claim — landing page, docs, changelog. Unverified. |
| `[THIRD-PARTY]` | A review site, video or article. Someone else's screenshot. |
| `[ASSUMED]` | Your inference. Say what it rests on. |
| `[UNKNOWN]` | You could not determine it. **Keep these. Gaps are findings.** |

An untagged claim is a defect in the research.

## Before you start

- Confirm the access route (own account / public only / user-supplied screenshots).
- **Never enter credentials.** Hit a sign-in wall → stop, report, continue on
  public surfaces.
- Decline non-essential cookies.
- Note the timebox. Report what you did not reach rather than overrunning.

## Screenshots

- `docs/research/screens/NN-<what>.png`, two-digit prefix, ordered as encountered.
- Every screenshot referenced from the write-up with a caption and a tag.
- Capture the **states**, not just the happy path: empty, loading, error, and
  long content (hour-long meeting, eight speakers).
- An unreferenced screenshot may as well not exist.

## FINDINGS.md structure

```markdown
# Findings — <product>, <date>
Access route: <which> | Timebox: <planned> / <actual>

## 1. What it is
## 2. Flows observed          # one subsection per flow, step by step, tagged
## 3. The core screen         # anatomy: primary / secondary / hidden
## 4. Data model (inferred)   # entities, fields, relations
## 5. States and scale        # empty, loading, error, long content
## 6. Limitations and weaknesses
## 7. Could not determine     # the [UNKNOWN] list, in full
## 8. Answers to the plan's questions   # in the plan's order
## 9. Implications for our build
```

## Per-flow format

```markdown
### Flow: <name>   [OBSERVED]
Entry point: …
1. <action> → <what happened>   ![](screens/03-x.png)
2. …
Ends at: …
Notes: <surprises, latency, awkwardness>
```

## Quality bar

- Six or more captioned screenshots.
- Every question in the approved plan answered, or listed as `[UNKNOWN]`.
- A data model concrete enough to start building from.
- At least one honest weakness. A product with no observed weaknesses means the
  research was shallow.
- No claim that a flow was tested when it was only read about.
