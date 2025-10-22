import { Toaster as SonnerToaster } from 'sonner';

export function Toaster() {
  return (
    <SonnerToaster
      position="top-center"
      richColors
      closeButton
      expand={true}
      duration={4000}
    />
  );
}

export { SonnerToaster };
