import { NextRequest, NextResponse } from "next/server";
import runQuery from "@/utils/database_manager";
import jwt from 'jsonwebtoken'

export async function POST(request) {
    try {
        const data = await request.formData();
        const token = request.cookies.get("current_user")?.value || "";
        if (!token) {
            return NextResponse.json({ message: "No token", succss: false }, { status: 200 });
        }
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
        const user_id = decoded.id;
        const file = data.get('file')
        const title = data.get('title')
        const cookingTime = data.get('cookingTime')
        const preparationTime = data.get('preparationTime')
        const instructions = data.get('instructions')
        const ingredients = data.get('selectedIngredients')
        const tags = data.get('selectedTags')
        const categories = data.get('selectedCategories')
        const query = `INSERT INTO RECIPES (TITLE,COOKING_INSTRUCTION,PREPARATION_TIME,COOKING_TIME,USER_ID,CREATION_DATE) VALUES('${title}', '${instructions}',${preparationTime},${cookingTime},${user_id},SYSDATE)`
        await runQuery(query, true, {})
        const recipe_id = await runQuery(`SELECT MAX(RECIPE_ID) as RECIPE_ID FROM RECIPES`, false, {}).rows[0].RECIPE_ID
        for (let i = 0; i < ingredients.length; i++) {
            const q = `INSERT INTO RECIPE_INGREDIENTS (RECIPE_ID,INGREDIENT_ID,QUANTITY) VALUES ((SELECT MAX(RECIPE_ID) FROM RECIPES),${ingredients[i]},NULL)`
            await runQuery(q, true, {})
        }
        for (let i = 0; i < tags.length; i++) {
            const q = `INSERT INTO RECIPE_TAGS (RECIPE_ID,TAG_ID) VALUES ((SELECT MAX(RECIPE_ID) FROM RECIPES),${tags[i]})`
            await runQuery(q, true, {})
        }
        for (let i = 0; i < categories.length; i++) {
            const q = `INSERT INTO CATEGORIZES (RECIPE_ID,CATEGORY_ID) VALUES((SELECT MAX(RECIPE_ID) FROM RECIPES),${categories[i]})`
            await runQuery(q, true, {})
        }
        if (!file) {
            return NextResponse.json({ success: false })
        }
        const bytes = await file.arrayBuffer()
        const filename = `${recipe_id}.png`
        await writeFile(`./public/recipe_images/${filename}`, buffer)
    } catch (err) {
        console.log(err)
        return NextResponse.json({ success: false, massage: err })
    }

}