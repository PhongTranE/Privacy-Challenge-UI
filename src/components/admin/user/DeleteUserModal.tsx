import React from "react";
import { Modal, Button, Text } from "@mantine/core";

interface DeleteUserModalProps {
  opened: boolean;
  onClose: () => void;
  user: { id: number; username: string } | null;
  onConfirm: () => void;
  loading?: boolean;
}

export const DeleteUserModal: React.FC<DeleteUserModalProps> = ({
  opened,
  onClose,
  user,
  onConfirm,
  loading,
}) => {
  return (
    <Modal 
      opened={opened} 
      onClose={onClose} 
      title="Delete User?" 
      centered
      classNames={{
        title: "text-xl font-bold text-orange-500",
        content: "bg-gray-800/90 backdrop-blur-sm border border-orange-500/30",
        header: "bg-gray-800/90 border-b border-orange-500/30",
        body: "text-gray-200",
      }}
    >
      <div className="space-y-6">
        <Text className="text-gray-200">
          Are you sure you want to delete user <span className="font-bold text-orange-500">{user?.username}</span>? This action cannot be undone.
        </Text>
        <div className="flex justify-end gap-3">
          <Button 
            variant="default" 
            onClick={onClose} 
            disabled={loading}
            className="bg-gray-700 hover:bg-gray-600 text-gray-200"
          >
            Cancel
          </Button>
          <Button 
            color="red" 
            loading={loading} 
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700"
          >
            Delete User
          </Button>
        </div>
      </div>
    </Modal>
  );
}; 