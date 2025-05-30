import { NextRequest } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { files } from "@/src/db/schema";
import { db } from "@/src/db";

export async function PATCH(request: NextRequest){
    try{
        const { userId } = await auth();
        
    }catch(err: any){

    }
}