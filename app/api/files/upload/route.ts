import { files } from "@/src/db/schema";
import { db } from "@/src/db";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { eq, and } from "drizzle-orm";

export async function POST(request: NextRequest){
    try{
        const { userId } = await auth();
        if(!userId) return 
    }catch(err: any){
        return NextResponse.json({  }, { status: 500 });
    }
}