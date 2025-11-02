import { Location } from "./util.js";

export type Statistic = {
  cost: number;
  distance: number;
  duration: number;
  times: {
    driving: number;
    serving: number;
    waiting: number;
    break: number;
    commuting: number;
    parking: number;
  };
};

export type Stop = {
  location: Location;
  time: {
    arrival: string;
    depature: string;
  };
  parking?: {};
  distance: number;
  load: number[];
  activities: Activity[];
};

export type Activity = {
  jobId: string | "departure" | "arrival" | "break" | "reload";
  type: "delivery" | "pickup" | "departure" | "arrival" | "break" | "reload";
  location?: Location;
  time?: {
    start: string;
    end: string;
  };
  jobTag?: string;
  commute?: {
    forward: CommuteInfo;
    backward: CommuteInfo;
  };
};

export type CommuteInfo = {
  location: Location;
  distance: number;
  duration: number;
};

export type Unassigned = {
  jobId: string;
  reason: string[];
};

export type Tour = {
  vehicleId: string;
  typeId: "vehicle";
  shiftIndex: number;
  stops: Stop[];
  statistic: Statistic;
};

export type Solution = {
  statistic: Statistic;
  tours: Tour[];
  unassigned?: Unassigned[];
};
