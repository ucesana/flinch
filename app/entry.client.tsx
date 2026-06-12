import { startTransition, StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import { HydratedRouter } from "react-router/dom";
import { Toaster } from "sonner";

startTransition(() => {
  hydrateRoot(
    document,
    <StrictMode>
      <Toaster />
      <HydratedRouter />
    </StrictMode>,
  );
});
