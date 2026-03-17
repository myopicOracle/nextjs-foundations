'use server'

import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import postgres from 'postgres'

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' })

// define schema to validate formData
const FormSchema = z.object({
    id: z.string(),
    customerId: z.string(),
    amount: z.coerce.number(),
    status: z.enum(['pending', 'paid']),
    date: z.string(),
})

// omitting since we don't have id/date yet
const CreateInvoice = FormSchema.omit({ id: true, date: true })
const UpdateInvoice = FormSchema.omit({ id: true, date: true })

export async function createInvoice(formData: FormData) {
    const { customerId, amount, status } = CreateInvoice.parse({
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
    })
    const amountInCents = amount * 100
    const date = new Date().toISOString().split('T')[0]

    // Server Action
    try {
        await sql`
            INSERT INTO invoices (customer_id, amount, status, date)
            VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
        `
    } catch (e) {
        console.log(e)
        return {
            message: 'Database Error: Failed to create invoice.',
        }
    }

    // update cached route and redirect user
    revalidatePath('/dashboard/invoices')
    redirect('/dashboard/invoices') // throws own error so place after try/catch
}

export async function updateInvoice(id: string, formData: FormData) {
    const { customerId, amount, status } = UpdateInvoice.parse({
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
    })

    const amountInCents = amount * 100

    // Server Action
    try {
        await sql`
            UPDATE invoices
            SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
            WHERE id = ${id}
        `
    } catch (e) {
        console.log(e)

        return {
            message: 'Database Error: Failed to update invoice.',
        }
    }

    revalidatePath('/dashboard/invoices')
    redirect('/dashboard/invoices')
}

export async function deleteInvoice(id: string) {
    // manually added for uncaught exceptions during testing - remove before prod
    // throw new Error('Failed to Delete Invoice')

    await sql`DELETE FORM invoices WHERE id = ${id}`
    revalidatePath('/dashboard/invoices')
}
