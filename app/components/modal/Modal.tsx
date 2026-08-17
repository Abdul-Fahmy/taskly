"use client";

import { ReactNode } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  width?: string
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  width,
}: ModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/10"
      onClick={onClose}
    >
      <div
      style={{ maxWidth: width }}
        className={`w-full  rounded-lg bg-white p-6 shadow-lg`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">{title}</h2>
        </div>

        {children}
      </div>
    </div>
  );
}
