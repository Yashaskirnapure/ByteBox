import { files } from "@/src/db/schema";
import { db } from "@/src/db";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { eq, and, isNull, notInArray, or } from "drizzle-orm";

export async function GET(request: NextRequest){
    try{
        const { userId } = await auth();
        if(!userId) return NextResponse.json({error: "Unauthorized" }, { status: 401 });

        const searchParams = request.nextUrl.searchParams;
        const queryUserId = searchParams.get("userId");
        const queryTrashDir = searchParams.get("trashDir");

        if(queryUserId !== userId) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

        let content;
        if(queryTrashDir) content = await db.select().from(files).where(and(eq(files.parentID, queryTrashDir), eq(files.isTrash, true)));
        else content = await db.select().from(files).where(and(eq(files.isTrash, true),or(isNull(files.parentID), notInArray(files.parentID,
            db.select({ id: files.id }).from(files).where(eq(files.isTrash, true))
        ))));

        return NextResponse.json({ success: true, content: content }, { status: 200 });
    }catch(err: any){
        console.log("Failed to get data.", err);
        return NextResponse.json({ error: "Failed to get data. Please try again." }, { status: 500 });
    }
}