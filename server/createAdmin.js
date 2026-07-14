import "dotenv/config";
import bcrypt from "bcryptjs";
import connectDB from "./config/db.js";
import User from "./models/User.js";

const createAdmin = async () => {
  try {
    await connectDB();

    const admin = await User.findOne({
      email: "admin@civix.com",
    });

    if (admin) {
      console.log("✅ Admin already exists.");
      process.exit();
    }

    const hashedPassword = await bcrypt.hash(
      "admin123",
      10
    );

    await User.create({
      fullName: "System Admin",
      email: "admin@civix.com",
      password: hashedPassword,
      role: "admin",
    });

    console.log("🎉 Admin Created Successfully!");
    console.log("Email : admin@civix.com");
    console.log("Password : admin123");

    process.exit();

  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

createAdmin();