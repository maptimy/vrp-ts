/**
 * Minimizes total transport cost calculated for all routes.
 *
 * Here, total transport cost is seen as linear combination of total time and distance.
 */
export type MinimizeCost = {
  type: "minimize-cost";
};

/**
 * Minimizes total distance of all routes.
 */
export type MinimizeDistance = {
  type: "minimize-distance";
};

/**
 * Minimizes total duration of all routes.
 */
export type MinimizeDuration = {
  type: "minimize-distance";
};

/**
 * Minimizes amount of unassigned jobs.
 *
 * Although, solver tries to minimize amount of unassigned jobs all the time, it is possible that solution, discovered during refinement, has more unassigned jobs than previously accepted.
 *
 * The reason of that can be conflicting objective (e.g. minimize tours) and restrictive constraints such as time windows.
 */
export type MinimizeUnassigned = {
  type: "minimize-unassigned";
  /**
   * A multiplicative coefficient to make breaks more preferable for assignment.
   *
   * Default value is 1. Setting this parameter to a value bigger than 1 is useful when it is highly desirable to have break assigned but its assignment leads to more jobs unassigned.
   */
  breaks?: number;
};

/**
 * Minimizes total amount of tours present in solution.
 */
export type MinimizeTours = {
  type: "minimize-tours";
};

/**
 * Maximizes total amount of tours present in solution.
 */
export type MaximizeTours = {
  type: "maximize-tours";
};

/**
 * Prefers solutions where work is finished earlier.
 */
export type MinimizeArrivalTime = {
  type: "minimize-arrival-time";
};

/**
 * Prefers solutions when jobs are served early in tours.
 */
export type FastService = {
  type: "fast-service";
  /**
   * An objective tolerance specifies how different objective values have to be to consider them different.
   *
   * Relative distance metric is used.
   */
  tolerance?: number;
};

/**
 * Maximizes total value of served jobs.
 */
export type MaximizeValue = {
  type: "maximize-value";
  /**
   * A factor to reduce value cost compared to max routing costs.
   */
  reductionFactor?: number;
  /**
   * A value penalty for skipping a break. Default value is 100.
   */
  breaks?: number;
};

/**
 * Controls desired activity order in tours.
 */
export type TourOrder = {
  type: "tour-order";
  /**
   * Violating order is not allowed, even if it leads to less assigned jobs (default is true).
   */
  isConstrained?: boolean;
};

/**
 * Controls how tour is shaped by limiting amount of shared jobs, assigned in different routes, for a given job' neighbourhood.
 */
export type CompactTour = {
  type: "compact-tour";
  options: {
    /**
     * A radius of neighbourhood, minimum is 1.
     */
    jobRadius: number;
    /**
     * A minimum shared jobs to count.
     */
    threshold: number;
    /**
     * A minimum relative distance between counts when comparing different solutions.
     *
     * This objective is supposed to be on the same level within cost ones.
     */
    distance: number;
  };
};

/**
 * Balances max load in tour.
 */
export type BalanceMaxLoad = {
  type: "balance-max-load";
};

/**
 * Balances amount of activities performed in tour.
 */
export type BalanceActivities = {
  type: "balance-activities";
};

/**
 * Balances travelled distance per tour.
 */
export type BalanceDistance = {
  type: "balance-distance";
};

/**
 * Balances tour durations.
 */
export type BalanceDuration = {
  type: "balance-duration";
};

export type MultiObjective = {
  type: "multi-objective";
  strategy: {
    name: "sum";
  };
  objectives: Objective[];
};

export type Objective =
  | MinimizeCost
  | MinimizeDistance
  | MinimizeDuration
  | MinimizeTours
  | MinimizeArrivalTime
  | MinimizeUnassigned
  | MaximizeTours
  | MaximizeValue
  | BalanceMaxLoad
  | BalanceActivities
  | BalanceDuration
  | BalanceDistance
  | TourOrder
  | CompactTour
  | FastService;
