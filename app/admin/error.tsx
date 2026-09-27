"use client";

import { ErrorState } from "@/components/app/error-state";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="container-page py-10">
      <ErrorState reset={reset} digest={error.digest} />
    </div>
  );
}
