"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { MdError } from "react-icons/md";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  const router = useRouter();

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] p-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="space-y-2">
          <MdError className="mx-auto h-12 w-12 text-red-500" />
          <h1 className="text-3xl font-bold tracking-tight">Diçka shkoi keq</h1>
          <p className="text-muted-foreground">
            {error.message || "Ndodhi një gabim i papritur"}
          </p>
          {error.digest && (
            <p className="text-xs text-muted-foreground">
              Error ID: {error.digest}
            </p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            variant="default"
            onClick={() => {
              reset();
              router.refresh();
            }}
            className="w-full sm:w-auto"
          >
            Provoni përsëri
          </Button>
          <Link href={"/"}
            className="w-full sm:w-auto bg-indigo-600 p-1 px-2 rounded-lg flex items-center justify-center text-white font-medium text-sm"
          >
            Kthehu në faqen kryesore
          </Link>
        </div>
      </div>
    </div>
  );
}
