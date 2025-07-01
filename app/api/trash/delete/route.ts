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
        if(!request.body) return NextResponse.json({ message: "Bad Request" }, { status: 400 });

        const requestBody = await request.json();
        const { fileIds } = requestBody;
        if(!Array.isArray(fileIds) || fileIds.length === 0) return NextResponse.json({ message: "Bad Request" }, { status: 400 });
        const formattedArray = `'{"${fileIds.join('","')}"}'`;

        const trashedFiles = formattedArray;

        if(trashedFiles.length == 0) return NextResponse.json({ message: "No files in trash." }, { status: 200 });
        const deletePromise = 

        await Promise.allSettled(deletePromise);
        const deletedFiles = await db.delete(files).where(and(eq(files.userID, userId),eq(files.isTrash, true)));

        return NextResponse.json({ success: true, message: "File successfully deleted", content: deletedFiles }, { status: 200 });
    }catch(err: any){
        console.log("Could not empty trash.", err);
        return NextResponse.json({ message: "Could not empty trash" }, { status: 500 });
    }
}