import { NextRequest, NextResponse } from "next/server";
import dbConnect from "../util/mongodb";

export async function middleware(req: NextRequest) {
    
    // const db = await dbConnect();   
    // console.log(db);
    

  return NextResponse.next();
}
