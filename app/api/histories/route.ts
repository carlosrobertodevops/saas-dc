import connect from '@/app/lib/connect';
import HistoryData from '@/app/models/HistorySchema';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { id, clerkUserId, template, title, createdAt, totalWords, content } =
      await req.json(); // Adjust fields based on your model

    // Simple validation
    if (
      !clerkUserId ||
      !id ||
      !template ||
      !createdAt ||
      !totalWords ||
      !content ||
      !title
    ) {
      return NextResponse.json({ error: 'All fields are required' });
    }

    const newHistory = new HistoryData({
      id,
      clerkUserId,
      template,
      title,
      createdAt,
      totalWords,
      content,
    });

    // Save the entry to the database
    await newHistory.save();

    return NextResponse.json({
      message: 'History entry successfully created!',
      history: newHistory,
    });
  } catch (error) {
    return NextResponse.json({
      message: 'Error adding history entry',
    });
  }
}

export async function GET(req: Request) {
  try {
    // Extract clerkUserId from query parameters
    const { searchParams } = new URL(req.url);
    const clerkUserId = searchParams.get('clerkUserId');

    // Simple validation
    if (!clerkUserId) {
      return NextResponse.json({ error: 'clerkUserId is required' });
    }

    // Fetch history entries based on clerkUserId
    const historyEntries = await HistoryData.find({ clerkUserId });

    return NextResponse.json({
      message: 'History entries retrieved successfully!',
      histories: historyEntries,
    });
  } catch (error) {
    return NextResponse.json({
      message: 'Error retrieving history entries',
    });
  }
}

export async function DELETE(req: Request) {
  try {
    // Get the query parameters (history id)
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    // Simple validation to check if the id is provided
    if (!id) {
      return NextResponse.json(
        { error: 'History ID is required' },
        { status: 400 },
      );
    }

    // Find and delete the history entry based on the id
    const deletedHistory = await HistoryData.findOneAndDelete({ id });

    if (!deletedHistory) {
      return NextResponse.json(
        { error: 'History entry not found' },
        { status: 404 },
      );
    }

    // Return a success message
    return NextResponse.json({
      message: 'History entry successfully deleted',
      deletedHistory,
    });
  } catch (error) {
    console.error('Error deleting history:', error);
    return NextResponse.json(
      { error: 'Error deleting history entry' },
      { status: 500 },
    );
  }
}
