import { useState } from "react";
import { Record } from "runtypes";

const BACKEND_GETWAY_URL = process.env.REACT_APP_API;

export const callAPIExample = (
  endpoint: string,
  setResult: React.Dispatch<React.SetStateAction<any>>
) => {
  fetch(`${BACKEND_GETWAY_URL}/${endpoint}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((response) => {
      setResult(response.msg);
    });
};

export const callAPI = (
  endpoint: string,
  data: typeof emptyInterface,
  setResponse: React.Dispatch<React.SetStateAction<any>>,
  setFetching: React.Dispatch<React.SetStateAction<boolean>>,
  setError: React.Dispatch<React.SetStateAction<any>>
) => {
  setFetching(true);
  setError(null);
  fetch(`${BACKEND_GETWAY_URL}/${endpoint}`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "Access-Control-Allow-Headers": "Content-Type"
    },
  })
    .then((response) => {
      if (!(response.status >= 200 && response.status <= 299)) {
        response.text().then(txt => {
          setError(txt);
          return txt;
        })
      }
      return response
    })
    .then((response) => response.text())
    .then((response) => {
      setResponse(response);
    })
    .catch((error) => {
      setError(error);
    })
    .finally(() => {
      setFetching(false);
    });
};
const emptyInterface = {};
const Response = Record({
  data: Record({}),
});

type ResponseType = typeof Response;

export const useCallAPIHook = (
  endpoint: string,
  data: typeof emptyInterface
): [
    respone: ResponseType | undefined,
    fetching: boolean,
    error: any | null
  ] => {
  const [response, setResponse] = useState<ResponseType>();
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState(null);
  fetch(`${BACKEND_GETWAY_URL}/${endpoint}`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((response) => {
      setResponse(response.data);
      setFetching(false);
    })
    .catch((e) => {
      setError(e);
    });
  return [response, fetching, error];
};
