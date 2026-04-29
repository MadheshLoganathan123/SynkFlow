import { createServerFn } from "@tanstack/react-start";
import {
  activePipelines,
  pipelineHistory,
  pipelineDetails,
  auditLog,
} from "@/lib/mock-data";

// GET /pipelines — active runs + audit log
export const getPipelines = createServerFn({ method: "GET" }).handler(async () => {
  return { active: activePipelines, audit: auditLog };
});

// GET /pipeline/:id
export const getPipeline = createServerFn({ method: "GET" })
  .inputValidator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    const detail = pipelineDetails[data.id] ?? pipelineDetails["production-deploy-v42"];
    return { pipeline: detail };
  });

// GET /history
export const getHistory = createServerFn({ method: "GET" }).handler(async () => {
  return { runs: pipelineHistory };
});
