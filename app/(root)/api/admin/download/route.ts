import { auth } from "@/auth";
import { createReadStream, statSync } from "fs";
import { NextRequest, NextResponse } from "next/server";
import { join } from "path";

export async function GET(req: NextRequest){
    const session = await auth();
    //admin check
    const {searchParams} = new URL(req.url)
    const fileName = searchParams.get('file');

    if(!fileName){
        return NextResponse.json({success: false, message: "Nuk eshte specifikuar ndonje fajll"}, {status: 400})
    }

    if(fileName.includes("..")){
        return NextResponse.json({success: false, message: "Vend invalid"}, {status: 400})
    }

    const filePath = join(process.cwd(), 'public', fileName)    

    try {
        const stat = statSync(filePath);
        const stream = createReadStream(filePath);

        return new NextResponse(stream as any, {
            status: 200,
            headers: {
                "Content-Type": "application/octet-stream",
                "Content-Disposition": `attachment; filename="${fileName}"`,
                "Content-Length": stat.size.toString(),
            }
        })
    } catch (error) {
        console.error(error)
        return NextResponse.json({error: "Fajlli nuk u gjend"}, {status: 404})
    }
}