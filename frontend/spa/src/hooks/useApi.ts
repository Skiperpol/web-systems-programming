import { useState, useEffect, useCallback, type DependencyList } from 'react';
import { Observable, Subscription } from 'rxjs';

type ApiObservableFunction<TData> = (...args: unknown[]) => Observable<TData>;

export function useApi<TData, TError = Error>(
  apiObservableFunction: ApiObservableFunction<TData>,
  dependencies: DependencyList = [],
  executeOnMount: boolean = true
) {
  const [data, setData] = useState<TData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<TError | null>(null);

  const execute = useCallback((...args: unknown[]) => {
    let observable$: Observable<TData>;
    try {
      observable$ = apiObservableFunction(...args);
    } catch (e) {
      setError(e as TError);
      setLoading(false);
      return; 
    }

    if (!observable$ || typeof observable$.subscribe !== 'function') {
      console.error('useApi: Funkcja musi zwracać RxJS Observable.');
      setLoading(false);
      return;
    }
    
    setLoading(true);
    setError(null);
    
    const subscription: Subscription = observable$.subscribe({
      next: (result) => {
        setData(result);
        setLoading(false);
      },
      error: (err) => {
        setError(err as TError);
        setLoading(false);
        setData(null);
      },
      complete: () => {
        setLoading(false);
      }
    });

    return subscription;
  }, [apiObservableFunction]);

  useEffect(() => {
    let subscription: Subscription | undefined;
    
    if (executeOnMount) {
      subscription = execute();
    }

    return () => {
      if (subscription && !subscription.closed) {
        subscription.unsubscribe();
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [execute, ...dependencies, executeOnMount]); 

  return { data, loading, error, execute };
}