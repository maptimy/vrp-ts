import { Location } from "./util.js";

/**
 * A job is used to model customer demand, additionally, with different constraints, such as time, skills, etc.
 */
export type Job = {
  /**
   * A unique job id.
   */
  id: string;
  /**
   * A list of pickup tasks.
   */
  pickups?: Pickup[];
  /**
   * A list of delivery tasks.
   */
  deliveries?: Deliveries[];
  /**
   * A list of replacement tasks.
   */
  replacements?: Replacement[];
  /**
   * A list of service tasks.
   */
  services?: Service[];
  /**
   * Job skills defined by `allOf`, `oneOf` or `noneOf` conditions.
   *
   * These conditions are tested against vehicle's skills.
   */
  skills?: {
    allOf: string[];
    oneOf: string[];
    noneOf: string[];
  };
  /**
   * A value associated with the job. With maximize-value objective, it is used to prioritize assignment of specific jobs.
   *
   * The difference between value and order is that order related logic tries to assign jobs with lower order in the beginning of the tour.
   *
   * In contrast, value related logic tries to maximize total solution value by prioritizing assignment value scored jobs in any position of a tour.
   *
   * {@link https://reinterpretcat.github.io/vrp/examples/pragmatic/basics/job-priorities.html See job priorities example.}
   */
  value?: number;
  /**
   * A group name. Jobs with the same groups are scheduled in the same tour or left unassigned.
   */
  group?: string;
  /**
   * compatibility class. Jobs with different compatibility classes cannot be assigned in the same tour.
   *
   * This is useful to avoid mixing cargo, such as hazardous goods and food.
   */
  compatibility?: string;
};

/**
 * List of possible places from which only one has to be visited.
 */
export type Place = {
  /**
   * A place location.
   */
  location: Location;
  /**
   * Service (operational) time to serve task here (in seconds.)
   */
  duration: number;
  /**
   * Time windows.
   */
  times?: [string, string][];
  /**
   * A job place tag which will be returned within job's activity in result solution.
   */
  tag?: string;
};

/**
 * A delivery, pickup, replacement and service lists specify multiple job tasks and at least one of such tasks has to be defined.
 */
export type Task = {
  /**
   * List of possible places from which only one has to be visited.
   */
  places: Place[];
  /**
   * A task demand. It is required for all job types, except service.
   */
  demand: number[];
  /**
   * A job task assignment order which makes preferable to serve some jobs before others in the tour.
   *
   * The order property is represented as integer greater than 1, where the lower value means higher priority.
   *
   * By default its value is set to maximum.
   */
  order?: number;
};

/**
 * Pickup job is a job with `job.pickups` property specified, without `job.deliveries`.
 *
 * The vehicle picks some `good` at pickup locations, which leads to capacity consumption growth according to `job.pickups.demand value`, and brings it till the end of the tour (or next reload).
 *
 * Each pickup task has its own properties such as `demand` and `places`.
 */
export type Pickup = Task;

/**
 * Delivery job is a job with `job.deliveries` property specified, without `job.pickups`.
 *
 * The vehicle picks some `goods` at the start stop, which leads to initial capacity consumption growth, and brings it to job's locations, where capacity consumption is decreased based on `job.deliveries.demand` values.
 *
 * Each delivery task has its own properties such as `demand` and `places`.
 */
export type Deliveries = Task;

/**
 * It models an use case when something big has to be replaced at the customer's location.
 *
 * This task requires a new `good` to be loaded at the beginning of the journey and old replaced one brought to journey's end.
 */
export type Replacement = Task;

/**
 * This job models some work without demand (e.g. handyman visit).
 */
export type Service = Omit<Task, "demand">;
