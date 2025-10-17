import { sql } from '@vercel/postgres'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, surname, phone } = body

    if (!name || !surname || !phone) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    // Basic phone validation (at least 9 digits)
    const phoneRegex = /[\d\s+()-]{9,}/
    if (!phoneRegex.test(phone)) {
      return NextResponse.json(
        { error: 'Invalid phone format' },
        { status: 400 }
      )
    }

    // Create table if it doesn't exist
    await sql`
      CREATE TABLE IF NOT EXISTS submissions (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        surname VARCHAR(255) NOT NULL,
        phone VARCHAR(255) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `

    // Insert submission
    await sql`
      INSERT INTO submissions (name, surname, phone)
      VALUES (${name}, ${surname}, ${phone})
    `

    return NextResponse.json(
      { message: 'Submission successful!' },
      { status: 201 }
    )

  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}