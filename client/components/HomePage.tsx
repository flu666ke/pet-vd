import { observer } from 'mobx-react-lite';
import { useUserStore } from '../providers/RootStoreProvider';

export const HomePage = observer(function HomePage() {
  const store = useUserStore();

  return (
    <>
      <h1>Welcome bla-bla-bla</h1>
      {store.user && <h2>User name: `${store.user.firstName} ${store.user.lastName}`</h2>}
    </>
  )
})
