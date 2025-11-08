import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// GET /api/chats - Get all chats for the current user
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get all chats for this user, ordered by most recent
    const chats = await prisma.chat.findMany({
      where: {
        user: {
          email: session.user.email
        }
      },
      include: {
        messages: {
          take: 1, // Just get the first message for preview
          orderBy: {
            createdAt: 'asc'
          }
        },
        _count: {
          select: { messages: true }
        }
      },
      orderBy: {
        updatedAt: 'desc'
      }
    })

    return NextResponse.json({ chats })
  } catch (error) {
    console.error("Error fetching chats:", error)
    return NextResponse.json({ error: "Failed to fetch chats" }, { status: 500 })
  }
}

// POST /api/chats - Create a new chat
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { title } = await request.json()

    // Find the user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Create a new chat
    const chat = await prisma.chat.create({
      data: {
        userId: user.id,
        title: title || "New Conversation"
      }
    })

    return NextResponse.json({ chat })
  } catch (error) {
    console.error("Error creating chat:", error)
    return NextResponse.json({ error: "Failed to create chat" }, { status: 500 })
  }
}
