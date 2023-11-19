import { Meta, Story } from '@storybook/react';
import { ModalProps, ModalRenderingContext, useModal } from '../.';
import styled from 'styled-components';
import { useState } from 'react';

const ModalContent = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 500px;
  height: 300px;
  background-color: white;
  border: 1px solid black;
  transition:
    transform 0.3s ease-out,
    opacity 0.3s ease-out;
  opacity: 0;

  .modal-button-close {
    position: absolute;
    top: 20px;
    right: 0px;
  }

  .modal-button-confirm {
    position: absolute;
    top: 0px;
    right: 0px;
  }

  /* Opening animation */
  &.modal-open {
    transform: translate(-50%, -60%);
    opacity: 1;
  }

  /* Closing animation */
  &.modal-closing {
    transform: translate(-50%, -40%);
    opacity: 0;
  }
`;

type ModalComponentProps = ModalProps<string> & {
  initialValue?: string;
};

function ModalComponent({
  initialValue,
  onCancel,
  onConfirm,
  className,
}: ModalComponentProps) {
  // state for the input content
  const [inputValue, setInputValue] = useState(initialValue ?? '');

  return (
    <ModalContent className={className}>
      {/** Add an input and write that inputs value to a state */}
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />

      <button
        className="modal-button-confirm"
        onClick={() => onConfirm(inputValue)}
      >
        Confirm
      </button>
      <button className="modal-button-close" onClick={onCancel}>
        Close
      </button>
    </ModalContent>
  );
}

const MyComponent = () => {
  const showModal = useModal(ModalComponent, { closingTransitionMs: 300 });

  const runModal = async () => {
    const result = await showModal({ initialValue: 'Hello World' });
    if (!result) {
      return;
    }
    alert(result);
  };

  return (
    <>
      <button onClick={runModal}>Open Modal</button>
    </>
  );
};

const MyComponentWithContext = () => {
  return (
    <ModalRenderingContext>
      <MyComponent />
    </ModalRenderingContext>
  );
};

export default {
  title: 'MyComponent',
  component: MyComponentWithContext,
} as Meta;

const Template: Story = (args) => <MyComponentWithContext {...args} />;

export const Primary = Template.bind({});
Primary.args = {};
