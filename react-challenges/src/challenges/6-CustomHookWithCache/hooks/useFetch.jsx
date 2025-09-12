// hooks/useFetch.js
import { useEffect, useState, useContext, createContext } from "react";

// ------------------------------
// Global Cache + In-flight store
// ------------------------------
const fetchCache = new Map(); // Stores { data, timestamp }
const inFlightRequests = new Map(); // Tracks ongoing fetches

// Cache TTL (Time To Live) in ms → after expiry, refetch happens
const CACHE_TTL = 30 * 1000;

// ------------------------------
// Global Cache Context (Phase 6)
// ------------------------------
const FetchCacheContext = createContext({
  fetchCache,
  inFlightRequests,
});

export const FetchCacheProvider = ({ children }) => {
  // Provider makes cache accessible across app (instead of per-hook)
  return (
    <FetchCacheContext.Provider value={{ fetchCache, inFlightRequests }}>
      {children}
    </FetchCacheContext.Provider>
  );
};

// ------------------------------
// Custom Hook (useFetch)
// ------------------------------
export function useFetch(url, { suspense = false, retries = 2 } = {}) {
  const { fetchCache, inFlightRequests } = useContext(FetchCacheContext);

  // Initialize state from cache if available
  const cached = fetchCache.get(url);
  const [data, setData] = useState(cached ? cached.data : null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(!cached);

  useEffect(() => {
    if (!url) return;

    let abortController = new AbortController();
    const cached = fetchCache.get(url);

    // ✅ If cached & still fresh
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      setData(cached.data);
      setLoading(false);

      // SWR: Trigger background refresh
      fetchFresh();
      return;
    }

    // ✅ Cache missing or expired → fetch fresh
    fetchFresh();

    // ------------------------------
    // Function to fetch (with retry)
    // ------------------------------
    function fetchFresh() {
      // Deduplicate if already fetching
      if (inFlightRequests.has(url)) {
        inFlightRequests.get(url)
          .then((res) => {
            if (!abortController.signal.aborted) {
              setData(fetchCache.get(url)?.data || res);
              setLoading(false);
            }
          })
          .catch((err) => {
            if (!abortController.signal.aborted) {
              setError(err.message || err);
              setLoading(false);
            }
          });
        return;
      }

      // New fetch (with retry logic)
      const fetchWithRetry = (attempt = 0) =>
        fetch(url, { signal: abortController.signal })
          .then((res) => {
            if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
            return res.json();
          })
          .then((json) => {
            // Save in cache
            fetchCache.set(url, { data: json, timestamp: Date.now() });
            setData(json);
            setLoading(false);
            return json;
          })
          .catch((err) => {
            // Retry for transient errors
            if (
              attempt < retries &&
              (err.name === "TypeError" || err.message.includes("500"))
            ) {
              console.warn(`Retrying fetch ${url}, attempt ${attempt + 1}`);
              return fetchWithRetry(attempt + 1);
            }

            // Final failure
            if (err.name === "AbortError") return;
            setError(err.message || err);
            setLoading(false);
            throw err;
          });

      // Track in-flight promise
      const fetchPromise = fetchWithRetry().finally(() =>
        inFlightRequests.delete(url)
      );

      inFlightRequests.set(url, fetchPromise);
    }

    // Cleanup (cancel on unmount)
    return () => {
      abortController.abort();
    };
  }, [url, retries, fetchCache, inFlightRequests]);

  // ------------------------------
  // Suspense Compatibility (Phase 7)
  // ------------------------------
  if (suspense) {
    if (loading) {
      // Throw the in-flight promise to let React Suspense catch it
      const inflight = inFlightRequests.get(url);
      if (inflight) throw inflight;
      throw new Promise(() => {}); // Fallback infinite promise
    }
    if (error) throw error; // Suspense error boundary handles this
  }

  // Debug logs (optional for interview demonstration)
  console.log("Cache: ", fetchCache);
  console.log("In-Flight Requests: ", inFlightRequests);

  return { data, error, loading };
}
