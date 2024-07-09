import { useCallback, useState } from "react";

export const useMutation = () => {
  const [data, setData] = useState({
    data: null,
    isLoading: true,
    isError: false,
  });

  const mutate = useCallback(
    async ({ url = "", method = "POST", payload = {}, headers = {} } = {}) => {
      try {
        console.log("payload => ", JSON.stringify(payload));
        const response = await fetch(url, {
          method: method,
          headers: {
            "Content-Type": "application/json",
            ...headers,
          },
          ...(method !== "GET" && { body: JSON.stringify(payload) }),
        });
        const result = await response.json();
        console.log("result => ", result);
        setData({
          ...data,
          data: result,
          isLoading: false,
        });
        return { ...result };
      } catch (error) {
        setData({
          ...data,
          isError: true,
          isLoading: false,
        });

        return error;
      }
    },
    []
  );

  return { ...data, mutate };
};
