import { useEffect, useState } from "react";
import { requestHandler } from "../helpers/requestHandler";
import { useRequestStore } from "../store";
type Options = {
  url?: string;
  route: string;
  type: string;
  body?: any;
  credentials?: "same-origin" | "include" | "omit" | undefined;
  contentType?: string;
};
type CacheData = {
  id: string;
  data?: any;
};

type Error = {
  errors: any;
  type?: string;
};

const useFetchData = (
  options: Options,
  id: string,
  shouldPersist = false,
  shouldCache = true,
  cacheUpdateOptions: CacheData[] = [],
  timesToFetch = 1
) => {
  const [currentData, setCurrentData] = useState<any>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isFetching, setIsFetching] = useState(false);
  const [queriedCacheData, setQueriedCacheData] = useState<CacheData[]>([]);
  const [currentCacheData, setCurrentCacheData] = useRequestStore((state) => [state[id], state.setCurrentCacheData]);

  const getItem = async () => {
    let item = await localStorage.getItem(id);
    if (item && item !== undefined && item !== currentCacheData) {
      let parsed = await JSON.parse(item);
      setCurrentData(parsed);
      setCurrentCacheData(item, id);
    }
  };

  useEffect(() => {
    if (shouldPersist) {
      getItem();
    }
  }, [id]);

  const updateStorage = (refreshCurrentCache = false) => {
    try {
      cacheUpdateOptions.length &&
        cacheUpdateOptions.forEach((cache) => {
          localStorage.setItem(cache.id, JSON.stringify(cache.data));
        });
      // cache check is reset on bulk cache update
      if (refreshCurrentCache) getItem();
      setCurrentCacheData("", id);
    } catch (err) {
      setError({ type: "updateCache", errors: err });
      console.log(err);
    }
  };

  const removeItems = () => {
    try {
      cacheUpdateOptions.length &&
        cacheUpdateOptions.forEach((cache) => {
          localStorage.removeItem(cache.id);
        });
    } catch (err) {
      setError({ type: "removeItems", errors: err });
      console.log(err);
    }
  };

  const getStoredValues = () => {
    try {
      cacheUpdateOptions.length && setQueriedCacheData([]);
      cacheUpdateOptions.forEach(async (cache) => {
        const req: any = localStorage.getItem(cache.id);
        const data = await JSON.parse(req);
        if (data && data !== undefined) {
          setQueriedCacheData((prev) => [...prev, { id: cache.id, data: data }]);
        }
      });
    } catch (err) {
      setError({ type: "getCachedValues", errors: err });
      console.log(err);
    }
  };

  const fetchData = () => {
    let dataString: string;
    setIsFetching(true);
    for (let i = 0; i < timesToFetch; i++) {
      try {
        requestHandler(options).then((data) => {
          if (shouldCache) dataString = JSON.stringify(data);
          if (!data || data?.errors || data === undefined) {
            return setError(data?.errors ? data : { errors: "No data found" });
          } else {
            if (dataString !== currentCacheData && shouldCache) {
              // only re-render and cache if data has changed
              console.log("d", data);
              setCurrentData(data);
              setCurrentCacheData(dataString, id);

              if (shouldPersist) localStorage.setItem(id, dataString);
            } else if (!currentData?.length || !shouldCache) {
              setCurrentData(data);
            }
            setError(null);
          }
        });
      } catch (error) {
        setError(error);
      }
    }
    setIsFetching(false);
  };

  return {
    data: currentData,
    isFetching,
    error,
    fetchData,
    updateStorage,
    queriedCacheData,
    getStoredValues,
    refresh: getItem,
    removeItems,
  };
};

export default useFetchData;
