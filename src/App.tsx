import { lazy, Suspense } from 'react';

import { Loader } from './components/loader/Loader';

const Paint = lazy(() =>
  import('./components/paint/Paint').then((module) => ({
    default: module.Paint,
  }))
);

function App() {
  return (
    <div className='flex bg-neutral-50 min-h-dvh'>
      <Suspense fallback={<Loader />}>
        <Paint />
      </Suspense>
    </div>
  );
}

export default App;
