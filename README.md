# React Modals Suck

`react-modals-suck` is a React library that offers a new approach to creating and managing modals without breaking your code flow and preventing you from having to go back and forth to understand your code flow. This library streamlines the modal handling process, enhances code readability, and simplifies state management.

This way your Modals and Dialogs will work more like ones from other platforms and the `alert` and `confirm` functions in javascript.

## Table of Contents

- [Installation](#installation)
- [Problem with Traditional React Modals](#problem-with-traditional-react-modals)
- [Usage with `react-modals-suck`](#usage-with-react-modals-suck)
- [Example](#example)
- [Contributing](#contributing)
- [License](#license)

## Installation

```bash
npm install react-modals-suck
```

## Problem with Traditional React Modals

### Traditional Approach

Let's start with a code example:

#### Example:

```javascript
import React, { useState } from 'react';

function TraditionalModal({ isOpen, onClose, onConfirm }) {
  const [inputValue, setInputValue] = useState('');

  return isOpen ? (
    <div className="modal">
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <button onClick={() => onConfirm(inputValue)}>Confirm</button>
      <button onClick={onClose}>Close</button>
    </div>
  ) : null;
}

function ParentComponent() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState('');

  const handleConfirm = (data) => {
    setModalData(data);
    setModalOpen(false);
  };

  return (
    <>
      <button onClick={() => setModalOpen(true)}>Open Modal</button>
      <TraditionalModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleConfirm}
      />
    </>
  );
}
```

As you can see, traditionally, modals in React are handled by maintaining their state in a parent component which indicates if the modal is open or not, to open the modal you have to set the state to true and the opposite to close it.

You usually have a function that is called by an event that sets that variable to true to open the modal.

Then when the user confirms the modal, you usually have to call a function that will handle the data, maybe putting that data in another state, and close the modal.

Then you'll have another function for when the user cancels the modal so the state is set to false.

This is bad because of ...

1. **Boilerplate**: Excessive boilerplate code for simple modal operations.
2. **State Management**: Dependency on state from the parents that add more code and complexity to the parent component.
3. **Readability**: Reduced readability due having to go back and forth to find where the modal is being opened, then find out where it's being closed and where the code path for confirmation is. You don't have a straight flow that is easy to follow.

## Usage with `react-modals-suck`

`react-modals-suck` provides a solution that allows you to call a modal from an event function and wait for a promise with its result without having to create other functions to handle each path and without having to have state management for the modal in the parent component.

### Features

- **Simplified State Management**: You do not have to worry about having a model state in the parent component.
- **Improved Readability**: You just need to worry about a linear code flow without having to go to different functions to see what the outcomes do.
- **Customizable**: Easy to style and animate with CSS-in-JS libraries like styled-components.
- **Data Handling**: You get the data straight out of the response from the modal in the same code flow.

## Example

### Implementing a Modal

First, create your modal component:

```javascript
import { Meta, Story } from '@storybook/react';
import { ModalProps, ModalRenderingContext, useModal } from 'react-modals-suck';
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

// The modal component props need to extend `ModalProps` as that's
// the interface the library uses, you must pass the type of the
// modal response to the type
type ModalComponentProps = ModalProps<string> & {
  // You can have other data passed to the modal
  initialValue?: string
}

function ModalComponent({
  initialValue,
  onCancel,
  onConfirm,
  className,
}: ModalComponentsProp) {
  const [inputValue, setInputValue] = useState(initialValue ?? '');

  return (
    <ModalContent className={className}>
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

const MyParentComponent = () => {
  // This hook will return a function to open the modal that waits for its result
  const showModal = useModal(ModalComponent, {
    // If you want to animate your modal, you can
    // optionally pass this property so the modal
    // waits for your animation before it's
    // destroyed
    closingTransitionMs: 300
  });

  const runModal = async () => {
    // You can now call the function to show open the modal,
    // if you setup props to the modal, you can pass them here.
    const result = await showModal({ initialValue: "hello" });
    // If the result is undefined, then the user canceled,
    // nothing to do here
    if (!result) return;

    // If there's a result handle data
    console.log(result);
  };

  return (
    <>
      <button onClick={runModal}>Open Modal</button>
    </>
  );
};

const MyComponentWithContext = () => (
  // This context should be around your application
  // as it ads a div where the modal will be instantiated
  // outside of the calling component
  <ModalRenderingContext>
    <MyComponent />
  </ModalRenderingContext>
);
```

As you can see, this is a much simpler flow that allows you to just wait for the user answer within the calling function, just like the javascript `confirm` function.

## Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

## License

?!?!? I have to look into this.
