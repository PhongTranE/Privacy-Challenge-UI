import GroupManage from "@/components/admin/group/GroupManage";
import InviteKeyList from "@/components/admin/InviteKeyList";
import { UploadFile } from "@/components/admin/UploadFile";
import UserManage from "@/components/admin/user/UserManage";
import { Container, Space, Title } from "@mantine/core";

const DashboardPage: React.FC = () => {
  return (
    <>
      <Container size="lg" className="pt-30" c="white">
        <Title order={2} fw={700} c="#ff8c00">
          Welcome to Management Interface!
        </Title>
        <Space h="lg" />
        <section className="invite-key bg-[#060606e6] p-5 mb-8 rounded-md w-full max-w-6xl h-[70vh] max-h-screen overflow-y-auto border border-gray-400 mx-auto ">
          <InviteKeyList />
        </section>
        <section className="file-upload bg-[#060606e6] p-5 mb-8 rounded-md w-full max-w-6xl border border-gray-400 mx-auto">
          <UploadFile />
        </section>
        <section className="user-manage min-h-[60vh] bg-[#060606e6] p-5 mb-8 rounded-md w-full max-w-6xl border border-gray-400 mx-auto">
          <UserManage />
        </section>
        <section className="group-manage bg-[#060606e6] p-5 rounded-md w-full max-w-6xl border border-gray-400 mx-auto">
          <GroupManage />
        </section>
      </Container>
    </>
  );
};

export default DashboardPage;
