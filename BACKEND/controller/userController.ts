// controllers/userController.ts
import User from "../models/User.js";

export const completeProfile = async (req, res) => {
  try {
    const { userId } = req.user; // from JWT
    const { phone, dob, gender, stream, course, photoURL } = req.body;

    if (!phone || !dob || !gender || !stream || !course) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const existingUser = await User.findById(userId);
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // if user already has a role, keep it, else set visitor
    const role = existingUser.role || "visitor";

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        phone,
        dob,
        gender,
        stream,
        course,
        photoURL,
        isProfileComplete: true,
        role, // 👈 add default role
      },
      { new: true }
    );

    res
      .status(200)
      .json({ message: "Profile completed successfully", user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
