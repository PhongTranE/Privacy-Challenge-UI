import { useEffect, useState } from "react";
import {
  Box,
  Group,
  Title,
  Table,
  Switch,
  Radio,
  TextInput,
  Button,
  Modal,
  Text,
} from "@mantine/core";
import { useAggregationsStore, useMetricsStore } from "@/stores/admin/metricsStore";
import { useNotify } from "@/hooks/useNotify";
import { IconX, IconCheck } from "@tabler/icons-react";

export default function MetricsAggregationManager() {
  // Aggregation
  const {
    aggregations,
    fetchAggregations,
    toggleAggregation,
  } = useAggregationsStore();
  const [selectedAggregation, setSelectedAggregation] = useState<string | null>(null);

  // Metrics
  const {
    metrics,
    fetchMetrics,
    toggleMetric,
    updateMetricParams,
  } = useMetricsStore();

  // Notify
  const { success } = useNotify();

  // Params editing state
  const [editingParams, setEditingParams] = useState<Record<string, string>>({});
  const [modalOpen, setModalOpen] = useState(false);
  const [pendingUpdate, setPendingUpdate] = useState<{ name: string; value: string } | null>(null);
  const [invalidParam, setInvalidParam] = useState<boolean>(false); // Track if param is valid JSON

  useEffect(() => {
    fetchMetrics();
    fetchAggregations();
  }, []);

  // Đồng bộ selectedAggregation với aggregations từ BE
  useEffect(() => {
    if (aggregations.length > 0) {
      const selected = aggregations.find(a => a.isSelected);
      setSelectedAggregation(selected ? selected.name : null);
    }
  }, [aggregations]);

  // Aggregation radio handler
  const handleAggregationChange = async (aggName: string) => {
    if (aggName !== selectedAggregation) {
      await toggleAggregation(aggName);
      setSelectedAggregation(aggName);
      success("Success", `Aggregation '${aggName}' has been selected!`);
    }
  };

  // Metrics switch handler
  const handleMetricToggle = async (name: string) => {
    await toggleMetric(name);
    success("Success", `Metric '${name}' has been ${metrics.find(m => m.name === name)?.isSelected ? "deactivated" : "activated"}.`);
    fetchMetrics();
  };

  // Param input handler
  const handleParamChange = (name: string, value: string) => {
    try {
      JSON.parse(value); // Check if valid JSON
      setInvalidParam(false);
    } catch (err) {
      setInvalidParam(true); // Invalid JSON
    }
    setEditingParams((prev) => ({ ...prev, [name]: value }));
  };

  // Update button click
  const handleUpdateClick = (name: string) => {
    const value = editingParams[name];
    setPendingUpdate({ name, value });
    setModalOpen(true);
  };

  // Confirm update
  const confirmUpdate = async () => {
    if (pendingUpdate) {
      await updateMetricParams(pendingUpdate.name, pendingUpdate.value);
      setModalOpen(false);
      setPendingUpdate(null);
      success("Success", "Metric parameters updated!");
    }
  };

  return (
    <Box p="md" className="rounded-lg mt-4">
      <Title size="xl" fw={500} c="#ff8c00" className="mb-4">
        Manage Metrics and Aggregations
      </Title>

      {/* Aggregation Radio Button */}
      <Title order={4} c="#ff8c00" className="mt-4">
        Aggregation
      </Title>
      <Radio.Group value={selectedAggregation} onChange={handleAggregationChange} className="m-4">
        <Group gap="lg">
          {aggregations.map((agg) => (
            <Radio
              key={agg.id}
              value={agg.name}
              label={agg.name}
              className="text-white"
              color="orange"
              size="md"
            />
          ))}
        </Group>
      </Radio.Group>

      {/* Metrics Table */}
      <Title order={4} c="#ff8c00" className="mt-4">
        Metrics
      </Title>
      <Table withColumnBorders className="text-white rounded-lg" highlightOnHover>
        <thead className="bg-orange-500">
          <tr>
            <th className="text-white">Metric</th>
            <th className="text-white text-start">Status</th>
            <th className="text-white">Parameters</th>
            <th className="text-white">Action</th>
          </tr>
        </thead>
        <tbody>
          {metrics.map((metric) => {
            const paramValue = editingParams[metric.name] ?? metric.parameters;
            const paramChanged = paramValue !== metric.parameters;

            return (
              <tr key={metric.id} className="hover:bg-gray-800">
                <td className="p-4">{metric.name}</td>
                <td className="text-center">
                  <Switch
                    color="green"
                    checked={metric.isSelected}
                    onChange={() => handleMetricToggle(metric.name)}
                    thumbIcon={
                      metric.isSelected ? (
                        <IconCheck size={12} color="var(--mantine-color-teal-6)" stroke={3} />
                      ) : (
                        <IconX size={12} color="var(--mantine-color-red-6)" stroke={3} />
                      )
                    }
                  />
                </td>
                <td>
                  <TextInput
                    value={paramValue}
                    onChange={(e) => handleParamChange(metric.name, e.currentTarget.value)}
                    classNames={{ input: "bg-gray-800 text-white" }}
                    size="sm"
                    placeholder="Enter parameters (JSON)"
                  />
                </td>
                <td className="text-center">
                  <Button
                    size="xs"
                    color="orange"
                    disabled={!metric.isSelected || !paramChanged || invalidParam} // Disable when metric is not selected or invalid
                    onClick={() => handleUpdateClick(metric.name)}
                  >
                    Update
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>

      {/* Modal Confirm Update */}
      <Modal opened={modalOpen} onClose={() => setModalOpen(false)} title="Confirm Update" centered>
        <Text>Are you sure you want to update this metric's parameters?</Text>
        <Group mt="md" justify="flex-end">
          <Button variant="default" onClick={() => setModalOpen(false)}>
            Cancel
          </Button>
          <Button color="orange" onClick={confirmUpdate}>
            Confirm
          </Button>
        </Group>
      </Modal>
    </Box>
  );
}
