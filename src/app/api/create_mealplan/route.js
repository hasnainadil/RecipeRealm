import { NextResponse } from "next/server";
import runQuery from "@/utils/database_manager";
import jwt from "jsonwebtoken";

export async function POST(request) {
    try {
        const reqBody = await request.json();
        const { title, duration, breakfast, lunch, dinner } = reqBody;
        const token = request.cookies.get("current_user")?.value || "";
        if (!token) {
            return NextResponse.json({ message: "No token", succss: false }, { status: 200 });
        }
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
        const id = decoded.id;
        //database query to be added here
        const query = `INSERT INTO MEAL_PLANS (PLAN_ID,USER_ID,PLAN_NAME,CREATION_DATE,DURATION) VALUES((SELECT COUNT(*)+1 from MEAL_PLANS),${id},'${title}',SYSDATE,${duration})`;
        await runQuery(query, true, {});
        for (let i = 0; i < breakfast.length; i++) {
            const q = `INSERT INTO MEAL_PLAN_RECIPES (PLAN_ID,RECIPE_ID,MEAL_SLOT) VALUES((SELECT COUNT(*) from MEAL_PLANS),${breakfast[i]},'breakfast')`;
            await runQuery(q, true, {});
        }
        for (let i = 0; i < lunch.length; i++) {
            const q = `INSERT INTO MEAL_PLAN_RECIPES (PLAN_ID,RECIPE_ID,MEAL_SLOT) VALUES((SELECT COUNT(*) from MEAL_PLANS),${lunch[i]},'lunch')`;
            await runQuery(q, true, {});
        }
        for (let i = 0; i < dinner.length; i++) {
            const q = `INSERT INTO MEAL_PLAN_RECIPES (PLAN_ID,RECIPE_ID,MEAL_SLOT) VALUES((SELECT COUNT(*) from MEAL_PLANS),${dinner[i]},'dinner')`;
            await runQuery(q, true, {});
        }
        return NextResponse.json({
            message: "Mealplan created successfully",
            success: true
        }, { status: 200 })
    } catch (err) {
        console.log(err);
        return NextResponse.json({ message: err.message, success: false }, { status: 500 })
    }
}