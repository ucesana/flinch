import LiveStreamCard from "../../components/cards/live-stream-card";
import {
  browseStreams,
  type LiveStreamResponse,
} from "~/services/livestream.service";
import { useEffect, useState } from "react";

export default function Browse() {
  const [livestreams, setLivestreams] = useState<LiveStreamResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadLivestreams() {
      try {
        setLoading(true);

        const data = await browseStreams();

        setLivestreams(data);
      } catch (error) {
        if (error instanceof Error && error.name !== "AbortError") {
          setError(error);
        }
      } finally {
        setLoading(false);
      }
    }

    loadLivestreams().then((r) => {});

    return () => controller.abort();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="flex justify-center p-2">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full overflow-y-auto">
        {livestreams.map((stream) => (
          <LiveStreamCard stream={stream} />
        ))}
      </div>
    </div>
  );
}
