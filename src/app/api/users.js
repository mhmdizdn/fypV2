import prisma from '../lib/prisma';

export async function addUser(user) {
  try {
    // Check if email already exists (Prisma will handle this via the unique constraint)
    const existingUser = await prisma.user.findUnique({
      where: { email: user.email }
    });

    if (existingUser) {
      return { success: false, message: "Email already registered" };
    }
    
    // Add user to the database
    await prisma.user.create({
      data: {
        email: user.email,
        password: user.password, // In a real app, you should hash this password
        createdAt: user.createdAt || new Date()
      }
    });
    
    return { success: true, message: "Registration successful" };
  } catch (error) {
    console.error("Error adding user:", error);
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