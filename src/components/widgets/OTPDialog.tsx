import 'react-phone-number-input/style.css';

import { AlertDialog } from '../ui/alert-dialog';

export default function OTPDialog({
  open,
  setOpen,
  children,
}: {
  open?: boolean;
  setOpen?: (value: boolean) => void;
  children: React.ReactNode;
}) {
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      {children}
    </AlertDialog>
  );
}
