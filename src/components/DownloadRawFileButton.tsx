import { Button, Tooltip } from "@mantine/core";
import { IconDownload } from "@tabler/icons-react";
import { useDownloadRawFile } from "@/hooks/api/user/useDownloadRawFile";

interface DownloadRawFileButtonProps {
  className?: string;
}

export const DownloadRawFileButton = ({
  className,
}: DownloadRawFileButtonProps) => {
  const {
    mutate: handleDownload,
    isPending,
    hasActiveRawFile,
  } = useDownloadRawFile();

  const button = (
    <Button
      onClick={() => handleDownload()}
      loading={isPending}
      rightSection={<IconDownload size={14} />}
      variant="light"
      className={className}
      disabled={!hasActiveRawFile || isPending}
    >
      {isPending ? "Downloading..." : "DOWNLOAD RAW FILE"}
    </Button>
  );

  if (!hasActiveRawFile) {
    return (
      <Tooltip label="No active raw file available for download">
        <span>{button}</span>
      </Tooltip>
    );
  }

  return button;
};
