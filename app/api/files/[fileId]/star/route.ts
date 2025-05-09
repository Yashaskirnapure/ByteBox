import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/src/db";
import { files } from "@/src/db/schema";
import { and, eq } from "drizzle-orm"

export async function PATCH(request: NextRequest, props: { params: Promise<{ fileId: string }> }){
    try{
        const { userId } = await auth();
        if(!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const { fileId } = await props.params;
        const searchParams = request.nextUrl.searchParams;
        const queryUserId = searchParams.get("userId");

        if(!fileId) return NextResponse.json({ message: "Bad Request" }, { status: 400 });
        if(queryUserId && queryUserId !== userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const [ file ] = await db.select().from(files).where(and(eq(files.id, fileId), eq(files.userID, userId), eq(files.isFolder, false)));
        if(!file) return NextResponse.json({ message: "File not found" }, { status: 404 });
        
        const [ updatedEntry ] = await db.update(files).set({ isStarred: !file.isStarred }).where(and(eq(files.userID, userId), eq(files.id, fileId))).returning();
        return NextResponse.json({ message: "Star status updated", content: updatedEntry }, { status: 200 });
    }catch(err: any){
        return NextResponse.json({ message: "Could not star file. Try again later" }, { status: 500 });
    }
}