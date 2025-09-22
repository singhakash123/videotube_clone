import { ApiError } from "../utils/ApiError.js";

export const verifyRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      throw new ApiError(403, "You are not authorized to access this resource");
    }
    next();
  };
};


/*
👉 Ye line authorization check karti hai:
!req.user → Agar user authenticated hi nahi hai (ya verifyAccessToken nahi chala).
!allowedRoles.includes(req.user.role) → Agar user authenticated hai, par uska role allowed roles me se ek bhi match nahi karta.
Example:

User role = "user"
Allowed roles = ["admin", "moderator"]
Condition true hogi → access deny.
*/

/*
router.get(
  "/admin-dashboard",
  verifyAccessToken,       // ✅ Check token
  verifyRole("admin"),     // ✅ Check role == admin
  adminDashboardController // ✅ Run controller only if both pass
);
*/