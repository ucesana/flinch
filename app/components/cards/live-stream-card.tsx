import type { LiveStreamResponse } from "~/services/livestream.service";
import { useNavigate } from "react-router";

export default function LiveStreamCard({
  stream,
}: {
  stream: LiveStreamResponse;
}) {
  const navigate = useNavigate();

  function handleClick() {
    navigate(`/watch?streamId=${stream.id}`);
  }
  return (
    <div
      className="aspect-video border border-red-500 rounded-2xl cursor-pointer"
      onClick={handleClick}
    >
      {/*<iframe*/}
      {/*  className="aspect-video border border-red-500 rounded-2xl"*/}
      {/*  src="https://www.youtube.com/embed/dQw4w9WgXcQ"*/}
      {/*></iframe>*/}
    </div>
  );
}
