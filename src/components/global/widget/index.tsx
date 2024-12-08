import { useMediaSources } from "@/hooks/use-mediaResources";
import { fetchUserProfile } from "@/lib/utils";
import { ClerkLoading, SignedIn, useUser } from "@clerk/clerk-react";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import MediaConfiguration from "../media-configuration";

const Widget = () => {
  const { user } = useUser();
  console.log("user", user);
  const [profile, setProfile] = useState<{
    status: number;
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
  } | null>(null);

  const { fetchMediaSources, state } = useMediaSources();
  useEffect(() => {
    if (user && user.id) {
      console.log("user-id", user.id);
      fetchUserProfile(user.id).then((p) => setProfile(p));
      fetchMediaSources();
    }
  }, []);

  console.log(state);
  console.log("profile", profile);

  return (
    <div>
      <ClerkLoading>
        <div>
          <Loader2 className="animate-spin" />
        </div>
      </ClerkLoading>
      <SignedIn>
        {profile ? (
          <MediaConfiguration state={state} user={profile.user} />
        ) : (
          <div>
            <Loader2 className="animate-spin" />
          </div>
        )}
      </SignedIn>
    </div>
  );
};

export default Widget;
