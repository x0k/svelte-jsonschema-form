export type SchedulerYield = (options: {
  signal: AbortSignal;
}) => Promise<void>;
