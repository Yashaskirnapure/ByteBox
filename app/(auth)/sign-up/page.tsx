import Image from "next/image";
import SignUp from "@/components/SignUp";

export default function Home() {
  return (
    <div className="h-screen w-full flex justify-center items-center">
      <SignUp/>
    </div>
  );
}