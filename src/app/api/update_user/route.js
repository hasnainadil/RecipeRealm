import { NextRequest,NextResponse } from "next/server";
import runQuery from "@/utils/database_manager";

export async function POST(request)
{
    const reqBody = await request.json();
    const {user_id, first_name, last_name, emailAddress, old_PASSWORD, PASSWORD, password_confirmation, dietaryRestriction } = reqBody;
    console.log(user_id,first_name,last_name,emailAddress,old_PASSWORD,PASSWORD,password_confirmation,dietaryRestriction);
    try{
        return NextResponse.json({success:true});
    }
    catch(err){
        console.log(err);
        return NextResponse.json({success:false});
    }
}