import prisma from '../lib/prisma';

export async function addUser(user) {
  try {
    console.log('Attempting to add user:', { ...user, password: '[REDACTED]' });
    
    const existingUser = await prisma.user.findUnique({
      where: { email: user.email }
    });

    if (existingUser) {
      console.log('User already exists:', user.email);
      return { success: false, message: "Email already registered" };
    }
    
    const newUser = await prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
        password: user.password,
        createdAt: user.createdAt || new Date()
      }
    });
    
    console.log('User created successfully:', newUser.id);
    return { success: true, message: "Registration successful" };
  } catch (error) {
    console.error("Detailed error:", {
      message: error.message,
      code: error.code,
      meta: error.meta
    });
    return { success: false, message: "Database error occurred" };
  }
}

export async function authenticateUser(credentials) {
  try {
    // Find user by email and password
    const user = await prisma.user.findFirst({
      where: {
        email: credentials.email,
        password: credentials.password // Again, in a real app, you would compare hashed passwords
      }
    });
    
    if (user) {
      return { success: true, message: "Login successful" };
    } else {
      return { success: false, message: "Invalid email or password" };
    }
  } catch (error) {
    console.error("Error authenticating user:", error);
    return { success: false, message: "Database error occurred" };
  }
}

// For development purposes only - to see registered users
export async function getUsers() {
  try {
    return await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        createdAt: true,
        // Not returning passwords in this query for security
      }
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
}