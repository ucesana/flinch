import type { LiveStreamResponse } from "~/services/livestream.service";
import { useNavigate } from "react-router";

export interface LiveStream extends LiveStreamResponse {
  thumbnailUrl?: string;
}

export default function LiveStreamCard({ stream }: { stream: LiveStream }) {
  const navigate = useNavigate();

  function handleClick() {
    navigate(`/watch?streamId=${stream.id}`);
  }
  return stream.thumbnailUrl ? (
    <img
      key={stream.id}
      src={stream.thumbnailUrl}
      alt={stream.name}
      className="aspect-video border border-red-500 rounded-2xl cursor-pointer"
      onClick={handleClick}
    />
  ) : (
    <iframe
      className="aspect-video border border-red-500 rounded-2xl"
      src="https://www.youtube.com/embed/dQw4w9WgXcQ"
    ></iframe>
  );
}
