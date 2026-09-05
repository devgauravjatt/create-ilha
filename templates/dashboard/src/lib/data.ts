/**
 * Demo data. Replace these with your own API calls — fetch inside an async
 * component, or move the module to `*.server.ts` and stream from the server:
 * https://ilha.build/guide/routing/server-islands/
 */

export type ProjectStatus = "healthy" | "degraded" | "paused";

export interface Project {
  id: string;
  name: string;
  status: ProjectStatus;
  requests: number;
  errorRate: number;
  region: string;
  updatedAt: string;
}

export interface ActivityEntry {
  actor: string;
  action: string;
  at: string;
}

export const PROJECTS: Project[] = [
  {
    errorRate: 0.4,
    id: "atlas",
    name: "Atlas",
    region: "iad1",
    requests: 128_400,
    status: "healthy",
    updatedAt: "2 minutes ago",
  },
  {
    errorRate: 2.7,
    id: "beacon",
    name: "Beacon",
    region: "fra1",
    requests: 42_100,
    status: "degraded",
    updatedAt: "18 minutes ago",
  },
  {
    errorRate: 0.1,
    id: "compass",
    name: "Compass",
    region: "gru1",
    requests: 9840,
    status: "healthy",
    updatedAt: "1 hour ago",
  },
  {
    errorRate: 0,
    id: "drift",
    name: "Drift",
    region: "syd1",
    requests: 0,
    status: "paused",
    updatedAt: "3 days ago",
  },
];

export const ACTIVITY: ActivityEntry[] = [
  { action: "deployed Atlas to production", actor: "ana", at: "2m" },
  { action: "rotated the Beacon API key", actor: "kai", at: "24m" },
  { action: "paused Drift", actor: "sam", at: "3d" },
  { action: "invited noor@example.com", actor: "ana", at: "5d" },
];

export const findProject = (id: string): Project | undefined =>
  PROJECTS.find((project) => project.id === id);

export const statusBadge = (status: ProjectStatus) => {
  if (status === "healthy") {
    return "badge badge-success badge-sm";
  }
  if (status === "degraded") {
    return "badge badge-warning badge-sm";
  }
  return "badge badge-ghost badge-sm";
};

export const formatNumber = (value: number) => new Intl.NumberFormat("en-US").format(value);
