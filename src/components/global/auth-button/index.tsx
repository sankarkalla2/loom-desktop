import { Button } from "@/components/ui/button";
import {
  SignedOut,
  SignInButton,
  SignOutButton,
  SignUpButton,
} from "@clerk/clerk-react";

const AuthButton = () => {
  return (
    <SignedOut>
      <div className="flex items-center h-screen justify-center gap-x-3">
        <SignInButton>
          <Button className="px-10 rounded-xl hover:bg-gray-200">
            Sign-In
          </Button>
        </SignInButton>
        <SignUpButton>
          <Button className="px-10 rounded-xl hover:bg-gray-200">
            Sign-Up
          </Button>
        </SignUpButton>
      </div>
    </SignedOut>
  );
};

export default AuthButton;
