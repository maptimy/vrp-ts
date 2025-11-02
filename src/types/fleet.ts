import { Place } from "./job.js";
import { Location } from "./util.js";

export type Fleet = {
  resources?: Resource[];
  vehicles: Vehicle[];
  profiles: { name: string }[];
};

/**
 * An idea of reload resource is to put limit on amount of deliveries in total loaded to the multiple vehicles on specific reload place.
 *
 * A good example is some warehouse which can be visited by multiple vehicles in the middle of their tours, but it has only limited amount of deliveries.
 */
export type Resource = {
  /**
   * Should be set to `reload`.
   */
  type: "reload";
  /**
   * An unique resource id.
   *
   * Put this id in vehicle reload's `resourceId` property to trigger shared resource behavior
   */
  id: string;
  /**
   * Total amount of resource.
   *
   * It has the same type as vehicle's capacity property.
   */
  capacity: number[];
};

export type Vehicle = {
  /**
   * A vehicle type id.
   */
  typeId: string;
  /**
   * A list of concrete vehicle ids available for usage.
   */
  vehicleIds: string[];
  /**
   * A vehicle profile.
   */
  profile: {
    /**
     * A name of matrix profile.
     */
    matrix: string;
    /**
     * Duration scale applied to all travelling times (default is 1.0.)
     */
    scale?: number;
  };
  /**
   * Specifies how expensive is vehicle usage.
   */
  costs: {
    /**
     * A fixed cost per vehicle tour.
     */
    fixed: number;
    /**
     * A cost per time unit.
     */
    time: number;
    /**
     * A cost per distance unit.
     */
    distance: number;
  };
  /**
   * Specify one or more vehicle shift.
   */
  shifts: Shift[];
  /**
   * Specifies vehicle capacity symmetric to job demand.
   */
  capacity: number[];
  /**
   * Vehicle skills needed by some jobs.
   */
  skills?: string[];
  /**
   * Vehicle limits.
   */
  limits?: Limit;
  /**
   * A list of vehicle reloads.
   *
   * A reload is a place where vehicle can load new deliveries and unload pickups.
   *
   * It can be used to model multi trip routes.
   */
  reloads?: Reload[];
  /**
   * Specifies recharging stations and max distance limit before recharge should happen.
   *
   * @experimental
   * An experimental feature to model a simple scenario of Electric VRP.
   *
   * Here, the vehicles have a distance limit (10km), so that they are forced to visit charging stations.
   *
   * Each station is defined by specific location, charging duration and time windows.
   */
  recharges?: Recharge;
};

export type Limit = {
  /**
   * Max tour duration.
   */
  maxDuration?: number;
  /**
   * Max tour distance.
   */
  maxDistance?: number;
  /**
   * Max amount of activities in the tour (without departure/arrival).
   *
   * Please note, that clustered activities are counted as one in case of vicinity clustering.
   */
  tourSize?: number;
};

export type Shift = {
  /**
   * Specifies vehicle start place defined via location, earliest (required) and latest (optional) departure time.
   */
  start: {
    earliest: string;
    latest?: string;
    location: Location;
  };
  /**
   * Specifies vehicle end place defined via location, earliest (reserved) and latest (required) arrival time. When omitted, then vehicle ends on last job location.
   */
  end?: {
    earliest?: string;
    latest: string;
    location: Location;
  };
  /**
   * A list of vehicle breaks.
   */
  breaks?: RequiredBreak[] | OptionalBreak[];
};

/**
 * This break is guaranteed to be assigned at cost of flexibility
 */
export type RequiredBreak = {
  /**
   * A fixed time or time offset interval when the break should happen specified by `earliest` and `latest` properties.
   *
   * The break will be assigned not earlier, and not later than the range specified.
   */
  time: string;
  /**
   * Duration of the break (seconds.)
   */
  duration: number;
};

/**
 * Although such break is not guaranteed for assignment, it has some advantages over required break.
 */
export type OptionalBreak = {
  /**
   * Time window or time offset interval after which a break should happen (e.g. between 3 or 4 hours after start.)
   */
  time: string;
  /**
   * List of alternative places.
   *
   * If location of a break is omitted then break is stick to location of a job served before break.
   */
  places: Omit<Place, "location"> & { location?: Location };
  /**
   * A break skip policy.
   *
   * Allows to skip break if actual tour schedule doesn't intersect with vehicle time window (default.)
   *
   * Allows to skip break if vehicle arrives before break's time window end.
   */
  policy?: "skip-if-no-intersection" | "skip-if-arrival-before-end";
};

/**
 * A reload is a place where vehicle can load new deliveries and unload pickups.
 *
 * It can be used to model multi trip routes.
 */
export type Reload = {
  /**
   * An actual place where reload activity happens.
   */
  location: Location;
  /**
   * Duration of reload activity.
   */
  duration: number;
  /**
   * Reload time windows.
   */
  times?: [string, string][];
  /**
   * A tag which will be propagated back within the corresponding reload activity in solution.
   */
  tag?: string;
  /**
   * A shared reload resource id. It is used to limit amount of deliveries loaded at this reload.
   *
   * See examples {@link https://reinterpretcat.github.io/vrp/examples/pragmatic/basics/reload.html here}.
   */
  resourceId?: string;
};

/**
 * Specifies recharging stations and max distance limit before recharge should happen.
 *
 * See examples {@link https://reinterpretcat.github.io/vrp/examples/pragmatic/basics/recharge.html here}.
 */
export type Recharge = {
  maxDistance: number;
  stations: Station[];
};

export type Station = {
  location: Location;
  duration: number;
};
