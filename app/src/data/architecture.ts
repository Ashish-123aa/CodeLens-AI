/**
 * MOCK DATA — architecture / dependency graph.
 * Coordinates are on a 0-100 grid and scaled by the graph component.
 */

export type LayerKind = "edge" | "service" | "data" | "external";

export interface GraphNode {
  id: string;
  label: string;
  kind: LayerKind;
  files: number;
  x: number;
  y: number;
}

export interface GraphEdge {
  from: string;
  to: string;
  calls: number;
  warning?: string;
}

export const graphNodes: GraphNode[] = [
  { id: "http", label: "HTTP router", kind: "edge", files: 34, x: 50, y: 8 },
  { id: "auth", label: "auth", kind: "service", files: 12, x: 18, y: 32 },
  { id: "checkout", label: "checkout", kind: "service", files: 21, x: 50, y: 32 },
  { id: "admin", label: "admin", kind: "service", files: 17, x: 82, y: 32 },
  { id: "gateway", label: "gateway", kind: "service", files: 9, x: 66, y: 56 },
  { id: "workers", label: "workers", kind: "service", files: 14, x: 30, y: 56 },
  { id: "pool", label: "db/pool", kind: "data", files: 6, x: 48, y: 80 },
  { id: "fraud", label: "fraud API", kind: "external", files: 0, x: 88, y: 80 },
  { id: "cache", label: "redis", kind: "data", files: 4, x: 12, y: 80 },
];

export const graphEdges: GraphEdge[] = [
  { from: "http", to: "auth", calls: 41 },
  { from: "http", to: "checkout", calls: 96 },
  { from: "http", to: "admin", calls: 28 },
  { from: "auth", to: "pool", calls: 33 },
  { from: "auth", to: "cache", calls: 19 },
  { from: "checkout", to: "gateway", calls: 52 },
  { from: "checkout", to: "pool", calls: 74 },
  { from: "checkout", to: "workers", calls: 22, warning: "fan-out without backpressure" },
  { from: "admin", to: "pool", calls: 31 },
  { from: "gateway", to: "fraud", calls: 52, warning: "no retry or timeout" },
  { from: "workers", to: "pool", calls: 48 },
  { from: "workers", to: "cache", calls: 11 },
];

export interface ModuleStat {
  module: string;
  dependents: number;
  dependencies: number;
  coupling: "low" | "medium" | "high";
}

export const moduleStats: ModuleStat[] = [
  { module: "db/pool", dependents: 41, dependencies: 1, coupling: "high" },
  { module: "checkout", dependents: 6, dependencies: 9, coupling: "high" },
  { module: "auth", dependents: 12, dependencies: 4, coupling: "medium" },
  { module: "workers", dependents: 3, dependencies: 7, coupling: "medium" },
  { module: "gateway", dependents: 2, dependencies: 2, coupling: "low" },
  { module: "utils/format", dependents: 28, dependencies: 0, coupling: "low" },
];

export const architectureNotes = [
  "One circular import detected: checkout → workers → checkout (via shared order types).",
  "db/pool is imported by 41 modules and is the single point of failure for reads and writes.",
  "The fraud API is the only unguarded external dependency in the request path.",
];

export const layerLabels: Record<LayerKind, string> = {
  edge: "Entry",
  service: "Service",
  data: "Data store",
  external: "Third party",
};
