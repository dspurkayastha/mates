export async function reportErrorToRemote(
  err: unknown,
  extra?: Record<string, any>,
): Promise<void> {
  const url = process.env.EXPO_PUBLIC_LOG_INGEST_URL;
  const apiKey = process.env.EXPO_PUBLIC_LOG_API_KEY;
  const groupId = process.env.EXPO_PUBLIC_PROJECT_GROUP_ID;

  if (!url || !apiKey || !groupId) {
    if (__DEV__) {
      console.debug('reportErrorToRemote disabled (missing env)', {
        hasUrl: !!url,
        hasKey: !!apiKey,
        hasGroupId: !!groupId,
      });
    }
    return;
  }

  let error: any;
  if (err instanceof Error) {
    const { name, message, stack } = err;
    error = { name, message, stack };
  } else {
    try {
      error = JSON.parse(JSON.stringify(err));
    } catch {
      error = String(err);
    }
  }

  try {
    await fetch(url, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        groupId,
        error,
        extra,
        ts: Date.now(),
        platform: 'mobile',
      }),
    });
  } catch {
    // swallow errors
  }
}
