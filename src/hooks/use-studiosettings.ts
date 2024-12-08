import { useMutation } from "@tanstack/react-query";
import { useZodForm } from "./use-zodform";
import { updateStudioSettings } from "@/lib/utils";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { updatedStudioSchema } from "@/schemas/studio.schema";

export const useStudioSettings = (
  id: string,
  screen?: string | null,
  mic?: string | null,
  camera?: string | null,
  audio?: string | null,
  preset?: "HD" | "SD" | null,
  plan?: "PRO" | "FREE"
) => {
  const { register, watch, handleSubmit } = useZodForm(updatedStudioSchema, {
    screen: screen,
    audio: audio,
    preset: preset,
  });

  const [onPreset, setOnPreset] = useState<"HD" | "SD" | null>(preset);

  const { mutate, isPending } = useMutation({
    mutationKey: ["update-studio"],
    mutationFn: (data: {
      screen: string;
      id: string;
      audio: string;
      preset: "HD" | "SD";
    }) => updateStudioSettings(data),
    onSuccess: (data) => {
      return toast(data.success === 200 ? "Success" : "Error", {
        description: data.message,
      });
    },
  });

  useEffect(() => {
    if (screen && audio) {
      window.ipcRenderer.send("media-sources", {
        screen,
        audio,
        preset,
        plan,
        id,
      });
    }
  }, [screen, audio]);

  useEffect(() => {
    const subscribe = watch((values) => {
      setOnPreset(values.preset);
      mutate({
        screen: values.screen as string,
        id,
        audio: values.audio!,
        preset: values.preset,
      });
      window.ipcRenderer.send("media-sources", {
        screen: values.screen as string,
        audio: values.audio!,
        preset: values.preset,
        plan,
        id,
      });
    });

    return () => subscribe.unsubscribe();
  }, [watch]);

  return { register, handleSubmit, onPreset, isPending };
};
