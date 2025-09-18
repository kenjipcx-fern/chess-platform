import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { users } from '@/db/schema'
import { eq } from 'drizzle-orm'

export async function GET(request: NextRequest) {
  try {
    console.log('📡 API: Getting user profile...')
    
    // For demo purposes, get the first user from our seed data
    // In a real app, this would use authentication to get the current user
    const userList = await db.select().from(users).limit(1)
    
    if (userList.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'USER_NOT_FOUND',
            message: 'User not found',
          },
          timestamp: new Date(),
        },
        { status: 404 }
      )
    }

    const user = userList[0]
    
    // Remove sensitive data
    const { password_hash, ...safeUser } = user

    console.log('✅ API: User profile retrieved', { username: user.username })

    return NextResponse.json({
      success: true,
      data: safeUser,
      timestamp: new Date(),
    })

  } catch (error) {
    console.error('❌ API Error: Getting user profile', error)
    
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to retrieve user profile',
          details: process.env.NODE_ENV === 'development' ? error : undefined,
        },
        timestamp: new Date(),
      },
      { status: 500 }
    )
  }
}

// Update user profile
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('📡 API: Updating user profile...', body)

    // For demo purposes, update the first user
    const userList = await db.select().from(users).limit(1)
    
    if (userList.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'USER_NOT_FOUND',
            message: 'User not found',
          },
          timestamp: new Date(),
        },
        { status: 404 }
      )
    }

    const currentUser = userList[0]

    // Update user data
    const updatedUser = await db
      .update(users)
      .set({
        display_name: body.display_name || currentUser.display_name,
        bio: body.bio || currentUser.bio,
        preferences: body.preferences || currentUser.preferences,
        updated_at: new Date(),
      })
      .where(eq(users.id, currentUser.id))
      .returning()

    const { password_hash, ...safeUser } = updatedUser[0]

    console.log('✅ API: User profile updated', { username: safeUser.username })

    return NextResponse.json({
      success: true,
      data: safeUser,
      timestamp: new Date(),
    })

  } catch (error) {
    console.error('❌ API Error: Updating user profile', error)
    
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to update user profile',
          details: process.env.NODE_ENV === 'development' ? error : undefined,
        },
        timestamp: new Date(),
      },
      { status: 500 }
    )
  }
}
