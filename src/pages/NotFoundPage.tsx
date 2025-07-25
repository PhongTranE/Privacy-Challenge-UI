import { LINKS } from "@/constants/links";
import { useAuthStore } from "@/stores/authStore";
import { Button } from "@mantine/core";
import { IconLogout2 } from "@tabler/icons-react";
import { Link, useNavigate } from "react-router-dom";

const NotFoundPage = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(-1);
  };
  return (
    <main className="grid h-screen place-content-center px-4 text-center space-y-4">
      <h1 className="text-base-content tracking-widest uppercase text-2xl">
        404 | Page Not Found
      </h1>

      {isAuthenticated ? (
        <Button
          onClick={handleClick}
          radius="md"
          variant="outline"
          color="blue"
          leftSection={<IconLogout2 size={16} />}
        >
          Return
        </Button>
      ) : (
        <Button
          component={Link}
          to={LINKS.LOGIN}
          radius="md"
          variant="light"
          color="gray"
          leftSection={<IconLogout2 size={16} />}
        >
          Return to Login
        </Button>
      )}
    </main>
  );
};

export default NotFoundPage;
