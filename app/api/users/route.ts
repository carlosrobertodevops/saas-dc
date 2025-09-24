// pages/api/users.ts
import { NextApiRequest, NextApiResponse } from "next";
import connect from "@/app/lib/connect";
import User from "@/app/models/UserSchema";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { id, email } = await req.json(); // Adjust fields based on your model

  // Simple validation
  if (!email || !id) {
    return NextResponse.json({ error: "All fields are required" });
  }

  try {
    await connect();
    const newUser = {
      clerkUserId: id,
      emailAddress: email,
      isPro: false,
      accumulatedWords: 0,
    };
    await User.create(newUser);

    return NextResponse.json({
      message: "User added successfully",
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to add user", details: error });
  }
}

// GET Method: Retrieve user properties (isPro, accumulatedWords) based on user id
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  // Validate if userId is provided
  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  try {
    await connect();
    const user = await User.findOne({ clerkUserId: userId }).select(
      "isPro accumulatedWords"
    );

    // If user not found
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Return the user's isPro and accumulatedWords fields
    return NextResponse.json(
      {
        isPro: user.isPro,
        accumulatedWords: user.accumulatedWords,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch user data", details: error },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  const { id, isPro, accumulatedWords } = await req.json(); // Fields to update

  // Simple validation
  if (!id) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  console.log("accumulated words", accumulatedWords);

  try {
    await connect();
    // Find the user by ID and update the fields
    const updatedUser = await User.findOneAndUpdate(
      { clerkUserId: id },
      { isPro: isPro, accumulatedWords: accumulatedWords },
      { new: true } // Return the updated document
    );

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "User updated successfully",
      updatedUser,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update user", details: error },
      { status: 500 }
    );
  }
}
