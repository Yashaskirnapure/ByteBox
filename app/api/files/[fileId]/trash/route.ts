import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { files } from "@/src/db/schema";
import { db } from "@/src/db";
import { and, eq } from "drizzle-orm";

export async function PATCH(request: NextRequest, props: { params: Promise<{ fileId: string }> }){
    try{
        const { userId } = await auth();
        if(!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const { fileId } = await props.params;
        const searchParams = request.nextUrl.searchParams;
        const queryUserId = searchParams.get("userId") as string;

        if(!fileId) return NextResponse.json({ message: "Bad Request" }, { status: 400 });
        if(queryUserId && queryUserId !== userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const [ file ] = await db.select().from(files)
                            .where(
                                and(
                                    eq(files.id, fileId),
                                    eq(files.userID, userId),
                                    eq(files.isFolder, false),
                                    eq(files.isTrash, false)
                                )
                            );
        if(!file) return NextResponse.json({ message: "File not found" }, { status: 404 });

        const [ updatedFile ] = await db.update(files).set({ isTrash: true }).where(and(eq(files.id, fileId), eq(files.userID, userId))).returning();

        return NextResponse.json({ success: true, message: "File successfully moved to trash", content: updatedFile }, { status: 200 });
    }catch(err){
        console.log("Error occurred while moving to trash.", err);
        return NextResponse.json({ message: "Something went wrong while moving to trash" }, { status: 500 });
    }
}