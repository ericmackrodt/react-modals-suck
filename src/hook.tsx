import { ComponentType, createElement } from 'react';
import ReactDOM from 'react-dom';
import { useModalRenderingContext } from './context';
import { ExtractModalProps, ModalProps, ModalPropsType } from './types';

type UseModalSettings = {
  closingTransitionMs?: number;
};

export function useModal<TComponent extends ComponentType<ModalProps<unknown>>>(
  modalComponent: TComponent,
  { closingTransitionMs = 300 }: UseModalSettings = {},
): (
  props: Omit<ExtractModalProps<TComponent>, keyof ModalProps<unknown>>,
) => Promise<ModalPropsType<TComponent> | undefined> {
  const { containerRef } = useModalRenderingContext();

  const showModal = (
    props: Omit<ExtractModalProps<TComponent>, keyof ModalProps<unknown>>,
  ): Promise<ModalPropsType<TComponent> | undefined> => {
    return new Promise<ModalPropsType<TComponent> | undefined>((resolve) => {
      if (!containerRef.current) {
        throw new Error('The modal container does not exist');
      }

      const renderModal = (props: ExtractModalProps<TComponent>) => {
        ReactDOM.render(createElement(modalComponent, props), modalElement);
      };

      const modalElement = document.createElement('div');
      modalElement.className = 'modal-open'; // Start the opening animation
      containerRef.current.appendChild(modalElement);

      const onConfirm = (value: ModalPropsType<TComponent>) => {
        hideModal(() => resolve(value));
      };

      const onCancel = () => {
        hideModal(() => resolve(undefined));
      };

      let modalProps = {
        ...(props as object),
        onConfirm,
        onCancel,
        className: '', // Start with the 'modal-open' class
      } as ExtractModalProps<TComponent>;

      // Ensure that completeProps includes React Attributes
      renderModal(modalProps);

      // Use requestAnimationFrame to defer adding the 'modal-open' class
      requestAnimationFrame(() => {
        // Use requestAnimationFrame again to defer adding the 'modal-open' class
        // This is necessary to ensure that the opening animation is triggered
        requestAnimationFrame(() => {
          modalProps = {
            ...modalProps,
            className: 'modal-open', // Now add the 'modal-open' class to trigger the opening animation
          };

          renderModal(modalProps);
        });
      });

      function hideModal(callback: () => void) {
        modalProps = {
          ...modalProps,
          className: 'modal-closing',
        };

        renderModal(modalProps);

        const remove = () => {
          ReactDOM.unmountComponentAtNode(modalElement);
          modalElement.remove();
          callback();
        };

        // Use a timeout to delay unmounting the modal until the closing animation is complete.
        // The duration should match the CSS animation duration.
        if ((closingTransitionMs ?? 0) > 0) {
          setTimeout(remove, closingTransitionMs);
          return;
        }

        remove();
      }
    });
  };

  return showModal;
}
