type Request = {
  /** Channel id */
  id: string;
  resourceId: string;
  /** User or service account auth token */
  authToken: string;
};

export async function stop(request: Request) {
  const url = new URL("https://www.googleapis.com/calendar/v3/channels/stop");

  const response = await fetch(url, {
    method: "POST",
    headers: new Headers({
      Authorization: `Bearer ${request.authToken}`,
      "Content-Type": "application/json",
    }),
    body: JSON.stringify({
      id: request.id,
      resourceId: request.resourceId,
    }),
  });

  if (response.ok) {
    // mark channel as stopped (maybe delete from DB?)
    // todo
    return;
  }

  throw new Error(`Failed to stop watching channel ${request.id}`);
}
