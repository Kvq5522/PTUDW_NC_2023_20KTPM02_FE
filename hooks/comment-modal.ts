import { create } from "zustand";

interface CommentModalState {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export const useCommentModal = create<CommentModalState>((set) => ({
  isOpen: false,
  onOpen: () => set(() => ({ isOpen: true })),
  onClose: () => set(() => ({ isOpen: false })),
}));