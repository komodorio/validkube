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
    },
  })
    .then((response) => response.json())
    .then((response) => {
      setResponse(response.data);
      setError(response.err);
    })
    .catch((error) => {
      setError(error);
    })
    .finally(() => {
      setFetching(false);
    });
};

const emptyInterface = {};
