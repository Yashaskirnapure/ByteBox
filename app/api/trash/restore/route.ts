import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { sql } from "drizzle-orm";
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
        if(!Array.isArray(fileIds) || fileIds.length === 0) return NextResponse.json({ message: "Bad Request" }, { status: 400 });
        const formattedArray = `'{"${fileIds.join('","')}"}'`;

        await db.execute(sql`
        WITH RECURSIVE all_items AS (
            SELECT id FROM files WHERE id = ANY(${sql.raw(`${formattedArray}::uuid[]`)}) AND "userID" = ${userId}
            UNION
            SELECT f.id FROM files f
            INNER JOIN all_items ai ON f."parentID" = ai.id
            WHERE f."userID" = ${userId}
        )
        UPDATE files
        SET "isTrash" = false
        WHERE id IN (SELECT id FROM all_items)
        `);

        return NextResponse.json({ success: true, message: "Removed from trash" }, { status: 200 });
    }catch(err: any){
        console.log("Could not move to trash.", err);
        return NextResponse.json({ message: "Could not move to trash" }, { status: 500 });
    }
}