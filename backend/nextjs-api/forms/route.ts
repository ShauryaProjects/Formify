import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/firebase'
import { getAuth } from 'firebase/auth'

export async function GET(request: NextRequest) {
  try {
    // For now, return empty array since we don't have forms yet
    // This will be implemented when the form builder is connected
    return NextResponse.json([])
  } catch (error) {
    console.error('Error fetching forms:', error)
    return NextResponse.json({ error: 'Failed to fetch forms' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    // TODO: Implement form creation
    return NextResponse.json({ message: 'Form creation not implemented yet' })
  } catch (error) {
    console.error('Error creating form:', error)
    return NextResponse.json({ error: 'Failed to create form' }, { status: 500 })
  }
}
