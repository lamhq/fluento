import { useUpdateServerData } from '../../hooks';

export default function DataMutationDemo() {
  const { mutateAsync, isPending } = useUpdateServerData();

  const handleClick = async () => {
    try {
      await mutateAsync();
    } catch (err) {
      console.error(err);
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
