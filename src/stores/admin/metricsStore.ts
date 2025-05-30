import { getMetrics, updateMetricParams, toggleMetric, toggleAggregation, getAggregations } from "@/services/api/admin/metricsApi";
import { AggregationResponse, MetricResponse } from "@/types/api/responses/admin/metricsResponses";
import { create } from "zustand";

interface MetricsStoreState {
  metrics: MetricResponse[];
  loading: boolean;

  fetchMetrics: () => Promise<void>;
  toggleMetric: (name: string) => Promise<void>;
  updateMetricParams: (name: string, params: string) => Promise<void>;
}
export const useMetricsStore = create<MetricsStoreState>((set) => ({
  metrics: [],
  loading: false,

  fetchMetrics: async () => {
    set({ loading: true });
    try {
      const data = await getMetrics();
      set({ metrics: data ?? [], loading: false });
    } catch (e: any) {
      set({ loading: false });
      // Handle error in the hook
    }
  },

  toggleMetric: async (name: string) => {
    set({ loading: true });
    try {
      const data = await toggleMetric(name);
      set((state) => ({
        metrics: state.metrics.map((m) => (m.name === data.name ? data : m)),
        loading: false,
      }));
    } catch (e: any) {
      set({ loading: false });
      // Handle error in the hook
    }
  },

  updateMetricParams: async (name: string, params: string) => {
    set({ loading: true });
    try {
      await updateMetricParams(name, params);
      set((state) => ({
        metrics: state.metrics.map((m) => (m.name === name ? { ...m, parameters: params } : m)),
        loading: false,
      }));
    } catch (e: any) {
      set({ loading: false });
      // Handle error in the hook
    }
  },
}));

interface AggregationsStoreState {
  aggregations: AggregationResponse[];
  loading: boolean;

  fetchAggregations: () => Promise<void>;
  toggleAggregation: (name: string) => Promise<void>;
}
export const useAggregationsStore = create<AggregationsStoreState>((set) => ({
  aggregations: [],
  loading: false,

  fetchAggregations: async () => {
    set({ loading: true });
    try {
      const data = await getAggregations();
      set({ aggregations: data ?? [], loading: false });
    } catch (e: any) {
      set({ loading: false });
      // Handle error in the hook
    }
  },

  toggleAggregation: async (name: string) => {
    set({ loading: true });
    try {
      const data = await toggleAggregation(name);
      set((state) => ({
        aggregations: state.aggregations.map((a) =>
          a.name === data.name ? data : { ...a, isSelected: false }
        ),
        loading: false,
      }));
    } catch (e: any) {
      set({ loading: false });
      // Handle error in the hook
    }
  },
}));