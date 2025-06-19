import { Center, Paper } from "@mantine/core";
import { Outlet } from "react-router-dom";
import { IconMail } from "@tabler/icons-react";
import "@/styles/EmailActionLayout.scss";

export default function EmailActionLayout() {
  const handleIconClick = () => {
    window.open('http://localhost:8025/', '_blank');
  };

  return (
    <main className="flex h-screen flex-col items-center justify-center">
      <section className="email-section">
        <Paper
          className="email-modal"
          radius="md"
          shadow="sm"
          p="xl"
          w="100%"
          maw={400}
        >
          <Center mb="md">
            <IconMail 
              size={64} 
              color="blue" 
              stroke={1.5} 
              className="cursor-pointer hover:scale-110 transition-transform duration-200"
              onClick={handleIconClick}
              style={{ cursor: 'pointer' }}
            />
          </Center>
          <Outlet />
        </Paper>
      </section>
    </main>
  );
}
