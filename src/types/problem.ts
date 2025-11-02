import { Fleet } from "./fleet.js";
import { Job } from "./job.js";
import { MultiObjective, Objective } from "./objective.js";

/**
 * Relation is a mechanism to lock jobs to specific vehicles.
 */
export type Relation = {
  /**
   * A `any` relation is used to lock specific jobs to certain vehicle in any order.
   *
   * A `sequence` relation is used to lock specific jobs to certain vehicle in fixed order allowing insertion of new jobs in between.
   *
   * In contrast to `sequence` relation, `strict` locks jobs to certain vehicle without ability to insert new jobs in between.
   */
  type: "any" | "sequence" | "strict";
  /**
   * A specific vehicle id.
   */
  vehicleId: string;
  /**
   * List of job ids including reserved: `departure`, `arrival`, `break` and `reload`
   */
  jobs: string[];
  /**
   * A vehicle shift index. If not specified, a first, zero indexed, shift assumed.
   */
  shiftIndex?: number;
};

export type PragmaticProblem = {
  /**
   * Models a work to be performed by vehicles taking into account all related constraints, such as time windows, demand, skills, etc.
   */
  plan: {
    jobs: Job[];
    relations?: Relation[];
  };
  /**
   * Models available resources defined by vehicle types.
   */
  fleet: Fleet;
  /**
   * Defines objective functions as goal of whole optimization.
   */
  objectives?: Objective[] | MultiObjective[];
};
