import { useEffect, useRef } from "react";
import Button from "../../components/buttons/button";
import { toast } from "sonner";
import {
  createStream,
  startStream,
  stopStream,
} from "~/services/livestream.service";
import type { ChannelResponse } from "~/services/channel.service";

const INGEST_URL = import.meta.env.VITE_STREAM_INGEST_URL;
const BITS_PER_SECOND = import.meta.env.VITE_STREAM_BITS_PER_SECOND;

export default function Stream({ channel }: { channel: ChannelResponse }) {
  console.log(BITS_PER_SECOND);
  const video = useRef<HTMLVideoElement>(null);
  let mimeType: string | undefined;
  let streamId: string | undefined;

  let recorder: MediaRecorder;
  useEffect(() => {
    const types = [
      "video/webm;codecs=vp8,opus",
      "video/webm;codecs=vp9,opus",
      "video/mp4;codecs=avc1.42E01E,mp4a.40.2",
    ].filter((t) => MediaSource.isTypeSupported(t));

    mimeType = types.shift();

    if (!mimeType) {
      console.error("Media not supported.");
    }
    console.log("MimeType: ", mimeType);
  });

  function startRecorder(ws: WebSocket, stream: MediaStream) {
    if (!mimeType) {
      return;
    }
    if (recorder && recorder.state !== "inactive") {
      console.warn("Recorder already running, stopping first");
      recorder.stop();
    }

    console.log("Mime type", mimeType);
    recorder = new MediaRecorder(stream, {
      mimeType: mimeType,
      videoBitsPerSecond: BITS_PER_SECOND,
    });

    console.log("Recorder created, state:", recorder.state);

    recorder.ondataavailable = ({ data }: { data: Blob }) => {
      if (data.size > 0 && ws.readyState === WebSocket.OPEN) {
        console.log("Sending chunk, bytes:", data.size);
        ws.send(data);
      }
    };

    recorder.onerror = (e) => console.error("Recorder error:", e);
    recorder.onstart = () => console.log("Recorder started");
    recorder.onstop = () => console.log("Recorder stopped");

    // Signal new session to server
    ws.send(JSON.stringify({ type: "stream_start" }));

    recorder.start(1000);
  }

  function connectProducer(stream: MediaStream) {
    const ws = new WebSocket(INGEST_URL.replaceAll("{streamId}", streamId));
    ws.binaryType = "arraybuffer";

    ws.onopen = () => {
      console.log("ws open");
      startRecorder(ws, stream);
    };

    ws.onclose = (e) => {
      console.log("ws closed", e.code);
      if (recorder && recorder.state !== "inactive") {
        recorder.stop();
      }
      setTimeout(() => connectProducer(stream), 8000);
    };

    ws.onerror = (e) => {
      console.error("ws error", e);
      ws.close();
    };
  }

  let stream: MediaStream | undefined;

  function startStreamCapture() {
    const v = video.current;
    if (!v) {
      return;
    }

    navigator.mediaDevices
      .getUserMedia({
        video: {
          width: { ideal: 1920 },
          height: { ideal: 1080 },
          frameRate: { ideal: 30 },
        },
        audio: true,
      })
      .then((s: MediaStream) => {
        stream = s;
        v.srcObject = s;
        v.play();
        connectProducer(s);
      })
      .catch((err) => {
        console.error(err.name, err.message);
        toast.error("Did you turn the camera on?");
      });
  }

  async function handleStartStream() {
    if (!streamId) {
      const stream = await createStream({
        channelId: channel.id,
        name: channel.name,
        description: channel.description,
      });
      console.log("created stream: ", stream);
      streamId = stream.id;
    }
    await startStream(streamId);
    console.log("started stream ", streamId);
    startStreamCapture();
  }

  function stopStreamCapture() {
    const v = video.current;
    if (stream && v) {
      stream.getTracks().forEach((track) => track.stop());
      v.srcObject = null;
    }
  }

  async function handleStopStream() {
    stopStreamCapture();
    if (streamId) {
      await stopStream(streamId);
      console.log("stopped stream ", streamId);
    }
  }

  return (
    <div className="flex flex-col grow min-h-0">
      <div className="camera"></div>
      <div className="flex flex-col min-h-0 justify-center items-center">
        <video
          ref={video}
          className="max-h-full max-w-full aspect-video border border-red-500 rounded-2xl object-contain"
        >
          Video stream not available.
        </video>
      </div>

      <div className="shrink-0 p-2">
        <div className="flex justify-center">
          <Button
            className="bg-red-600"
            aria-description="Start Stream"
            onClick={handleStartStream}
          >
            Start Stream
          </Button>

          <Button
            className="bg-red-600"
            aria-description="Stop Stream"
            onClick={handleStopStream}
          >
            Stop Stream
          </Button>
        </div>
      </div>
    </div>
  );
}
