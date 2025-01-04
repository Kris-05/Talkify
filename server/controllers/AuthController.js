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
    await prisma.user.create({
      data: { email, name, about, profilePic }
    });

    return res.json({msg:"user created Successfully", status:true});
  } catch (error) {
    next(error);
  }
}