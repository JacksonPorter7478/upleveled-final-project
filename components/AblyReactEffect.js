import Ably from 'ably/promises';
import { useEffect } from 'react';

// Instancing the Ably library outside the scope of the component will mean it is only created once
// and will keep my limit usage down https://ably.com/blog/realtime-chat-app-nextjs-vercel
const ably = new Ably.Realtime.Promise({ authUrl: '/api/createTokenRequest' });

// The useChannel Hook returns both the current Ably channel and the Ably SDK
// for the calling code to use to send messages.
// This hook encapsulates Ably pub/sub for React functional components in one place

export function useChannel(channelName, callbackOnMessage) {
  const channel = ably.channels.get(channelName);

  const onMount = async () => {
    await channel.subscribe((msg) => {
      callbackOnMessage(msg);
    });
  };

  const onUnmount = () => {
    channel.unsubscribe();
  };

  const useEffectHook = async () => {
    await onMount();
    return () => {
      onUnmount();
    };
  };

  useEffect(useEffectHook);

  return [channel, ably];
}
