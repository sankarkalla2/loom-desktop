import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import axios from "axios";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const httpsClient = axios.create({
  baseURL: import.meta.env.VITE_HOST_URL,
});

export const onCloseApp = () => {
  window.ipcRenderer.send("closeApp");
};

export const fetchUserProfile = async (clerkid: string) => {
  const response = await httpsClient.get(`auth/${clerkid}`, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  console.log("response", response.data);
  return response.data;
};

export const updateStudioSettings = async (data: {
  screen: string;
  id: string;
  audio: string;
  preset: "HD" | "SD";
}) => {
  const response = await httpsClient.post(
    `studio/${data.id}`,
    { ...data },
    { headers: { "Content-Type": "application/json" } }
  );
  return response.data;
};

export const hidePluginWindow = async (state: boolean) => {
  window.ipcRenderer.send("hide-plugin", { state });
};

export const videoRecodingTime = (ms: number) => {
  const second = Math.floor((ms / 1000) % 60)
    .toString()
    .padStart(2, "0");
  const minutes = Math.floor((ms / 1000 / 60) % 60)
    .toString()
    .padStart(2, "0");
  const hours = Math.floor(ms / 1000 / 60 / 60)
    .toString()
    .padStart(2, "0");
  return { hours, minutes, second, length: `${hours}:${minutes}:${second}` };
};
