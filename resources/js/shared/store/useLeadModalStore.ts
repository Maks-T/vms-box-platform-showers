import { create } from 'zustand';

export interface ModalProps {
  formCode?: string;
  title?: string;
  description?: string;
  buttonLabel?: string;
  hiddenData?: Record<string, any>;
  onSuccess?: (data?: any) => void;
}

interface LeadModalState {
  isOpen: boolean;
  modalProps: ModalProps;
  openModal: (params?: string | ModalProps, hiddenData?: Record<string, any>) => void;
  closeModal: () => void;
}

export const useLeadModalStore = create<LeadModalState>((set) => ({
  isOpen: false,
  modalProps: {},

  openModal: (params, hiddenData = {}) => {
    const props: ModalProps =
      typeof params === 'string'
        ? { formCode: params, hiddenData }
        : params || {};

    set({
      isOpen: true,
      modalProps: props,
    });
  },

  closeModal: () =>
    set({
      isOpen: false,
      modalProps: {},
    }),
}));