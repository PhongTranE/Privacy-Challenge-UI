import {
    Modal,
    Text,
    Button,
    Stack,
    Flex,
    Loader,
  } from "@mantine/core";
  import { useRemoveGroupMemberModalStore, useDetailGroupModalStore } from "@/stores/admin/groupManageStore";
  import { useRemoveGroupMember } from "@/hooks/api/admin/useGroupManage";
  import { useFetchGroupDetailFull } from "@/hooks/api/admin/useGroupManage";
  
  export const DeleteGroupMemberModal = () => {
    const { modalOpen, memberToRemove, closeModal } = useRemoveGroupMemberModalStore();
    const { groupToDetail } = useDetailGroupModalStore();
    const { data: groupDetailFull, isLoading } = useFetchGroupDetailFull(groupToDetail?.id || 0);
  
    const { mutate: removeMember, isPending: isRemoving } = useRemoveGroupMember();
  
    const handleRemove = () => {
      if (!memberToRemove || !groupToDetail) return;
      removeMember({ groupId: groupToDetail.id, userId: memberToRemove.id });
    };
  
    const isLastMember = groupDetailFull?.group?.memberCount === 1;
  
    return (
      <Modal
        opened={modalOpen}
        onClose={closeModal}
        title={<Text fw={700}>Confirm Remove</Text>}
        centered
      >
        {isLoading ? (
          <Flex justify="center">
            <Loader />
          </Flex>
        ) : (
          <Stack>
            <Text c="red" fw={600}>
              {isLastMember ? (
                <>
                  ⚠️ This is the only member of the group. Deleting this user will also delete the group and all related files!
                </>
              ) : (
                <>Are you sure you want to remove <strong>{memberToRemove?.username}</strong> from the group?</>
              )}
            </Text>
  
            <Flex justify="end" gap="sm">
              <Button variant="default" onClick={closeModal} disabled={isRemoving}>
                Cancel
              </Button>
              <Button color="red" onClick={handleRemove} loading={isRemoving}>
                Confirm Remove
              </Button>
            </Flex>
          </Stack>
        )}
      </Modal>
    );
  };
  