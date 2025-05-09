import { auth } from "@clerk/nextjs/server";
import { files } from "@/src/db/schema";
import { db } from "@/src/db";
import { NextRequest, NextResponse } from "next/server";
import { eq, and } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: NextRequest){
    try{
        const { userId } = await auth();
        if(!userId) return NextResponse.json({error: "Unauthorized" }, { status: 401 });

        const body = await request.json();
        const { name, userId: bodyUserId, parentID = null } = body;
        
        if(bodyUserId !== userId) return NextResponse.json({error: "Unauthorized" }, { status: 401 });
        if(!name || typeof name !== "string" || name.trim() === "") 
            return NextResponse.json({error: "Folder name is required." }, { status: 400 });
        
        if(parentID){
            const [parentFolder] = await db.select().from(files)
                                        .where(
                                            and(
                                                eq(files.id, parentID),
                                                eq(files.userID, userId),
                                                eq(files.isFolder, true)
                                            )
                                        );
            if(!parentFolder) return NextResponse.json({error: "Parent folder not found" }, { status: 404 });
        }

        const newFolderData = {
            id: uuidv4(),
            name: name.trim(),
            path: `folder/${userId}/${uuidv4()}`,
            size: 0,
            type: "folder",
            fileUrl : "",
            thumbnailUrl: null,
            userID: userId,
            parentID,
            ifFolder: true,
            isStarred: false,
            isTrash: false,
        };

        await db.insert(files).values(newFolderData).returning();
        return NextResponse.json({ success: true, message: "Folder created successsully.", folder: newFolderData });
    }catch(err: any){
        console.log("Failed to create folder", err);
        return NextResponse.json({ error: "Failed to create folder. Please try again." }, { status: 500 });
    }
}