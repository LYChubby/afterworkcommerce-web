import { Suspense } from "react";

import { GoogleCallback } from "@/features/auth/components/google-callback";

interface GoogleCallbackPageProps {
  searchParams: Promise<{
    code?: string | string[];
  }>;
}

async function GoogleCallbackContent({ searchParams }: GoogleCallbackPageProps) {
  const params = await searchParams;

  const code = typeof params.code === "string" ? params.code : null;

  return <GoogleCallback code={code} />;
}

function CallbackFallback() {
  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <div className="text-center">
        <h1 className="text-xl font-semibold">Preparing authentication</h1>
        <p className="mt-2 text-sm text-muted-foreground">Please wait...</p>
      </div>
    </main>
  );
}

export default function GoogleCallbackPage(props: GoogleCallbackPageProps) {
  return (
    <Suspense fallback={<CallbackFallback />}>
      <GoogleCallbackContent {...props} />
    </Suspense>
  );
}
