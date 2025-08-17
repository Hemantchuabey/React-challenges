import React, { useCallback, useRef, useState } from "react";
function useDebounce(fn, delay) {
  const timer = useRef(null);
  return useCallback(
    (...args) => {
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => {
        fn(...args);
      }, delay);
    },
    [fn, delay]
  );
}
function useThrottle(fn, interval) {
  const lastTimeInterval = useRef(0);
  return useCallback(
    (...args) => {
      const now = Date.now();
      if (now - lastTimeInterval.current >= interval) {
        fn(...args);
        lastTimeInterval.current = now;
      }
    },
    [fn, interval]
  );
}
export default function DebounceAndThrottle() {
  // const [query, setQuery] = useState("");
  const [valueDebounced, setValueDebounced] = useState("");
  const [valueThrottled, setValueThrottled] = useState("");
  const handleDebounceSearch = (value) => {
    setValueDebounced(value);
    console.log("API call with :", value);
  };
  const handleThrottleSearch = (value) => {
    setValueThrottled(value);
    console.log("API call with :", value);
  };
  const debouncedSearch = useDebounce(handleDebounceSearch, 500);
  const throttleSearch = useThrottle(handleThrottleSearch, 500);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <div
        style={{
          border: "1px solid #DDD",
          padding: "1rem",
          display: "flex",
          gap: "1rem",
        }}
      >
        <input
          type="text"
          name="debouncedInp"
          id="debouncedInp"
          placeholder="Search with Debounce Input"
          onChange={(e) => debouncedSearch(e.target.value)}
        />
        {valueDebounced && (
          <h2>API call with (Debouncing): {valueDebounced}</h2>
        )}
      </div>
      <div
        style={{
          border: "1px solid #ddd",
          padding: "1rem",
          display: "flex",
          gap: "1rem",
        }}
      >
        <input
          type="text"
          name="throttleInp"
          id="throttleInp"
          placeholder="Search with throttleInp Input"
          onChange={(e) => throttleSearch(e.target.value)}
        />
        {valueThrottled && (
          <h2>API call with (Throttling): {valueThrottled}</h2>
        )}
      </div>
    </div>
  );
}
