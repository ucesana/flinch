import { WebSocketServer, WebSocket } from "ws";

const BUFFER_SIZE = 10;

const port = 8080;
const wss = new WebSocketServer({ port });
const consumers = new Set<WebSocket>();

let chunkBuffer: Buffer<ArrayBuffer>[] = [];
let header: Buffer<ArrayBuffer> | null = null;
let foundFirstCluster = false;

function isEBMLHeader(buffer: Buffer<ArrayBuffer>) {
  return (
    buffer.length >= 4 &&
    buffer[0] === 0x1a &&
    buffer[1] === 0x45 &&
    buffer[2] === 0xdf &&
    buffer[3] === 0xa3
  );
}

const CLUSTER_ID = Buffer.from([0x1f, 0x43, 0xb6, 0x75]);

wss.on("connection", (socket, req) => {
  console.log("Received connection:", req.url);

  if (req.url === "/ingest") {
    header = null;
    chunkBuffer = [];
    foundFirstCluster = false;
    console.log("New producer connected — resetting state");

    for (const c of consumers) {
      c.send(JSON.stringify({ type: "reconnect" }));
    }

    socket.on("message", (chunk: Buffer<ArrayBuffer>) => {
      try {
        const msg = JSON.parse(chunk.toString("utf-8"));
        if (msg.type === "stream_start") {
          header = null;
          chunkBuffer = [];
          foundFirstCluster = false;
          console.log(
            "Received stream_start message from producer — resetting state",
          );
          return;
        }
      } catch (_) {}

      if (!foundFirstCluster) {
        if (isEBMLHeader(chunk) || header) {
          if (!header) {
            header = Buffer.alloc(0); // first time initialisation
          }
          // for late stream joiners, prepend non EBML chunk with header, otherwise set header as EBML chunk
          header = Buffer.concat([header, chunk]);

          const clusterIndex = header.indexOf(CLUSTER_ID);
          if (clusterIndex !== -1) {
            const actualHeader = header.subarray(0, clusterIndex);
            const firstMediaChunk = header.subarray(
              clusterIndex,
              header.length,
            );
            header = actualHeader;
            foundFirstCluster = true;
            console.log(
              "Split header:",
              header.length,
              "First media chunk:",
              firstMediaChunk.length,
            );
            chunk = firstMediaChunk;
          } else {
            console.log("Accumulating header, current size:", header.length);
            return;
          }
        } else {
          return; // waiting for EBML header
        }
      }

      // Maintain rolling buffer of recent media chunks.
      // Ensure each entry in chunkBuffer starts with a Cluster ID for new consumers.
      if (chunk.indexOf(CLUSTER_ID) === 0) {
        chunkBuffer.push(chunk);
      } else if (chunkBuffer.length > 0) {
        // Not at start of cluster, so append this chunk to previous chunk
        chunkBuffer[chunkBuffer.length - 1] = Buffer.concat([
          chunkBuffer[chunkBuffer.length - 1],
          chunk,
        ]);
      }

      // Shift out old clusters from buffer
      if (chunkBuffer.length > BUFFER_SIZE) {
        chunkBuffer.shift();
      }

      // Send them chunks!
      for (const c of consumers) {
        if (c.readyState === 1) c.send(chunk);
      }
    });

    socket.on("close", () => console.log("Producer disconnected"));
  } else if (req.url === "/consume") {
    if (header) {
      // Send init segment followed by all buffered chunks
      // so the consumer starts with a contiguous sequence
      socket.send(header);
      console.log(
        `Sending init + ${chunkBuffer.length} buffered chunks to new consumer`,
      );
      for (const chunk of chunkBuffer) {
        if (socket.readyState === 1) {
          socket.send(chunk);
        }
      }
    }

    consumers.add(socket);
    socket.on("close", () => {
      console.log("Consumer disconnected.");
      consumers.delete(socket);
    });
  }
});

console.log("Server started.");
