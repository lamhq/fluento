import { toast } from '@/components/ui/toast';

export function showErrorToast(message: string, title = 'Something went wrong') {
  toast.add({
    type: 'error',
    title,
    description: message,
  });
}
