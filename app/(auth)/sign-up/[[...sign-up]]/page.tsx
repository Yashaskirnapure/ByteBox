import Image from "next/image";
import SignUp from "@/components/SignUp";

export default function Home() {
  return (
    <div className="flex h-screen w-full flex-col justify-center items-center">
      <SignUp/>
    </div>
  );
}