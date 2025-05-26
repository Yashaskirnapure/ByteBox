import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { files } from "@/src/db/schema";
import { eq, and, inArray } from "drizzle-orm";
import { db } from "@/src/db";

export async function PATCH(request: NextRequest){
    try{
        const { userId } = await auth();
        if(!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        const querySearchParams = request.nextUrl.searchParams;
        const queryUserId = querySearchParams.get("userId");

        if(!queryUserId || queryUserId !== userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        if(!request.body) return NextResponse.json({ message: "Bad Request" }, { status: 400 });

        const requestBody = await request.json();
        const { fileIds } = requestBody;
        console.log(fileIds[0]);
        if(!Array.isArray(fileIds) || fileIds.length === 0) return NextResponse.json({ message: "Bad Request" }, { status: 400 });
        const [ response ] = await db.update(files).set({ isTrash: true }).where(and(eq(files.userID, userId), inArray(files.id, fileIds))).returning();

        return NextResponse.json({ success: true, message: "Moved to trash" }, { status: 200 });
    }catch(err: any){
        console.log("Could not move to trash.", err);
        return NextResponse.json({ message: "Could not move to trash" }, { status: 500 });
    }
}