import { useEffect } from "react";
import { localStorageService } from "../services/localStorageService";

const useLocalStorageListener = (
  key: string,
  callback: (newValue: string | null, oldValue: string | null) => void,
  deps: any[] = []
) => {
  useEffect(() => {
    localStorageService.addListener(key, callback);

    return () => {
      localStorageService.removeListener(key, callback);
    };
  }, [key, callback, ...deps]);
};

export default useLocalStorageListener;
