import { useEffect, useState } from "react";
import { requestHandler } from "../helpers/requestHandler";
import { useRequestStore } from "../store";
// import UserContext from '../App';
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
  //For reference
  // const { currentCacheData, setCurrentCacheData } = React.useContext(UserContext);

  const getItem = async () => {
    let item = await localStorage.getItem(id);
    if (item && item !== currentCacheData) {
      let parsed = await JSON.parse(item);
      setCurrentData(parsed);
      setCurrentCacheData(item, id);
    }
  };

  useEffect(() => {
    if (shouldPersist) {
      getItem();
    } else if (currentCacheData) {
      setCurrentData(JSON.parse(currentCacheData));
    }
  }, [id]);

  // if storage = true func runs on local storage, else runs on in memory cache
  const updateStorage = (storage = true, refreshCurrentCache = false) => {
    try {
      cacheUpdateOptions.length &&
        cacheUpdateOptions.forEach((cache) => {
          storage
            ? localStorage.setItem(cache.id, JSON.stringify(cache.data))
            : setCurrentCacheData(cache.data, cache.id);
        });
      // cache check is reset on bulk cache update
      if (refreshCurrentCache) {
        storage ? getItem() : setCurrentData(JSON.parse(currentCacheData));
      }
      setCurrentCacheData("", id);
    } catch (err) {
      setError({ type: "updateCache", errors: err });
      console.log(err);
    }
  };

  const removeItems = (storage = true) => {
    try {
      cacheUpdateOptions.length &&
        cacheUpdateOptions.forEach((cache) => {
          storage ? localStorage.removeItem(cache.id) : setCurrentCacheData(null, cache.id);
        });
    } catch (err) {
      setError({ type: "removeItems", errors: err });
      console.log(err);
    }
  };

  const getStoredValues = (storage = true) => {
    try {
      cacheUpdateOptions.length && setQueriedCacheData([]);
      cacheUpdateOptions.forEach(async (cache) => {
        const req: any = storage ? localStorage.getItem(cache.id) : setCurrentCacheData(cache.data, cache.id);
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
            setIsFetching(false);
            return setError(data?.errors ? data : { errors: "No data found" });
          } else {
            //equality check between in memory cache and data from server
            if (dataString !== currentCacheData && shouldCache) {
              // only re-render and cache if data has changed
              setCurrentData(data);
              setCurrentCacheData(dataString, id);
              shouldPersist && localStorage.setItem(id, dataString);
            } else if (!currentData?.length || !shouldCache) {
              setCurrentData(data);
            }
            setError(null);
          }
          setIsFetching(false);
        });
      } catch (error) {
        setError(error);
      }
    }
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
