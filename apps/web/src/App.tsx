import { Outlet, useNavigation } from 'react-router';

import TopLoadingBar from './common/components/TopLoadingBar';

export default function App() {
  const navigation = useNavigation();
  const isNavigating = Boolean(navigation.location);

  return (
    <>
      <TopLoadingBar open={isNavigating} />
      <Outlet />
    </>
  );
}
