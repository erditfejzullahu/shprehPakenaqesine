import { auth } from "@/auth"
import { Session } from "next-auth";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";

export const isAdmin = async (path: string): Promise<boolean> => {
    const session = await auth();
    if(!session || session.user.role !== "ADMIN") return redirect(path)
    return true;
}
export type AdminApiType = Session | NextResponse
export const isAdminApi = async (): Promise<Session | NextResponse> => {
    const session = await auth();
    if(!session || session.user.role !== "ADMIN") return NextResponse.json({success: false, message: "Ju nuk jeni te autorizuar per kryerjen e ketij veprimi"}, {status: 401});
    return session;
}