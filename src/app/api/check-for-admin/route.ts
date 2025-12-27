import { NextRequest, NextResponse } from "next/server";
import User from "@/models/User";



export async function GET(req: NextRequest) {
    try {
        const user = await User.find({role:"ADMIN"});
        if(user.length>0){
            return NextResponse.json({adminExist:true},{status:200});
        } else{
            return NextResponse.json({adminExist:false},{status:200});
        }

        

    } catch (error) {
        return NextResponse.json(
            { message: `check for admin error ${error}` },
            { status: 500 }
        );
    }
}