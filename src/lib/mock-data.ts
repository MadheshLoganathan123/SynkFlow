export type StageStatus = "success" | "running" | "failed" | "pending" | "skipped";
export type RunStatus = "success" | "running" | "failed";

export interface PipelineStage {
  name: string;
  status: StageStatus;
  duration: string;
  detail?: string;
  timestamp?: string;
}

export interface ActivePipeline {
  id: string;
  number: number;
  title: string;
  triggeredBy: string;
  triggeredAgo: string;
  stages: PipelineStage[];
}

export interface PipelineRun {
  id: string;
  branch: string;
  status: RunStatus;
  duration: string;
  trigger: string;
  triggerType: "push" | "pr" | "cron";
  timestamp: string;
}

export interface PipelineDetail {
  id: string;
  name: string;
  status: RunStatus;
  startedAt: string;
  triggeredBy: string;
  commit: string;
  steps: {
    name: string;
    status: StageStatus;
    duration: string;
    detail: string;
  }[];
  logs: { line: number; level: "info" | "warn" | "error" | "fail" | "muted"; text: string }[];
}

export interface AuditEvent {
  timestamp: string;
  event: string;
  status: "complete" | "failed" | "running";
  user: string;
  duration: string;
}

export const activePipelines: ActivePipeline[] = [
  {
    id: "4129",
    number: 4129,
    title: "Feature: Auth Migration",
    triggeredBy: "@dev_marianne",
    triggeredAgo: "12m ago",
    stages: [
      { name: "Build", status: "success", duration: "2m 14s", timestamp: "14:02:11" },
      { name: "Test Suite", status: "running", duration: "1m 45s", detail: "Processing..." },
      { name: "Deploy", status: "pending", duration: "--:--", detail: "Waiting" },
    ],
  },
];

export const auditLog: AuditEvent[] = [
  { timestamp: "14:02:11", event: "Build stage: synkflow-ui:v4.2.0", status: "complete", user: "@dev_marianne", duration: "2m 14s" },
  { timestamp: "13:45:02", event: "Full Cluster Security Sweep", status: "complete", user: "System (CRON)", duration: "8m 42s" },
  { timestamp: "13:12:44", event: "Hotfix: API rate limiting", status: "failed", user: "@lead_architect", duration: "42s" },
  { timestamp: "12:58:10", event: "Deploy: payments-svc v2.7.1", status: "complete", user: "@ops_neil", duration: "3m 08s" },
  { timestamp: "12:30:55", event: "Rollback: auth-svc v1.9.4", status: "complete", user: "@dev_marianne", duration: "1m 12s" },
];

export const pipelineHistory: PipelineRun[] = [
  { id: "SF-89241", branch: "feat/multi-cluster-sync", status: "running", duration: "4m 12s", trigger: "Push by @m_dev", triggerType: "push", timestamp: "Just now" },
  { id: "SF-89239", branch: "main", status: "success", duration: "12m 45s", trigger: "PR #452 Merge", triggerType: "pr", timestamp: "2 hours ago" },
  { id: "SF-89235", branch: "hotfix/db-leak", status: "failed", duration: "1m 02s", trigger: "Cron Job", triggerType: "cron", timestamp: "5 hours ago" },
  { id: "SF-89230", branch: "main", status: "success", duration: "11m 20s", trigger: "Push by @tech_lead", triggerType: "push", timestamp: "8 hours ago" },
  { id: "SF-89228", branch: "feat/realtime-logs", status: "success", duration: "9m 04s", trigger: "PR #449 Merge", triggerType: "pr", timestamp: "12 hours ago" },
  { id: "SF-89221", branch: "chore/deps-bump", status: "success", duration: "6m 51s", trigger: "Push by @bot_dependabot", triggerType: "push", timestamp: "1 day ago" },
  { id: "SF-89215", branch: "exp/edge-runtime", status: "failed", duration: "2m 33s", trigger: "Push by @dev_marianne", triggerType: "push", timestamp: "1 day ago" },
];

export const pipelineDetails: Record<string, PipelineDetail> = {
  "production-deploy-v42": {
    id: "production-deploy-v42",
    name: "production-deploy-v42",
    status: "failed",
    startedAt: "14:02:45 UTC",
    triggeredBy: "dev-ops-alex",
    commit: "8f2a1c9",
    steps: [
      { name: "Checkout Code", status: "success", duration: "12s", detail: "Source: main branch" },
      { name: "Install Dependencies", status: "success", duration: "1m 45s", detail: "Using npm cache" },
      { name: "Run Tests", status: "failed", duration: "32s", detail: "Exit code: 1" },
      { name: "Build Container", status: "skipped", duration: "--", detail: "Skipped due to failure" },
      { name: "Push to Registry", status: "skipped", duration: "--", detail: "Skipped due to failure" },
    ],
    logs: [
      { line: 1, level: "muted", text: "$ npm test -- --ci --maxWorkers=2" },
      { line: 2, level: "muted", text: "... starting jest runner" },
      { line: 3, level: "info", text: "PASS src/utils/math.test.ts (8.2s)" },
      { line: 4, level: "info", text: "PASS src/components/auth/Login.test.tsx (12.4s)" },
      { line: 5, level: "warn", text: "WARN src/api/client.ts: Large payload detected in interceptor" },
      { line: 6, level: "info", text: "RUNS src/services/pipeline.test.ts" },
      { line: 7, level: "fail", text: "FAIL src/services/pipeline.test.ts" },
      { line: 8, level: "muted", text: "  ● Pipeline Service > should trigger auto-scaling on load" },
      { line: 9, level: "muted", text: "    expect(received).toBe(expected) // Object.is equality" },
      { line: 10, level: "muted", text: '    Expected: "active"' },
      { line: 11, level: "muted", text: '    Received: "pending"' },
      { line: 12, level: "error", text: "Test Suites: 1 failed, 12 passed, 13 total" },
      { line: 13, level: "error", text: "Tests:       1 failed, 142 passed, 143 total" },
      { line: 14, level: "muted", text: "Snapshots: 0 total" },
      { line: 15, level: "muted", text: "Time:      31.84s" },
      { line: 16, level: "error", text: "Error: Process completed with exit code 1." },
    ],
  },
};

export const failureInsights = {
  mttr: "14m 22s",
  healthIndex: "88.4%",
  distribution: [
    { label: "Lint Errors", value: 124, color: "oklch(0.78 0.16 75)" },
    { label: "Unit Tests", value: 92, color: "oklch(0.65 0.22 25)" },
    { label: "E2E Failures", value: 61, color: "oklch(0.65 0.22 285)" },
    { label: "OOM Kills", value: 38, color: "oklch(0.70 0.15 240)" },
    { label: "Deployment", value: 14, color: "oklch(0.72 0.18 155)" },
  ],
  recentFailures: [
    {
      id: "PIPE-9421",
      name: "production-deployment-v4",
      failedAgo: "Failed 2m ago",
      rootCause: "TIMEOUT",
      log: [
        "[ERROR] 14:22:01.443 - Connection timed out after 30000ms",
        "  at Socket.connect (node:net:548:7)",
        "  at TCPConnectWrap.afterConnect [as oncomplete] (node:net:1187:10)",
        "ERR_CONNECTION_TIMED_OUT: Cluster node 'ap-south-1c' unreachable.",
      ],
    },
    {
      id: "PIPE-9388",
      name: "integration-tests-auth",
      failedAgo: "Failed 14m ago",
      rootCause: "ASSERTION",
      log: [
        "FAIL src/auth/login.spec.ts",
        "  ● AuthModule > should reject expired tokens",
        "  Expected: 401 Unauthorized",
        "  Received: 500 Internal Server Error",
      ],
    },
  ],
};
