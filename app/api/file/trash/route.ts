import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function PATCH(request: NextRequest){
    try{
        const { userId } = await auth();
        if(!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        const querySearchParams = request.nextUrl.searchParams;
        const queryUserId = querySearchParams.get("userId");

        if(!queryUserId || queryUserId !== userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        if(!request.body) return NextResponse.json({ message: "Bad Request" }, { status: 400 });

        const requestBody = await request.json;
    }catch(err: any){
        console.log("Could not move to trash.", err);
        return NextResponse.json({ message: "Could not move to trash" }, { status: 500 });
    }
}