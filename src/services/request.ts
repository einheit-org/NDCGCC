type CustomRequestInit = Omit<RequestInit, "body"> & {
  /**
   * @description
   * Allow user to pass JSON data to the body & we will automatically
   * JSON.stringify it before sending to the server
   */
  body?: any;
};

/**
 * @description
 * `fetch` based API client, with more robust error handling.
 *
 * Implementation inspiration: https://kentcdodds.com/blog/replace-axios-with-a-simple-custom-fetch-wrapper
 * Typescript example: https://stackoverflow.com/questions/41103360/how-to-use-fetch-in-typescript/49471725#49471725
 * Github source: https://github.com/cliffordfajardo/react-query-with-react-router-loader
 *
 * @example
 * const example1 = await client<put_type_shape_here>('/some_endpoint')
 * const example2 = await client<Donors[]>('/donorstats')
 */
export const request = async <T>(
  endpoint: string,
  customConfig: CustomRequestInit = {}
): Promise<T> => {
  const headers = {
    "content-type": "application/json",
  };

  const method = customConfig.method || "POST";

  const config: RequestInit = {
    method,
    ...customConfig,
    headers: {
      ...headers,
      ...customConfig.headers,
    },
  };

  if (customConfig.body) {
    config.body = JSON.stringify(customConfig.body);
  }

  const response = await window.fetch(endpoint, config).catch((err) => {
    return Promise.reject(new Error(err));
  });

  if (response.ok) {
    const contentLength = response.headers.get('Content-Length')
    if (contentLength !== null && parseInt(contentLength) === 0) {
      return null as T
    }
    const body = await response.json();
    return body as T;
  } else {
    const errorMessage = await response.text();

    return Promise.reject(new Error(errorMessage));
  }
};
