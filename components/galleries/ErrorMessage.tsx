"use client";

import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";

export default function ErrorMessage({ message }: { message: string }) {
  const { toast } = useToast();

  useEffect(() => {
    toast({
      variant: "destructive",
      title: "Error",
      description: message,
    });
  }, [message, toast]);

  return (
    <div className="container mx-auto py-8">
      <div className="text-center">
        <p className="text-red-500">{message}</p>
        <p>
          Please try again later or contact support if the problem persists.
        </p>
      </div>
    </div>
  );
}
