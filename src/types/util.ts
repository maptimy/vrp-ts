/**
 * A place location.
 */
export type Location = {
  lat: number;
  lng: number;
};

export type Matrix = {
  matrix: string;
  travelTimes: number[];
  distances: number[];
};

export type Config = {
  termination: {
    maxTime: number;
    maxGeneration: number;
  };
};
