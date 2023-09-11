import { NextResponse } from "next/server";
import runQuery from "@/utils/database_manager";
import oracledb from "oracledb";

export async function GET(req) {
    let catagory = req.nextUrl.searchParams.get("catagory");
    let search = req.nextUrl.searchParams.get("search");
    if(!search)
    {
        search = '';
    }
    if(!catagory)
    {
        catagory = '';
    }
    const query = `
    select * from (
    SELECT RECIPE_ID, TITLE, (SELECT (FIRST_NAME||' '||LAST_NAME) AS NAME FROM USERS WHERE USER_ID = R.USER_ID) as PUBLISHER_NAME,TO_CHAR(CREATION_DATE,'DD/MON/YY') CREATION_DATE , COOKING_INSTRUCTION ,AVERAGE_RATING(RECIPE_ID) as RATING,(SELECT IMAGE FROM MEDIA WHERE RECIPE_ID = R.RECIPE_ID)AS IMAGE
FROM RECIPES R
WHERE RECIPE_ID IN (SELECT RECIPE_ID FROM CATEGORIZES WHERE CATEGORY_ID = (SELECT CATEGORY_ID FROM CATEGORIES WHERE LOWER(NAME) LIKE LOWER(:CATAGORY)))
AND 
LOWER(TITLE) LIKE LOWER('%'||:SEARCH||'%')
ORDER BY NVL(AVERAGE_RATING(RECIPE_ID), 0) DESC
) where rownum <= 100
    `;
    const binds = {
        CATAGORY: {dir: oracledb.BIND_IN, val: catagory, type: oracledb.STRING},
        SEARCH: {dir: oracledb.BIND_IN, val: search, type: oracledb.STRING}
    }
    try {
        const result = await runQuery(query,false, binds);
        return NextResponse.json({ data: result.rows,totoal:result.rows.length, success: true }, { status: 200 });
    }
    catch (err) {
        return NextResponse.json({ message: err.message, success: false }, { status: 500 });
    }
}