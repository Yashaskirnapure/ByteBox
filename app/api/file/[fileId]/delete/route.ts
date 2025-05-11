import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/src/db";
import { files } from "@/src/db/schema";
import { and, eq } from "drizzle-orm";

const { ImageKit } = require('imagekit');
const imageKit = new ImageKit({
    publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT
});

export async function DELETE(request: NextRequest, props: { params: Promise<{ fileId: string }> }){
    try{
        const { userId } = await auth();
        if(!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const { fileId } = await props.params;
        const searchParams = request.nextUrl.searchParams;
        const queryUserId = searchParams.get("userId") as string;

        if(!fileId) return NextResponse.json({ message: "Bad Request" }, { status: 400 });
        if(queryUserId && queryUserId !== userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const [ file ] = await db.select().from(files).where(and(eq(files.id, fileId), eq(files.userID, userId), eq(files.isFolder, false)));
        if(!file) return NextResponse.json({ message: "File not found" }, { status: 404 });

        if(!file.isTrash) return NextResponse.json({ message: "Bad Request." }, { status: 400 });

        if(!file.isFolder){
            try {
                let imagekitId = null;
                if (file.fileUrl) {
                    const urlWithoutQuery = file.fileUrl.split("?")[0];
                    imagekitId = urlWithoutQuery.split("/").pop();
                }
        
                if (!imagekitId && file.path) imagekitId = file.path.split("/").pop();
        
                if (imagekitId){
                    try{
                        const searchResults = await imageKit.listFiles({
                            name: imagekitId,
                            limit: 1,
                        });
        
                        if (searchResults && searchResults.length > 0) await imageKit.deleteFile(searchResults[0].fileId);
                        else await imageKit.deleteFile(imagekitId);
                    }catch(searchError){
                        console.error(`Error searching for file in ImageKit:`, searchError);
                        await imageKit.deleteFile(imagekitId);
                    }
                }
            
            }catch (error) {
                console.error(`Error deleting file ${fileId} from ImageKit:`, error);
            }
        }

        const [ deletedFile ] = await db.delete(files).where(and(eq(files.id, fileId), eq(files.userID, queryUserId))).returning();
        return NextResponse.json({ message: "File deleted.", content: deletedFile }, { status: 200 });
    }catch(err: any){
        console.log("Error while deleting.", err);
        return NextResponse.json({ message: "Could not star file. Try again later" }, { status: 500 });
    }
}