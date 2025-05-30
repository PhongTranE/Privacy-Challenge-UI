import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAggregations, getMetrics, toggleAggregation, toggleMetric, updateMetricParams } from "@/services/api/admin/metricsApi";
import { useNotify } from "@/hooks/useNotify";
import { AggregationResponse, MetricResponse } from "@/types/api/responses/admin/metricsResponses";

export const useMetrics = () => {
  return useQuery<MetricResponse[]>({
    queryKey: ['admin', 'metrics'],
    queryFn: async () => {
      const res = await getMetrics();
      return res;
    },
  });
};

export const useToggleMetric = () => {
  const queryClient = useQueryClient();
  const { success, error } = useNotify();

  return useMutation({
    mutationFn: toggleMetric,
    onSuccess: (data) => {
      success("Success", `Metric '${data.name}' has been ${data.isSelected ? "activated" : "deactivated"}.`);
      queryClient.invalidateQueries({ queryKey: ['admin', 'metrics'] });
    },
    onError: (err: any) => {
      error("Error", err?.response?.data?.message || "Failed to toggle metric");
    },
  });
};

export const useUpdateMetricParams = () => {
  const queryClient = useQueryClient();
  const { success, error } = useNotify();

  return useMutation({
    mutationFn: (params: { name: string; parameters: string }) => updateMetricParams(params.name, params.parameters),
    onSuccess: () => {
      success("Success", "Metric parameters updated successfully.");
      queryClient.invalidateQueries({ queryKey: ['admin', 'metrics'] });
    },
    onError: (err: any) => {
      error("Error", err?.response?.data?.message || "Failed to update metric parameters");
    },
  });
};

export const useAggregations = () => {
  return useQuery<AggregationResponse[]>({
    queryKey: ['admin', 'aggregations'],
    queryFn: getAggregations,
  });
};

export const useToggleAggregation = () => {
  const queryClient = useQueryClient();
  const { success, error } = useNotify();

  return useMutation({
    mutationFn: toggleAggregation,
    onSuccess: (data) => {
      success("Success", `Aggregation '${data.name}' has been ${data.isSelected ? "activated" : "deactivated"}.`);
      queryClient.invalidateQueries({ queryKey: ['admin', 'aggregations'] });
    },
    onError: (err: any) => {
      error("Error", err?.response?.data?.message || "Failed to toggle aggregation");
    },
  });
};