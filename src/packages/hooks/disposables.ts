import { onScopeDispose } from "vue";

export const useDisposables = () => {
  const disposables = new Set<() => void>();

  const dispose = () => {
    disposables.forEach(disposable => disposable());
    disposables.clear();
  };

  const addDisposable = (disposable: () => void) => {
    disposables.add(disposable);
    return () => disposables.delete(disposable);
  };

  onScopeDispose(dispose);

  return { addDisposable, dispose };
};
