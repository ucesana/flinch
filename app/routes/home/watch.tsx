import { useEffect, useRef } from "react";
import { useSearchParams } from "react-router";

const CONSUME_URL = import.meta.env.VITE_STREAM_CONSUME_URL;

export default function Watch() {
  const [searchParams] = useSearchParams();
  const streamId = searchParams.get("streamId");

  const videoRef = useRef<HTMLVideoElement>(null);

  function connect(streamId: string) {
    const video: HTMLVideoElement | null = videoRef.current;

    if (video) {
      if (video.src) {
        // Removes the stored <Blob> identified by the given ID. Attempting to revoke a ID that isn't registered will silently fail.
        URL.revokeObjectURL(video.src);
        video.removeAttribute("src");
        video.load();
      }

      const ms = new MediaSource();
      video.src = URL.createObjectURL(ms);

      const mimeType = "video/webm;codecs=vp8,opus";

      ms.addEventListener("sourceopen", () => {
        console.log("Sourceopen");
        const sb = ms.addSourceBuffer(mimeType);
        const queue: BufferSource[] = [];
        let chunkCount = 0;

        const pump = () => {
          if (queue.length === 0 || sb.updating) return;
          if (ms.readyState !== "open") return;
          try {
            const datum = queue.shift();
            if (datum) {
              sb.appendBuffer(datum);
            }
          } catch (e) {
            console.error("AppendBuffer failed:", e);
          }
        };

        sb.addEventListener("updateend", () => {
          if (sb.buffered.length > 0 && !sb.updating) {
            const lastIndex = sb.buffered.length - 1;
            const bufferStart = sb.buffered.start(lastIndex);
            const bufferEnd = sb.buffered.end(lastIndex);

            // If we are not in the buffered range, seek to the start of it
            if (
              video.currentTime < bufferStart ||
              video.currentTime > bufferEnd
            ) {
              console.log(
                `Seeking to buffer start: ${bufferStart.toFixed(2)} (current: ${video.currentTime.toFixed(2)})`,
              );
              video.currentTime = bufferStart;
              return;
            }

            // Cleanup old buffer if it gets too large (keep last 20s)
            if (bufferEnd - sb.buffered.start(0) > 40) {
              try {
                console.log("Cleaning up old buffer");
                sb.remove(sb.buffered.start(0), bufferEnd - 20);
                return; // wait for next updateend
              } catch (e) {
                console.error("Remove failed:", e);
              }
            }

            // Catch up if we are more than 2 seconds behind the edge
            if (bufferEnd - video.currentTime > 2) {
              console.log(
                `Catching up from ${video.currentTime.toFixed(2)} to ${(bufferEnd - 0.5).toFixed(2)}`,
              );
              video.currentTime = bufferEnd - 0.5;
            }
          }

          pump();
        });

        // Log all video element events
        [
          "canplay",
          "playing",
          "stalled",
          "waiting",
          "ended",
          "error",
          "pause",
        ].forEach((evt) => {
          video.addEventListener(evt, () => {
            console.log(
              `Video event: ${evt} | currentTime: ${video.currentTime.toFixed(2)} | readyState: ${video.readyState}`,
            );
          });
        });

        video.addEventListener("error", () => {
          console.error("Video error:", video.error);
        });

        const ws = new WebSocket(
          CONSUME_URL.replaceAll("{streamId}", streamId),
        );
        ws.binaryType = "arraybuffer";

        ws.onopen = () => console.log("ws open");
        ws.onerror = (e) => console.error("ws error", e);
        ws.onclose = (e) => {
          console.log("ws closed", e.code, e.reason);
          setTimeout(connect, 2000);
        };

        ws.onmessage = ({ data }) => {
          // Check for control messages
          if (typeof data === "string") {
            try {
              const msg = JSON.parse(data);
              if (msg.type === "reconnect") {
                console.log("Server signalled reconnect — rebuilding pipeline");
                ws.close();
                return;
              }
            } catch (_) {}
            return;
          }
          chunkCount++;
          console.log(
            `Chunk #${chunkCount} received, bytes: ${data.byteLength}, queue length: ${queue.length}`,
          );
          queue.push(data);
          pump();
        };
      });

      video.addEventListener(
        "canplay",
        () => {
          console.log("canplay fired, calling play()");
          video.play().catch((e) => console.error("Play failed:", e));
        },
        { once: true },
      );
    }
  }
  useEffect(() => {
    if (!streamId) {
      return;
    }
    connect(streamId);
  }, [streamId]);

  return (
    <div className="pt-4">
      <div className="flex justify-center">
        <video
          ref={videoRef}
          className="aspect-video border border-red-500 rounded-2xl w-[150vh]"
        >
          Video stream not available.
        </video>
      </div>
    </div>
  );
}
