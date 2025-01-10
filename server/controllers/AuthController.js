import getPrismaInstance from "../utils/PrismaClient.js";

export const checkUser = async (req, res, next) => {
  try {
    const { email } = req.body;
    if(!email) {
      return res.json({ msg: "Email is required", status: false });
    }

    const prisma = getPrismaInstance();

    const user = await prisma.user.findUnique({ where: { email }});
    if(!user) {
      return res.json({ msg: "User not found", status: false });
    } else {
      return res.json({ msg: "User found", status: true, data: user});
    }
  } catch (error) {
    next(error);
  }
};

export const onBoardUser = async (req,res,next) => {
  try {
    const { email, name, about, image:profilePic } = req.body;
    if(!email || !name || !profilePic)
      return res.send("Email, Name, Image are required");

    const prisma = getPrismaInstance();
    const user = await prisma.user.create({
      data: { email, name, about, profilePic }
    });

    return res.json({msg:"user created Successfully", status:true, user});
  } catch (error) {
    next(error);
  }
}

export const getAllUsers = async (req, res, next) => {
  try {
    const prisma = getPrismaInstance();
    // array
    const users = await prisma.user.findMany({
      orderBy: { name: "asc" },
      select: {
        id: true,
        email: true,
        name: true,
        profilePic: true,
        about: true
      }
    });
    const usersGroupedByIntitialLetter = {};

    users.forEach((user) => {
      // krisna - k => K
      const initialLetter = user.name.charAt(0).toUpperCase();
      if(!usersGroupedByIntitialLetter[initialLetter]) {
        // K =[]
        usersGroupedByIntitialLetter[initialLetter] = [];
      }
      // K = [krisna]
      usersGroupedByIntitialLetter[initialLetter].push(user);
    });

    return res.status(200).send({ users: usersGroupedByIntitialLetter });

  } catch (error) {
    next(error);
  }
}