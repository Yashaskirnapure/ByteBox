import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { files } from "@/src/db/schema";
import { db } from "@/src/db";
import { and, eq } from "drizzle-orm";

import ImageKit from 'imagekit';
const imageKit = new ImageKit({
    publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
    urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!
});

export async function DELETE(request: NextRequest){
    try{
        const { userId } = await auth();
        if(!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const searchParams = request.nextUrl.searchParams;
        const queryUserId = searchParams.get("userId");

        if(queryUserId && queryUserId !== userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        const trashedFiles = await db.select().from(files).where(and(eq(files.userID, userId),eq(files.isTrash, true)));

        if(trashedFiles.length == 0) return NextResponse.json({ message: "No files in trash." }, { status: 200 });
        const deletePromise = trashedFiles.filter((file) => file.isFolder === false && !!file.fileUrl).map(async (file) => {
            try{
                let imageKitId = null;
                if(file.fileUrl){
                    const fileUrlWithoutQuery = file.fileUrl.split('?')[0];
                    imageKitId = fileUrlWithoutQuery.split('/').pop();
                }

                if(imageKitId){
                    try{
                        const searchResults = await imageKit.listFiles({ name: imageKitId, limit: 1 });
                        const match = searchResults.find((f) => "fileId" in f);
                        if (match) await imageKit.deleteFile(match.fileId);
                        else await imageKit.deleteFile(imageKitId);
                    }catch(searchError){
                        console.log("Could not find file specified.", searchError);
                    }
                }
            }catch(err: any){
                console.log("Could not delete file", err);
            }
        });

        await Promise.allSettled(deletePromise);
        const deletedFiles = await db.delete(files).where(and(eq(files.userID, userId),eq(files.isTrash, true)));

        return NextResponse.json({ success: true, message: "File successfully deleted", content: deletedFiles }, { status: 200 });
    }catch(err: any){
        console.log("Could not empty trash.", err);
        return NextResponse.json({ message: "Could not empty trash" }, { status: 500 });
    }
}