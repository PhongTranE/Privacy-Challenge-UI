import axiosInstance from '@/services/axiosInstance';
import { AggregationResponse, MetricResponse } from '@/types/api/responses/admin/metricsResponses';


// Metrics APIs
export const getMetrics = async (): Promise<MetricResponse[]> => {
  const response = await axiosInstance.get('/admin/metric');
  return response.data;
};

export const createMetric = async (data: { name: string; parameters?: string }) => {
  const response = await axiosInstance.post('/admin/metric', data);
  return response.data;
};

export const updateMetricParams = async (
  name: string, parameters: string
): Promise<MetricResponse> => {
  const response = await axiosInstance.patch(`/admin/metric/${name}/parameters`, { parameters });
  console.log(response.data);
  return response.data;
};

export const toggleMetric = async (
  name: string
): Promise<MetricResponse> => {
  const response = await axiosInstance.patch(`/admin/metric/${name}/toggle`);
  return response.data;
};

// Aggregation APIs
export const getAggregations = async (): Promise<AggregationResponse[]> => {
  const response = await axiosInstance.get('/admin/aggregation');
  return response.data;
};

export const toggleAggregation = async (
  name: string
): Promise<AggregationResponse> => {
  const response = await axiosInstance.patch(`/admin/aggregation/${name}/toggle`);
  return response.data;
};