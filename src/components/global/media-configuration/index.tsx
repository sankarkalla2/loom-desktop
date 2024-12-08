import { SourceDiviceStateProps } from "@/hooks/use-mediaResources";
import { useStudioSettings } from "@/hooks/use-studiosettings";
import { Camera, Headphones, Loader, Monitor } from "lucide-react";
import { symbol } from "zod";

type Props = {
  state: SourceDiviceStateProps;
  user: {
    id: string;
    email: string | null;
    firstname: string | null;
    lastname: string | null;
    createdAt: Date;
    clerkid: string;
  } & ({
    subscription: {
      plan: "FREE" | "PRO";
    } | null;
    studio: {
      id: string;
      screen: string | null;
      mic: string | null;
      camera: string | null;
      preset: "HD" | "SD";
      userId: string | null;
    } | null;
  } | null);
};
const MediaConfiguration = ({ state, user }: Props) => {
  const activeScreen = state.displays?.find(
    (screen) => screen.id === user.studio.id
  );
  console.log("active screen", activeScreen);

  const activeAudio = state.audioInputs.find(
    (device) => device.deviceId === user.studio.mic
  );
  const { register, handleSubmit, onPreset, isPending } = useStudioSettings(
    user?.id,
    user.studio.screen || state.displays?.[0]?.id,
    user?.studio?.mic || state.audioInputs?.[0]?.deviceId,
    user?.studio?.preset,
    user?.subscription?.plan
  );
  return (
    <form className="flex h-full relative w-full gap-2 flex-col gap-y-5">
      {isPending && (
        <div className="fixed z-50 top-0 left-0 right-0 bottom-0 rounded-2xl h-full bg-black/80 flex justify-center items-center">
          <Loader />
        </div>
      )}
      <div className="flex gap-5 justify-center items-center">
        <Monitor fill="#575757" color="#575757" size={36} />
        <select
          {...register("screen")}
          className="outline-none cursor-pointer px-5 py-2 rounded-xl border-2 w-full"
        >
          {state.displays?.map((dispaly, key) => (
            <option
              selected={activeScreen && activeScreen.id == dispaly.id}
              value={dispaly.id}
              className="bg-[#1717171] cursor-pointer"
              key={key}
            >
              {dispaly.name}
            </option>
          ))}
        </select>
      </div>
      <div className="flex justify-center items-center gap-5">
        <Headphones color="#575655" size={36} />
        <select
          {...register("audio")}
          className="outline-none cursor-pointer px-5 py-2 rounded-xl border-2"
        >
          {state.audioInputs?.map((audio, key) => (
            <option
              selected={activeAudio && activeAudio.deviceId == audio.deviceId}
              value={audio.deviceId}
              className="bg-[#57575757] cursor-pointer w-full px-5 rounded-2xl"
              key={key}
            >
              {audio.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex justify-center items-center gap-5">
        <Camera color="#575655" size={36} />
        <select
          {...register("preset")}
          className="outline-none cursor-pointer px-5 py-2 rounded-xl border-2"
        >
          <option
            value="HD"
            disabled={user.subscription.plan === "FREE"}
            selected={onPreset == "HD" || user.studio?.preset === "HD"}
          >
            1080p
            {user.subscription.plan === "FREE" && "Upgrde to PRO plan "}
          </option>
          <option
            value="SD"
            selected={onPreset == "SD" || user.studio?.preset === "SD"}
          >
            720p
          </option>
        </select>
      </div>
    </form>
  );
};

export default MediaConfiguration;
