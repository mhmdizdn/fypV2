import { authenticateUser } from '../users';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    // Parse the JSON request body
    const body = await request.json();
   
    // Basic validation
    if (!body.email || !body.password) {
      return NextResponse.json(
        { success: false, message: "Email and password are required" },
        { status: 400 }
      );
    }
   
    // Authenticate the user
    const result = await authenticateUser({
      email: body.email,
      password: body.password
    });
   
    if (result.success) {
      return NextResponse.json({ success: true, message: result.message }, { status: 200 });
    } else {
      return NextResponse.json({ success: false, message: result.message }, { status: 401 });
    }
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, message: "An error occurred during login" },
      { status: 500 }
    );
  }
}