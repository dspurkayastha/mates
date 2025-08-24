import * as React from 'react';

  function useHandleStreamResponse({
  onChunk,
  onFinish
}) {
  const handleStreamResponse = React.useCallback(
    async (response) => {
      if (response.body) {
        const reader = response.body.getReader();
        if (reader) {
          // Guard against environments (e.g. some RN runtimes) where TextDecoder is not available.
          const decoder =
            globalThis.TextDecoder ? new globalThis.TextDecoder() : null;
          let content = '';
          while (true) {
            const { done, value } = await reader.read();
            if (done) {
              onFinish(content);
              break;
            }
            const chunk = decoder
              ? decoder.decode(value, { stream: true })
              : globalThis.Buffer
              ? globalThis.Buffer.from(value).toString('utf8')
              : String(value);
            content += chunk;
            onChunk(content);
          }
        }
      }
    },
    [onChunk, onFinish]
  );
  const handleStreamResponseRef = React.useRef(handleStreamResponse);
  React.useEffect(() => {
    handleStreamResponseRef.current = handleStreamResponse;
  }, [handleStreamResponse]);
  return React.useCallback((response) => handleStreamResponseRef.current(response), []); 
}

  export default useHandleStreamResponse;