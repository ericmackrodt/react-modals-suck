import { ComponentType } from 'react';

export type ModalProps<TValue> = {
  className?: string;
  onConfirm: (value: TValue) => void;
  onCancel: () => void;
};

// Extract TValue from a component where the signature is ComponentType<ModalProps<TValue>>
export type ModalPropsType<T> = T extends ComponentType<
  ModalProps<infer TValue>
>
  ? TValue
  : unknown;

// Extract the props from a ComponentType<???> where ??? extends ModalProps<???>
export type ExtractModalProps<TComp> = TComp extends ComponentType<infer TProps>
  ? TProps extends ModalProps<unknown>
    ? TProps
    : ModalProps<unknown>
  : ModalProps<unknown>;
