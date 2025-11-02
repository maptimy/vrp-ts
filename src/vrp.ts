import {
  get_routing_locations,
  solve_pragmatic,
  validate_pragmatic,
} from "../wasm/vrp_cli.js";
import { Vehicle } from "./types/fleet.js";
import { Job } from "./types/job.js";
import { Location } from "./types/util.js";
import { MultiObjective, Objective } from "./types/objective.js";
import { PragmaticProblem } from "./types/problem.js";
import { Config, Matrix } from "./types/util.js";

export class VRP {
  private _problem: PragmaticProblem;

  constructor() {
    this._problem = {
      plan: {
        jobs: [],
      },
      fleet: {
        vehicles: [],
        profiles: [
          {
            name: "",
          },
        ],
      },
    };
  }

  public setProfile(profile: string) {
    if (!this._problem.fleet.profiles[0]) {
      this._problem.fleet.profiles[0] = {
        name: "",
      };
    }
    this._problem.fleet.profiles[0].name = profile;
  }

  public addVehicles(...vehicles: Vehicle[]) {
    this._problem.fleet.vehicles.push(...vehicles);
  }

  public addJobs(...jobs: Job[]) {
    this._problem.plan.jobs.push(...jobs);
  }

  public async getLocations(): Promise<Location[]> {
    return JSON.parse(await get_routing_locations(this._problem)) as Location[];
  }

  public async solve(
    matrix: Matrix[],
    config: Config = { termination: { maxTime: 10, maxGeneration: 1000 } },
  ) {
    return JSON.parse(await solve_pragmatic(this._problem, matrix, config));
  }
}
