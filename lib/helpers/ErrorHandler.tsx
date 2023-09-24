"use client";

import { toast } from "@/components/ui/use-toast";
import observableError, { TToastContent } from "@/services/ErrorObserver";
import { useEffect } from "react";

export default function ErrorHandler() {
  const onError = (toastContent: TToastContent) => {
    const { title, description } = toastContent;

    toast({
      title,
      description,
      variant: "destructive",
    });
  };

  useEffect(() => {
    observableError.subscribe(onError);

    return () => observableError.unsubscribe(onError);
  }, []);

  return null;
}
