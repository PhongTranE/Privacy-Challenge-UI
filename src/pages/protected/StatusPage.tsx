import React, { useState } from "react";
import {
  Container,
  Title,
  Card,
  Text,
  Badge,
  Stack,
  Group,
  Button,
  Divider,
  Alert,
  ThemeIcon,
  Loader,
  Grid,
  Modal,
  ActionIcon,
  Tooltip,
  Flex,
} from "@mantine/core";
import {
  IconSettings,
  IconAlertCircle,
  IconCheck,
  IconRefresh,
  IconInfoCircle,
  IconSwords,
  IconFlag,
  IconPlayerPlay,
  IconPlayerPause,
} from "@tabler/icons-react";
import {
  useCompetitionStatus,
  usePhaseControl,
  useRestartCompetition,
} from "@/hooks/api/admin/useCompetition";

const getPhaseColor = (phase: string) => {
  switch (phase) {
    case "setup":
      return "gray";
    case "submission":
      return "cyan";
    case "finished_submission":
      return "gray";
    case "attack":
      return "red";
    case "finished":
      return "green";
    default:
      return "gray";
  }
};

const getPhaseDisplayName = (phase: string) => {
  switch (phase) {
    case "setup":
      return "Setup";
    case "submission":
      return "Submission Phase";
    case "finished_submission":
      return "Finished Submission Phase";
    case "attack":
      return "Attack Phase";
    case "finished":
      return "Finished";
    default:
      return "Unknown";
  }
};

const getPhaseDescription = (phase: string) => {
  switch (phase) {
    case "setup":
      return "Admin setup metrics - aggregation, upload/activate raw file. Teams register and download raw file.";
    case "submission":
      return "Teams upload and publish anonymous files. System calculates utility scores.";
    case "finished_submission":
      return "Competition finished. Teams can't upload anonymous files.";
    case "attack":
      return "Teams attack each other's submissions. System calculates attack/defense scores.";
    case "finished":
      return "Competition completed. Final scores calculated and results announced.";
    default:
      return "";
  }
};

const cardStyle = { background: "rgba(0,0,0,0.9)", border: "1px solid #fff5" };
const badgeStyle = { background: "rgba(0,0,0,0.9)", color: "#fff" };
const modalStyle = { background: "rgba(0,0,0,0.85)", border: "1px solid #fff5" };

const StatusPage: React.FC = () => {
  const {
    data: competitionStatus,
    isLoading,
    error,
    refetch,
  } = useCompetitionStatus();
  const { mutate: controlPhase, isPending: isControlling } = usePhaseControl();
  const { mutate: restartCompetition } = useRestartCompetition();
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<string>("");

  const hasActiveRawFile = !!competitionStatus?.data.activeRawFile;
  const hasMetrics = Array.isArray(competitionStatus?.data.metrics) && competitionStatus?.data.metrics.length > 0;
  const hasOneAggregation = Array.isArray(competitionStatus?.data.aggregations) && competitionStatus?.data.aggregations.length === 1;
  const canStartCompetition = hasActiveRawFile && hasMetrics && hasOneAggregation;

  const showConfirmation = (action: string) => {
    setPendingAction(action);
    setConfirmationModalOpen(true);
  };

  const handlePhaseControl = (action: string) => {
    if (action === "restart") {
      restartCompetition(undefined, {
        onSuccess: () => {
          refetch();
          setConfirmationModalOpen(false);
        },
      });
    } else {
      controlPhase(
        { action: action as any },
        {
          onSuccess: () => {
            refetch();
            setConfirmationModalOpen(false);
          },
        }
      );
    }
  };

  const handlePauseResume = () => {
    const action = competitionStatus?.data.isPaused ? "resume" : "pause";
    if (competitionStatus?.data.phase === "submission" || competitionStatus?.data.phase === "attack") {
      controlPhase({ action });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <Container size="lg" pt={100}>
          <Flex justify="center" align="center" style={{ height: "50vh" }}>
            <Loader size="lg" color="cyan" />
          </Flex>
        </Container>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <Container size="lg" pt={100}>
          <Alert
            icon={<IconAlertCircle size="1rem" />}
            title="Error"
            color="red"
            style={cardStyle}
          >
            Failed to load competition status. Please try again later.
          </Alert>
        </Container>
      </div>
    );
  }

  if (!competitionStatus) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <Container size="lg" pt={100}>
          <Alert
            icon={<IconAlertCircle size="1rem" />}
            title="No Data"
            color="yellow"
            style={cardStyle}
          >
            Competition not initialized yet.
          </Alert>
        </Container>
      </div>
    );
  }

  const aggregationLocked = competitionStatus.data.aggregationLocked ?? false;
  

  return (
    <div className="min-h-screen text-white">
      <Container size="lg" pt={100}>
        <Stack gap="xl">
          {/* Header */}
          <Group justify="space-between" align="flex-end">
            <Title order={2} fw={700} c="#ff8c00">
              Competition Control Center
            </Title>
            <Group gap="xs">
              <Tooltip label="Refresh data">
                <ActionIcon
                  variant="light"
                  color="cyan"
                  size="lg"
                  onClick={() => {
                    refetch();
                  }}
                >
                  <IconRefresh size="1rem" />
                </ActionIcon>
              </Tooltip>
              <Badge
                variant="outline"
                color="cyan"
                size="lg"
                style={badgeStyle}
              >
                ADMIN PANEL
              </Badge>
            </Group>
          </Group>

          {/* Current Phase Status */}
          <Card shadow="xl" padding="xl" radius="lg" style={cardStyle}>
            <Stack gap="lg">
              <Group justify="space-between" align="center">
                <Group gap="md">
                  <ThemeIcon
                    size="xl"
                    variant="light"
                    color={getPhaseColor(competitionStatus.data.phase)}
                  >
                    <IconSettings size="1.5rem" />
                  </ThemeIcon>
                  <div className="mr-4">
                    <Text size="sm" className="text-gray-400">
                      Current Phase
                    </Text>
                    <Text size="xl" fw={700} className="text-white">
                      {getPhaseDisplayName(competitionStatus.data.phase)}
                    </Text>
                  </div>
                  {competitionStatus.data.phase === "submission" ||
                  competitionStatus.data.phase === "attack" ? (
                    <Button
                      leftSection={
                        competitionStatus.data.isPaused ? (
                          <IconPlayerPlay size={16} />
                        ) : (
                          <IconPlayerPause size={16} />
                        )
                      }
                      color={competitionStatus.data.isPaused ? "green" : "red"}
                      onClick={handlePauseResume}
                      loading={isControlling}
                    >
                      {competitionStatus.data.isPaused
                        ? "Resume Phase"
                        : "Pause Phase"}
                    </Button>
                  ) : null}
                </Group>
                <Badge
                  size="xl"
                  variant="filled"
                  color={getPhaseColor(competitionStatus.data.phase)}
                  className="px-4 py-2"
                  style={badgeStyle}
                >
                  {getPhaseDisplayName(competitionStatus.data.phase)}
                </Badge>
              </Group>

              <Divider color="gray.7" />

              <div className="p-4 rounded-lg" style={cardStyle}>
                <Text size="sm" c="#fff">
                  {getPhaseDescription(competitionStatus.data.phase)}
                </Text>
              </div>

              <div className="p-4 rounded-lg" style={cardStyle}>
                <Group justify="space-between">
                  <Text size="sm" className="text-gray-400">
                    Settings Status:
                  </Text>
                  <Group gap="xs">
                    <Badge
                      variant="outline"
                      color={
                        competitionStatus.data.metricsLocked ? "red" : "green"
                      }
                      size="sm"
                      style={badgeStyle}
                    >
                      Metrics{" "}
                      {competitionStatus.data.metricsLocked
                        ? "LOCKED"
                        : "UNLOCKED"}
                    </Badge>
                    <Badge
                      variant="outline"
                      color={aggregationLocked ? "red" : "green"}
                      size="sm"
                      style={badgeStyle}
                    >
                      Aggregation {aggregationLocked ? "LOCKED" : "UNLOCKED"}
                    </Badge>
                  </Group>
                </Group>
              </div>
            </Stack>
          </Card>

          {/* Phase Controls */}
          <Card shadow="xl" padding="xl" radius="lg" style={cardStyle}>
            <Stack gap="lg">
              <Group justify="space-between">
                <Group gap="md">
                  <ThemeIcon variant="light" color="orange">
                    <IconSettings size="1.5rem" />
                  </ThemeIcon>
                  <Text size="xl" fw={600} className="text-orange-400">
                    Phase Controls
                  </Text>
                </Group>
              </Group>

              <Divider color="gray.7" />

              <Group gap="md" justify="center">
                {/* Setup Phase Controls */}
                {competitionStatus.data.phase === "setup" && (
                  <Tooltip
                    label={
                      !canStartCompetition
                        ? "Need to select: Raw file, at least 1 metrics, and exactly 1 aggregation"
                        : ""
                    }
                    disabled={canStartCompetition}
                    withArrow
                    color="red"
                  >
                    <div>
                      <Button
                        leftSection={<IconPlayerPlay size="1.2rem" />}
                        onClick={() => showConfirmation("start_submission")}
                        disabled={!canStartCompetition || isControlling}
                        color="cyan"
                        size="lg"
                        className="min-w-48"
                        style={!canStartCompetition ? { cursor: "not-allowed" } : {}}
                      >
                        Start Competition
                      </Button>
                    </div>
                  </Tooltip>
                )}

                
                {/* Submission Phase Controls */}
                {competitionStatus.data.phase === "submission" && (
                  <>
                    <Button
                      leftSection={<IconSwords size="1.2rem" />}
                      onClick={() => showConfirmation("end_submission")}
                      disabled={isControlling}
                      color="red"
                      size="lg"
                      className="min-w-48"
                    >
                      End Submission Phase
                    </Button>
                    <Button
                    leftSection={<IconFlag size="1.2rem" />}
                    onClick={() => showConfirmation("end")}
                    disabled={isControlling}
                    color="green"
                    size="lg"
                    className="min-w-32"
                  >
                    End Competition
                  </Button> 
                  </>
                )}

                {/* Finished Submission Phase Controls */}
                {competitionStatus.data.phase === "finished_submission" && (
                  <>
                  <Button
                    leftSection={<IconPlayerPlay size="1.2rem" />}
                    onClick={() => showConfirmation("start_attack")}
                    disabled={isControlling}
                    color="red"
                    size="lg"
                    className="min-w-48"
                  >
                    Start Attack Phase
                  </Button>
                  <Button
                    leftSection={<IconFlag size="1.2rem" />}
                    onClick={() => showConfirmation("end")}
                    disabled={isControlling}
                    color="green"
                    size="lg"
                    className="min-w-32"
                  >
                    End Competition
                  </Button>
                  </>
                )}

                {/* Attack Phase Controls */}
                {competitionStatus.data.phase === "attack" && (
                  <Button
                    leftSection={<IconFlag size="1.2rem" />}
                    onClick={() => showConfirmation("end")}
                    disabled={isControlling}
                    color="green"
                    size="lg"
                    className="min-w-32"
                  >
                    End Competition
                  </Button>
                )}

                {/* Finished Phase */}
                {competitionStatus.data.phase === "finished" && (
                  <>
                    <Alert
                      icon={<IconCheck size="1rem" />}
                      color="green"
                      variant="light"
                      style={cardStyle}
                    >
                      <Text className="text-green-400" fw={500}>
                        Competition has ended. Final results are being
                        calculated.
                      </Text>
                    </Alert>
                    <Button
                      leftSection={<IconPlayerPlay size="1.2rem" />}
                      onClick={() => showConfirmation("restart")}
                      color="orange"
                      size="lg"
                      className="min-w-48"
                    >
                      Restart Competition
                    </Button>
                  </>
                )}
              </Group>
            </Stack>
          </Card>

          {/* Competition Settings Summary */}
          <Card shadow="xl" padding="xl" radius="lg" style={cardStyle}>
            <Stack gap="lg">
              <Text size="xl" fw={600} className="text-orange-400">
                Current Configuration
              </Text>

              <Divider color="gray.7" />

              <Grid>
                <Grid.Col span={6}>
                  <div
                    className="p-4 rounded-lg"
                    style={{
                      ...cardStyle,
                      border: !hasMetrics ? "2px solid #ff4d4f" : cardStyle.border,
                      background: !hasMetrics ? "rgba(255,0,0,0.08)" : cardStyle.background,
                    }}
                  >
                    <Text fw={600} mb="sm" className={!hasMetrics ? "text-red-400" : "text-cyan-400"}>
                      Selected Metrics:
                    </Text>
                    {competitionStatus?.data?.metrics?.length > 0 ? (
                      competitionStatus.data.metrics.map(
                        (metric: any, index: number) => (
                          <Badge
                            key={index}
                            variant="outline"
                            color="cyan"
                            size="sm"
                            className="mr-2 mb-1"
                            style={badgeStyle}
                          >
                            {metric.name}
                          </Badge>
                        )
                      )
                    ) : (
                      <Text size="sm" className="text-gray-500">
                        No metrics selected
                      </Text>
                    )}
                  </div>
                </Grid.Col>

                <Grid.Col span={6}>
                  <div
                    className="p-4 rounded-lg"
                    style={{
                      ...cardStyle,
                      border: !hasOneAggregation ? "2px solid #ff4d4f" : cardStyle.border,
                      background: !hasOneAggregation ? "rgba(255,0,0,0.08)" : cardStyle.background,
                    }}
                  >
                    <Text fw={600} mb="sm" className={!hasOneAggregation ? "text-red-400" : "text-orange-400"}>
                      Selected Aggregations:
                    </Text>
                    {competitionStatus?.data?.aggregations?.length > 0 ? (
                      competitionStatus.data.aggregations.map(
                        (agg: any, index: number) => (
                          <Badge
                            key={index}
                            variant="outline"
                            color="orange"
                            size="sm"
                            className="mr-2 mb-1"
                            style={badgeStyle}
                          >
                            {agg.name}
                          </Badge>
                        )
                      )
                    ) : (
                      <Text size="sm" className="text-gray-500">
                        No aggregations selected
                      </Text>
                    )}
                  </div>
                </Grid.Col>
              </Grid>

              <div
                className="p-4 rounded-lg"
                style={{
                  ...cardStyle,
                  border: !hasActiveRawFile ? "2px solid #ff4d4f" : cardStyle.border,
                  background: !hasActiveRawFile ? "rgba(255,0,0,0.08)" : cardStyle.background,
                }}
              >
                <Group justify="space-between">
                  <Text fw={600} className={!hasActiveRawFile ? "text-red-400" : "text-green-400"}>
                    Active Raw File:
                  </Text>
                  <Text className={!hasActiveRawFile ? "text-red-400" : "text-white"}>
                    {competitionStatus.data.activeRawFile || "No file selected"}
                  </Text>
                </Group>
              </div>
            </Stack>
          </Card>
        </Stack>
      </Container>

      {/* Confirmation Modal */}
      <Modal
        opened={confirmationModalOpen}
        onClose={() => setConfirmationModalOpen(false)}
        title={`🚀 Confirm Phase Action`}
        c="#fff"
        size="md"
        styles={{ content: modalStyle, header: { background: "rgba(0,0,0,0.85)"} }}
      >
        <Stack gap="lg">
          <Alert
            icon={<IconInfoCircle size="1rem" />}
            color="orange"
            variant="light"
            style={cardStyle}
          >
            <Text c="#fff" size="sm" fw={500}>
              {pendingAction === "start_submission" &&
                "Are you sure you want to start the submission phase?"}
              {pendingAction === "end_submission" &&
                "Are you sure you want to end the submission phase?"}
              {pendingAction === "start_attack" &&
                "Are you sure you want to start the attack phase?"}
              {pendingAction === "end" &&
                "Are you sure you want to end the competition?"}
              {pendingAction === "restart" &&
                "Are you sure you want to restart the competition?"}
            </Text>
          </Alert>
          <Group justify="flex-end" gap="md">
            <Button
              variant="outline"
              color="gray"
              onClick={() => setConfirmationModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              color={
                pendingAction === "end"
                  ? "red"
                  : pendingAction === "restart"
                  ? "orange"
                  : "cyan"
              }
              onClick={() => handlePhaseControl(pendingAction)}
              loading={isControlling}
            >
              {pendingAction === "start_submission" && "Start Submission Phase"}
              {pendingAction === "end_submission" && "End Submission Phase"}
              {pendingAction === "start_attack" && "Start Attack Phase"}
              {pendingAction === "end" && "End Competition"}
              {pendingAction === "restart" && "Restart Competition"}
            </Button>
          </Group>
        </Stack>
      </Modal>
    </div>
  );
};

export default StatusPage;
