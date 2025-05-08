import { auth } from "@clerk/nextjs/server";
import { db } from "@/src/db";
import { files } from "@/src/db/schema";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest){
    try{
        const { userId } = await auth();  
        if(!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const body = await request.json();
        const { imagekit, userId: bodyUserId } = body;

        if(bodyUserId !== userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        if(!imagekit || !imagekit.url) return NextResponse.json({ error: "Invalide file upload." }, { status: 401 });

        const fileData = {
            name: imagekit.name || "Untitled",
            path: imagekit.filePath || `/droply/${userId}/${imagekit.name}`,
            size: imagekit.size || 0,
            type: imagekit.fileType || "image",
            fileUrl: imagekit.url,
            thumbnailUrl: imagekit.thumbnailUrl || null,
            userID: userId,
            parentID: null,
            isFolder: false,
            isStarred: false,
            isTrash: false,
        }

        const [ newFile ] = await db.insert(files).values(fileData).returning();
        return NextResponse.json(newFile);
    }catch(err: any){
        console.log("Error occurred while uploading files.", err);
        return NextResponse.json({ error: "Error uploading files." }, { status: 500 });
    }
}