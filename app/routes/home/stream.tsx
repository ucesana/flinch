import { useEffect, useRef } from "react";
import Button from "../../components/buttons/button";
import { toast } from "sonner";
import {
  createStream,
  startStream,
  stopStream,
  updateThumbnail,
} from "~/services/livestream.service";
import type { ChannelResponse } from "~/services/channel.service";

const INGEST_URL = import.meta.env.VITE_STREAM_INGEST_URL;
const BITS_PER_SECOND = import.meta.env.VITE_STREAM_BITS_PER_SECOND;

export default function Stream({ channel }: { channel: ChannelResponse }) {
  console.log(BITS_PER_SECOND);
  const videoRef = useRef<HTMLVideoElement>(null);
  const thumbnailCaptured = useRef(false);

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
    recorder.onstart = () => handleRecorderOnStart();
    recorder.onstop = () => console.log("Recorder stopped");

    // Signal new session to server
    ws.send(JSON.stringify({ type: "stream_start" }));

    recorder.start(1000);
  }

  async function handleRecorderOnStart() {
    console.log("Recorder started");

    const video: HTMLVideoElement | null = videoRef.current;
    console.log("Attempting to capture thumbnail");
    if (video && streamId) {
      const blob = await captureStreamThumbnail(video, {
        width: video.videoWidth * 0.5,
        height: video.videoHeight * 0.5,
      });
      console.log("Got a blob, let's update");
      await updateThumbnail(streamId, blob, "image/jpeg");
    }
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
    const v = videoRef.current;
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
    const v = videoRef.current;
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

  function captureStreamThumbnail(
    video: HTMLVideoElement,
    options?: { width?: number; height?: number },
  ): Promise<Blob> {
    console.log("Capture stream thumbnail");

    if (video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) {
      throw new Error("Video does not have a frame available yet");
    }

    const canvas: HTMLCanvasElement = document.createElement("canvas");

    canvas.width = options?.width ?? video.videoWidth;
    canvas.height = options?.height ?? video.videoHeight;

    const context = canvas.getContext("2d");

    if (!context) {
      throw new Error("Could not create canvas context");
    }

    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error("Could not create image blob"));
          }
        },
        "image/jpeg",
        0.85,
      );
    });
  }

  return (
    <div className="flex flex-col grow min-h-0">
      <div className="camera"></div>
      <div className="flex flex-col min-h-0 justify-center items-center">
        <video
          ref={videoRef}
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
