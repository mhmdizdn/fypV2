// app/api/register/route.js
import { addUser } from '../users';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    // Parse the JSON request body
    const body = await request.json();
    console.log("Registration attempt:", body);
   
    // Basic validation
    if (!body.email || !body.password) {
      console.log("Validation failed: missing email or password");
      return NextResponse.json(
        { success: false, message: "Email and password are required" },
        { status: 400 }
      );
    }
   
    // Add the user
    console.log("Attempting to add user to database...");
    const result = await addUser({
      name: body.name,
      email: body.email,
      password: body.password,
      createdAt: new Date()
    });
   
    console.log("Add user result:", result);
    
    if (result.success) {
      return NextResponse.json({ success: true, message: result.message }, { status: 201 });
    } else {
      return NextResponse.json({ success: false, message: result.message }, { status: 400 });
    }
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { success: false, message: "An error occurred during registration" },
      { status: 500 }
    );
  }
}