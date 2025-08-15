import { getPrismaClient } from "../utils/prismaClient.js";

const prisma = getPrismaClient();

export const searchContacts = async (req, res, next) => {
  try {
    const { searchTerm } = req.body;

    if (!searchTerm) {
      return res.status(400).json({
        success: false,
        message: "Search term required",
      });
    }

    // Escape regex special characters to prevent injection
    const cleanedTerm = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    // Search in DB
    const contacts = await prisma.user.findMany({
      where: {
        profileSetup: true,
        OR: [
          { name: { contains: cleanedTerm, mode: "insensitive" } },
          // { email: { contains: cleanedTerm, mode: "insensitive" } },
        ],
      },
      select: {
        id: true,
        name: true,
        email: true,
        profilePic: true,
      },
      take: 20, // limit results for performance
    });

    return res.status(200).json({
      success: true,
      contacts,
    });
  } catch (error) {
    console.error("Error searching contacts:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
