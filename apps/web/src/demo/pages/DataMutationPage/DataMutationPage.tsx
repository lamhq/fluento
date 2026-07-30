import { useErrorHandler } from '../../../error';
import { useUpdateServerData } from '../../../hooks';

export default function DataMutationPage() {
  const { mutateAsync, isPending } = useUpdateServerData();
  const handleError = useErrorHandler();
  const handleClick = async () => {
    try {
      await mutateAsync();
    } catch (err) {
      await handleError(err);
    }
  };

  return (
    <div>
      <h3>Data Mutation Demo</h3>
      <button type="submit" disabled={isPending} onClick={handleClick}>
        {isPending ? 'Updating...' : 'Update'}
      </button>
    </div>
  );
}
