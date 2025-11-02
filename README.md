# vrp-ts

TypeScript wrapper around the reinterpretcat/vrp library (WebAssembly + JS glue).
This package exposes a small, ergonomic API to build a pragmatic VRP problem, call the underlying solver compiled to WebAssembly, and parse results for use in TypeScript / JavaScript projects.

Key goals:
- Provide a lightweight TypeScript-friendly surface over the Rust VRP solver.
- Ship WASM build artifacts alongside JS glue to allow browser and Node usage.
- Keep the API minimal and predictable: create problems, add vehicles & jobs, provide travel matrices, and solve.

---

## Installation
```bash
npm install @maptimy/vrp-ts
```

---

## Contents

- `src/` — TypeScript wrapper and type definitions.
- `wasm/` — WebAssembly build output produced by the repository's build steps (generated).
- `lib/` — Compiled/bundled JS library files (published files).
- `vrp/` — Upstream Rust solver submodule (used to build the WASM).

---

## Features

- Strong TypeScript types for `Vehicle`, `Job`, `Place`, `Matrix`, and `PragmaticProblem`.
- Small `VRP` class that:
  - manages an internal pragmatic problem model,
  - exposes `getLocations()` to extract routing locations,
  - exposes `solve(matrix[], config)` which delegates to the WASM solver.
- Examples and docs of `vrp` upstream can be used for advanced constraints and options.

---

## Development

### Install

Install with pnpm (recommended, matches repository tooling):

```vrp-ts/README.md#L60-63
pnpm install
```

If you prefer npm or yarn, standard substitutions apply, but the repository uses `pnpm` for scripts and reproducible installs.

### Build

The project builds a WASM package from the included Rust `vrp` crate and bundles the TypeScript code:

```vrp-ts/README.md#L70-74
# Clean previous wasm, build wasm with wasm-pack then bundle with Vite
pnpm run build
```

What the `build` script does:
- `clean:wasm` — remove existing `wasm` folder
- `build:wasm` — run `wasm-pack` to build the Rust `vrp-cli` into `wasm/`
- `build` — runs wasm build and then `vite` to produce the `lib` output

Note: Building the WASM requires Rust toolchain and `wasm-pack` available in PATH.

---

## Quick Usage

Minimal TypeScript example using the exported `VRP` class (browser/Node where WASM is available):

```vrp-ts/README.md#L90-112
import { VRP } from "@maptimy/vrp-ts";
import type { Vehicle, Job, Matrix } from "@maptimy/vrp-ts";

(async () => {
  const vrp = new VRP();

  // set matrix profile name used by vehicles
  vrp.setProfile("car");

  // add vehicles (example)
  const vehicle: Vehicle = {
    typeId: "v1",
    vehicleIds: ["veh_1"],
    profile: { matrix: "car" },
    costs: { fixed: 0, time: 1, distance: 1 },
    shifts: [{
      start: { earliest: "08:00:00", location: { lat: 52.52, lng: 13.405 } }
    }],
    capacity: [100]
  };
  vrp.addVehicles(vehicle);

  // add a simple job
  const job: Job = {
    id: "job_1",
    deliveries: [{ places: [{ location: { lat: 52.5206, lng: 13.409 }, duration: 300 }], demand: [10] }]
  };
  vrp.addJobs(job);

  // travel matrix for profile "car"
  const matrix: Matrix = {
    matrix: "car",
    travelTimes: [/* flat array of travel times */],
    distances: [/* flat array of distances */]
  };

  // call solver
  const solution = await vrp.solve([matrix], { termination: { maxTime: 10, maxGeneration: 1000 } });
  console.log(JSON.stringify(solution, null, 2));
})();
```

Notes:
- The `matrix` arrays need to be in the expected flattened order for the solver. See upstream `vrp` docs/examples for matrix layout.
- `solve` returns the solver output parsed from JSON.

---

## API Overview

- `new VRP()` — Create a new VRP instance with a default empty pragmatic problem.
- `setProfile(profile: string)` — Set the matrix profile name used by vehicles.
- `addVehicles(...vehicles: Vehicle[])` — Add one or more vehicles to the fleet.
- `addJobs(...jobs: Job[])` — Add jobs to the plan.
- `getLocations(): Promise<Location[]>` — Retrieve routing locations derived from current problem.
- `solve(matrix: Matrix[], config?: Config)` — Run the solver (returns parsed JSON result).

See `src/types/*.ts` for full TypeScript type definitions of `Job`, `Vehicle`, `Matrix`, `PragmaticProblem`, and objectives.

---

## Example: Packaging and Publishing Notes

- The package exposes `lib/index.js` as the module entry and ships `wasm/` artifacts. When publishing to npm, ensure `wasm/` and `lib/` are included (the `package.json` `files` field already includes them).
- `prepublish` script runs `pnpm run build` so CI should run build before publishing.

---

## CI / Tests

This repository contains CI workflows in `vrp/.github/workflows` which build the Rust solver and run various checks. For local testing, run:

```vrp-ts/README.md#L172-175
# build and run basic TypeScript checks
pnpm install
pnpm run build
```

---

## Troubleshooting

- WASM build failures: ensure Rust toolchain (stable/nightly as required) and `wasm-pack` are installed and up-to-date.
- If the `solve` call fails or the solver panics, try to validate the pragmatic problem against upstream examples and simplify constraints; consult the upstream `vrp` docs for debugging tips.

Useful upstream references:
- upstream docs: https://reinterpretcat.github.io/vrp
- upstream repo: https://github.com/reinterpretcat/vrp

---

## Contributing

Contributions are welcome. Typical workflows:
- Open an issue to discuss design or a bug.
- Send a PR with a focused change; prefer small, well-tested patches.
- Building locally requires Rust + wasm-pack if changes touch the WASM.

---

## License

This project is licensed under Apache-2.0 (see `LICENSE`).

---
