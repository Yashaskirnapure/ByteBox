import { files } from "@/src/db/schema";
import { db } from "@/src/db";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { eq, and } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";

import ImageKit from 'imagekit';
const imageKit = new ImageKit({
    publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
    urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!
});

export async function POST(request: NextRequest){
    try{
        const { userId } = await auth();
        if(!userId) return NextResponse.json({error: "Unauthorized" }, { status: 401 });

        const formData = await request.formData();
        const file = formData.get("file") as File;
        const formUserId = formData.get("userId") as string;
        const formParentId = (formData.get("parentId") as string) || null;

        console.log("-------------------------");
        console.log(userId);
        console.log(formUserId);
        console.log("-------------------------");

        if(userId !== formUserId) return NextResponse.json({error: "Unauthorized" }, { status: 401 });
        if(!file) return NextResponse.json({ error: "No file provided." }, { status: 400 });


        if(formParentId){
            const parentFolder = await db.select().from(files).where(and(eq(files.userID, userId), eq(files.id, formParentId), eq(files.isFolder, true)));
            if(!parentFolder) return NextResponse.json({ error: "Parent folder does not exist" }, { status: 404 });
        }

        if(!file.type.startsWith('/image') && file.type !== 'application/pdf')
            return NextResponse.json({ error: "Only images allowed." }, { status: 400 });

        const buffer = await file.arrayBuffer()
        const fileBuffer = Buffer.from(buffer);

        const filename = file.name;
        const fileExtension = file.name.split('.').pop() || "";
        const uniqueFilename = `${uuidv4()}.${fileExtension}`;
        const folderPath = formParentId ? `/bytebox/${userId}/folders/${formParentId}` : `/bytebox/${userId}`;

        const uploadResponse = await imageKit.upload({
            file: fileBuffer,
            fileName: uniqueFilename,
            folder: folderPath,
            useUniqueFileName: false,
        });

        const fileData = {
            name: filename,
            path: uploadResponse.filePath,
            size: file.size,
            type: file.type,
            fileUrl: uploadResponse.url,
            thumbnailUrl: uploadResponse.thumbnailUrl || null,
            userID: userId,
            parentID: formParentId,
            isFolder: false,
            isStarred: false,
            isTrash: false,
        };

        const [ newFile ] = await db.insert(files).values(fileData).returning();
        return NextResponse.json({ success: true, content: newFile, message: "File uploaded successfully." }, { status: 200 });
    }catch(err: any){
        console.log("Error while uploading.", err);
        return NextResponse.json({ message: "Something went wrong while uploading." }, { status: 500 });
    }
}