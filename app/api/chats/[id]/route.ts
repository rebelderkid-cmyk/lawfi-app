import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// GET /api/chats/[id] - Get a specific chat with all messages
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    // First verify the chat belongs to the user
    const chat = await prisma.chat.findUnique({
      where: { id },
      select: {
        id: true,
        userId: true,
        title: true,
        user: {
          select: { email: true }
        }
      }
    })

    if (!chat || chat.user.email !== session.user.email) {
      return NextResponse.json({ error: "Chat not found" }, { status: 404 })
    }

    // Then fetch messages separately for better performance
    const messages = await prisma.message.findMany({
      where: { chatId: id },
      select: {
        id: true,
        role: true,
        content: true,
        createdAt: true
      },
      orderBy: { createdAt: 'asc' }
    })

    return NextResponse.json({
      chat: {
        ...chat,
        messages
      }
    })
  } catch (error) {
    console.error("Error fetching chat:", error)
    return NextResponse.json({ error: "Failed to fetch chat" }, { status: 500 })
  }
}

// POST /api/chats/[id] - Add a message to a chat
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { role, content } = await request.json()
    const { id } = await params

    // Verify the chat belongs to this user
    const chat = await prisma.chat.findFirst({
      where: {
        id,
        user: {
          email: session.user.email
        }
      }
    })

    if (!chat) {
      return NextResponse.json({ error: "Chat not found" }, { status: 404 })
    }

    // Create the message
    const message = await prisma.message.create({
      data: {
        chatId: id,
        role,
        content
      }
    })

    // Update the chat's updatedAt timestamp
    await prisma.chat.update({
      where: { id },
      data: { updatedAt: new Date() }
    })

    return NextResponse.json({ message })
  } catch (error) {
    console.error("Error creating message:", error)
    return NextResponse.json({ error: "Failed to create message" }, { status: 500 })
  }
}
