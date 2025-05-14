import { LINKS } from "@/constants/links";
import { useAuthStore } from "@/stores/authStore";
import "@/styles/Pages/Protected/ProfilePage.scss";
import { Badge, Box, Button, Table, Text, Title } from "@mantine/core";
import { useNavigate } from "react-router-dom";

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, unauthenticate } = useAuthStore();
  return (
    <>
      <main className="flex h-screen flex-col items-center justify-center gap-y-4">
        <section className="profile-section">
          <Box className="profile-content">
            <Title
              order={2}
              style={{ color: "rgb(255, 140, 0)", marginBottom: "1rem" }}
            >
              Profile
            </Title>

            <Table variant="vertical" withTableBorder verticalSpacing="sm">
              <Table.Tbody>
                <Table.Tr>
                  <Table.Th>
                    <Text c="gray.4">Username</Text>
                  </Table.Th>
                  <Table.Td>
                    <Text fw={500} c="white">
                      {user?.username}
                    </Text>
                  </Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Th>
                    <Text c="gray.4">User ID</Text>
                  </Table.Th>
                  <Table.Td>
                    <Text c="white">{user?.id}</Text>
                  </Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Th>
                    <Text c="gray.4">Team</Text>
                  </Table.Th>
                  <Table.Td>
                    <Text c="blue">{user?.group_id}</Text>
                  </Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Th>
                    <Text c="gray.4">Role</Text>
                  </Table.Th>
                  <Table.Td>
                    {user?.roles[0].name === "Administrator" ? (
                      <Badge color="red" variant="filled">
                        Administrator
                      </Badge>
                    ) : (
                      <Badge color="blue" variant="filled">
                        User
                      </Badge>
                    )}
                  </Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Th>
                    <Text c="gray.4">Password</Text>
                  </Table.Th>
                  <Table.Td>
                    <Button
                      size="xs"
                      variant="light"
                      color="blue"
                      onClick={() => navigate(LINKS.CHANGE_PASSWORD)}
                    >
                      Change Password
                    </Button>
                  </Table.Td>
                </Table.Tr>
              </Table.Tbody>
            </Table>

            <Text size="xs" c="gray.5" mt="md">
              Last updated: {new Date().toLocaleString()}
            </Text>

            <Button
              mt="md"
              variant="filled"
              color="red"
              onClick={unauthenticate}
            >
              Logout
            </Button>
          </Box>
        </section>
      </main>
    </>
  );
};

export default ProfilePage;
