import { useUploadFile } from "@/hooks/api/admin/useUploadFile";
import {
  Box,
  Button,
  FileButton,
  Group,
  Text,
  Paper,
  Title,
} from "@mantine/core";
import { IconUpload } from "@tabler/icons-react";

export const UploadFile = () => {
  const { handleUpload, isUploading } = useUploadFile();

  const handleFileChange = async (file: File | null) => {
    if (file) {
      await handleUpload(file);
    }
  };

  return (
    <Paper shadow="sm" p="md" bg="#060606e6">
      <Title mb="md" size="xl" fw={500} c="#ff8c00">
        Deposit of data to be anonymized:
      </Title>
      <Box className="flex gap-x-4 ">
        <Group>
          <FileButton
            onChange={handleFileChange}
            accept=".zip,application/zip"
            disabled={isUploading}
          >
            {(props) => (
              <Button
                {...props}
                leftSection={<IconUpload size={16} />}
                loading={isUploading}
              >
                {isUploading ? "Uploading..." : "Upload ZIP File"}
              </Button>
            )}
          </FileButton>
        </Group>
        <Text size="sm" c="dimmed" mt="xs">
          Only ZIP files up to 50MB are allowed
        </Text>
      </Box>
    </Paper>
  );
};
