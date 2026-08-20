"use client";

import { useMediaQuery } from "@/app/hooks/useMediaQuery";
import Modal from "../../modal/Modal";
import TaskDetailsForMobile from "./TaskDetailsForMobile";
import TaskDetailsPopup from "./TaskDetailsPopup";

type TaskDetailsModalProps = {
  taskId: string;
  isOpen: boolean;
  onClose: () => void;
};

export default function TaskDetailsModal({
  taskId,
  isOpen,
  onClose,
}: TaskDetailsModalProps) {
  const isMobile = useMediaQuery("(max-width: 767px)");

  if (!isOpen) {
    return null;
  }

  if (isMobile) {
    return (
      <TaskDetailsForMobile taskId={taskId} isOpen={isOpen} onClose={onClose} />
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} width="896px">
      <TaskDetailsPopup taskId={taskId} onClose={onClose} />
    </Modal>
  );
}
