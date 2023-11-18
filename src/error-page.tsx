import { isRouteErrorResponse, useRouteError } from "react-router-dom";

export default function ErrorPage() {
  const error = useRouteError();
  if (isRouteErrorResponse(error)) {
    return (
      <div
        id="error-page"
        className="flex flex-col items-center justify-center h-screen"
      >
        <h1 className="text-4xl font-bold mb-3">Oops! {error.status}</h1>
        <p className="mb-3">{error.statusText}</p>
        <p className="text-gray-400">
          The content you requested was:{" "}
          <i>{error.data.message}</i>
        </p>
      </div>
    );
  } else {
    return (
      <div
        id="error-page"
        className="flex flex-col items-center justify-center h-screen"
      >
        <h1 className="text-4xl font-bold mb-3">Oops!</h1>
        <p className="mb-3">Sorry, an unexpected error has occurred.</p>
      </div>
    )
  }
}
