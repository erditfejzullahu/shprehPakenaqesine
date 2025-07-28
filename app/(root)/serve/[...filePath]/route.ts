import { createReadStream, existsSync } from "fs";
import { NextRequest } from "next/server";
import path from "path";
import mime from "mime"

export const GET = async (req: NextRequest, {params}: {params: Promise<{filePath?: string[]}>}) => {
    const {filePath} = await params;
    if(!filePath || !filePath.length){
        return new Response("Invalid path", {status: 400})
    }

    console.log(filePath, ' filepath');
    
    
    const fileDir = path.join(process.cwd(), 'public', ...filePath)
    console.log(fileDir, '  filedir');
    
    if(fileDir.includes("..")){
        return new Response('Invalid path', {status: 400})
    }

    if(!existsSync(fileDir)){
        return new Response('File not found', {status: 404})
    }

    const contentType = mime.getType(fileDir) || "application/octet-stream"

    const dangerousTypes = ['application/x-msdownload', 'application/x-sh', 'application/x-bat'] 
    if (dangerousTypes.includes(contentType)) {
        return new Response('Blocked file type', { status: 403 })
    }

    const fileStream = createReadStream(fileDir);

    return new Response(fileStream as any, {
        status: 200,
        headers: {
            'Content-Type': contentType,
            'Cache-Control': 'public, max-age=31536000, immutable',
            'Content-Disposition': `inline; filename="${path.basename(fileDir)}"`,
        },
    })
}