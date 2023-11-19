import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useRef,
} from 'react';
import { unmountComponentAtNode } from 'react-dom';

type ModalContextType = {
  containerRef: React.RefObject<HTMLDivElement>;
};

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export type ModalRenderingContextProps = PropsWithChildren;

export function useModalRenderingContext(): ModalContextType {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error(
      'useModalRenderingContext must be used within a ModalRenderingContext',
    );
  }
  return context;
}

export function ModalRenderingContext({
  children,
}: ModalRenderingContextProps): JSX.Element {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    return () => {
      if (containerRef.current) {
        unmountComponentAtNode(containerRef.current);
      }
    };
  }, []);

  return (
    <ModalContext.Provider value={{ containerRef }}>
      {children}
      <div ref={containerRef}></div>
    </ModalContext.Provider>
  );
}
