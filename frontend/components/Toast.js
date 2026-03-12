"use client";

import { Toaster } from "react-hot-toast";

export default function Toast() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 3000,
        style: {
          borderRadius: "10px",
          border: "1px solid #E2E8F0",
          fontSize: "13px",
        },
      }}
    />
  );
}
