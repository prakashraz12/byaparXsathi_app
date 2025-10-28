import { idxGenerator } from "@/utils/idx.utils"
import database from ".."
import { DB_COLLECTION } from "../collection"
import Expenses from "../model/expenses.model"
import { responseHandler } from "../util/response-handler"

export const financeService = {
    createExpenses: async (data: Partial<Expenses> & { shopId: string }) => {
        console.log("data", data, "shopId", data.shopId)
        if (!data.amount || !data.title || !data.shopId) {
            return responseHandler({
                data: null,
                success: false,
                message: "Missing required fields",
                statusCode: 400,
            })
        }

        try {
            const id = idxGenerator()
            let createdExpense = null

            await database.write(async () => {
                createdExpense = await DB_COLLECTION.expenses.create((expense) => {
                    expense._raw.id = id
                    expense.amount = data.amount!
                    expense.title = data.title!
                    expense.remarks = data.remarks || ""
                    expense.shopId = data.shopId
                    expense.created_at = data.created_at || Date.now()
                    expense.updated_at = Date.now()
                })
            })


            return responseHandler({
                data: createdExpense,
                success: true,
                message: "Expense created successfully",
                statusCode: 201,
            })
        } catch (error) {
            return responseHandler({
                data: null,
                success: false,
                message: "Something went wrong",
                statusCode: 500,
            })
        }
    },

    getSingleExpenses: async (id: string) => {
        try {
            const expense = await DB_COLLECTION.expenses.find(id)
            return responseHandler({
                data: expense,
                success: true,
                message: "Expense fetched successfully",
                statusCode: 200,
            })
        } catch (error: any) {
            if (typeof error?.message === "string" && error.message.toLowerCase().includes("not found")) {
                return responseHandler({
                    data: null,
                    success: false,
                    message: "Expense not found",
                    statusCode: 404,
                })
            }
            return responseHandler({
                data: null,
                success: false,
                message: "Something went wrong",
                statusCode: 500,
            })
        }
    },
    updateExpenses: async (id: string, data: Partial<Expenses>) => {
        try {
            if (!id || data.amount === undefined || data.title === undefined) {
                return responseHandler({
                    data: null,
                    success: false,
                    message: "Missing required fields",
                    statusCode: 400,
                })
            }

            let updatedExpense: any = null

            await database.write(async () => {
                const expense = await DB_COLLECTION.expenses.find(id)
                if (!expense) {
                    return responseHandler({
                        data: null,
                        success: false,
                        message: "Expense not found",
                        statusCode: 404,
                    })
                }
                await expense.update((e) => {
                    if (data.amount !== undefined) e.amount = data.amount!
                    if (data.title !== undefined) e.title = data.title!
                    if (data.remarks !== undefined) e.remarks = data.remarks!
                    if (data.created_at !== undefined) e.created_at = data.created_at!
                    e.updated_at = Date.now()
                })
                updatedExpense = expense
            })

            console.log("Updated Expense:", updatedExpense)

            return responseHandler({
                data: updatedExpense,
                success: true,
                message: "Expense updated successfully",
                statusCode: 200,
            })
        } catch (error: any) {
            console.log("Error updating expense:", error)

            if (
                typeof error?.message === "string" &&
                error.message.toLowerCase().includes("not found")
            ) {
                return responseHandler({
                    data: null,
                    success: false,
                    message: "Expense not found",
                    statusCode: 404,
                })
            }

            return responseHandler({
                data: null,
                success: false,
                message: "Something went wrong",
                statusCode: 500,
            })
        }
    },
    deleteExpenses: async (id: string) => {
        try {
            await database.write(async () => {
                const expense = await DB_COLLECTION.expenses.find(id)
                if (!expense) {
                    return responseHandler({
                        data: null,
                        success: false,
                        message: "Expense not found",
                        statusCode: 404,
                    })
                }
                await expense.markAsDeleted()
            })
            return responseHandler({
                data: null,
                success: true,
                message: "Expense deleted successfully",
                statusCode: 200,
            })
        } catch (error) {
            return responseHandler({
                data: null,
                success: false,
                message: "Something went wrong",
                statusCode: 500,
            })
        }
    },

    createSaving: async () => { },
}
