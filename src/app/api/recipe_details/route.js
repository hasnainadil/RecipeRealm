import { NextRequest, NextResponse } from "next/server";
import oracledb from "oracledb";
import runQuery from "@/utils/database_manager";
import jwt from 'jsonwebtoken'

export async function GET(request) {
    const id = request.nextUrl.searchParams.get("id")
    let recipeId;
    const token = request.cookies.get('current_user')?.value || ''
    let userId;
    try {
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
        userId = decoded.id;
    }
    catch (err) {
        userId = 0
    }
    try {
        if (id) {
            recipeId = Number(id);
        }
        else {
            throw new Error("No recipe id");
        }
        const query = `
        BEGIN
        RECIPE_DETAILS(:ID,:STATUS,:RECIPES_CR ,:INGREDIENTS_CR,:CATEGORIES_CR,:TAGS_CR,:REVIEWS_CR,:MEDIA_CR,:SUB_INGREDIENT_CR,:NEUTRITION_CR,:IS_FAV,:TEMP_USER_ID);
        END;`;
        const binds = {
            ID: { dir: oracledb.BIND_IN, type: oracledb.NUMBER, val: recipeId },
            STATUS: { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 40 },
            RECIPES_CR: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
            INGREDIENTS_CR: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
            CATEGORIES_CR: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
            TAGS_CR: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
            REVIEWS_CR: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
            MEDIA_CR: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
            SUB_INGREDIENT_CR: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
            NEUTRITION_CR: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
            IS_FAV: { dir: oracledb.BIND_OUT, type: oracledb.STRING },
            TEMP_USER_ID: { dit: oracledb.BIND_IN, type: oracledb.NUMBER, val:userId}
        }
        const result = await runQuery(query, false, binds);
        if (result.outBinds.STATUS !== "SUCCESSFUL") {
            throw new Error(result.outBinds.STATUS);
        }
        const recipeSet = result.outBinds.RECIPES_CR;
        let recipe;
        let recipes = [];
        while ((recipe = await recipeSet.getRow())) {
            console.log(recipe.COOKING_INSTRUCTION)
            recipe.COOKING_INSTRUCTION = recipe.COOKING_INSTRUCTION.split(".");
            recipes.push(recipe);
        }
        recipeSet.close();
        const ingredientSet = result.outBinds.INGREDIENTS_CR;
        let ingredient;
        let ingredients = [];
        while ((ingredient = await ingredientSet.getRow())) {
            ingredients.push(ingredient);
        }
        ingredientSet.close();
        const categorySet = result.outBinds.CATEGORIES_CR;
        let category;
        let categories = [];
        while ((category = await categorySet.getRow())) {
            categories.push(category);
        }
        categorySet.close();
        const tagSet = result.outBinds.TAGS_CR;
        let tag;
        let tags = [];
        while ((tag = await tagSet.getRow())) {
            tags.push(tag);
        }
        tagSet.close();
        const reviewSet = result.outBinds.REVIEWS_CR;
        let review;
        let reviews = [];
        while ((review = await reviewSet.getRow())) {
            reviews.push(review);
        }
        reviewSet.close();
        const mediaSet = result.outBinds.MEDIA_CR;
        let media;
        let medias = [];
        while ((media = await mediaSet.getRow())) {
            medias.push(media);
        }
        mediaSet.close();
        const subIngredientSet = result.outBinds.SUB_INGREDIENT_CR;
        let subIngredient;
        let subIngredients = [];
        while ((subIngredient = await subIngredientSet.getRow())) {
            subIngredients.push(subIngredient);
        }
        subIngredientSet.close();
        const nutritionSet = result.outBinds.NEUTRITION_CR;
        let nutrition;
        let nutritions = [];
        while ((nutrition = await nutritionSet.getRow())) {
            nutritions.push(nutrition);
        }
        nutritionSet.close();
        return NextResponse.json({
            success: true,
            isFav:(result.outBinds.IS_FAV?.toLowerCase?.() === 'true'),
            userId:userId,
            recipes: recipes,
            ingredients: ingredients,
            categories: categories,
            tags: tags,
            reviews: reviews,
            medias: medias,
            subIngredients: subIngredients,
            nutritions: nutritions
        }, { status: 200 });

    }
    catch (err) {
        return NextResponse.json({
            success: false,
            message: err.message
        }, { status: 500 });
    }


}