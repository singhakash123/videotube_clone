---
---

-------------------------------- authorizeRoles -------------------------------------------------------

## authorizeRoles → reads req.user.role and checks if it's allowed

import { ApiError } from "../utils/ApiError.js";

export const authorizeRoles = (...allowedRoles) => {
return (req, \_ , next) => {
const userRole = req.user?.role;

    if (!userRole || !allowedRoles.includes(userRole)) {
      throw new ApiError(403, "You are not authorized to access this resource");
    }

    next(); // allow access

};
};
/\*

authorizeRoles("ADMIN")
authorizeRoles("SELLER", "EDITOR")
authorizeRoles("USER", "ADMIN", "MOD")

_/
/_
// constants/roles.js
export const ROLES = {
USER: "user",
ADMIN: "admin",
MODERATOR: "moderator"
};

Then use: authorizeRoles(ROLES.ADMIN)
_/
/_
router.get(
"/admin-or-mod-access",
verifyAccessToken,
authorizeRoles("admin", "moderator"), // Both can access
(req, res) => {
res.send("Hello Admin or Moderator");
}
);

How it works:
verifyAccessToken: ensures user is logged in and sets req.user.
authorizeRoles("admin"): checks if req.user.role === "admin".
If not, throws 403 Forbidden.

_/
/_
const userRole = req.user?.role;

✅ Full Flow: How req.user?.role Works
🔐 1. User Logs In
When a user logs in, we generate a JWT access token that includes their \_id (or even role if you want).
// payload inside JWT
const token = jwt.sign({ \_id: user.\_id }, process.env.SECRET_KEY);

🛡️ 2. verifyAccessToken Middleware
This middleware decodes the JWT and finds the user from DB and attaches it to req.user

// middlewares/auth.middleware.js
export const verifyAccessToken = asyncHandler(async (req, res, next) => {
const token = req.cookies?.accessToken || req.headers.authorization?.replace("Bearer ", "");

if (!token) {
throw new ApiError(401, "Token missing");
}

const decoded = jwt.verify(token, process.env.ACCESSTOKEN_SECRETKEY);
const user = await User.findById(decoded.\_id); // Find user from DB

if (!user) {
throw new ApiError(401, "User not found");
}

req.user = user; // 👈 THIS IS THE KEY STEP
next();
});

🎯 3. Now req.user is Available
Once you add req.user = user, any middleware or controller after that has access to the full user object.

const userRole = req.user?.role;
You're safely accessing the user role using optional chaining (?.) to avoid crashing if req.user is undefined.
router.get(
"/admin-only",
verifyAccessToken, // ✅ Adds req.user
authorizeRoles("admin"), // ✅ Reads req.user.role
(req, res) => {
res.send("Admin access granted");
}
);
So:

verifyAccessToken → finds the user and sets req.user
authorizeRoles → reads req.user.role and checks if it's allowe

\*/

----------------------------------------- mongodb hooks-------------------------------------------------------
mongodb hooks :
-- Mongoose hooks, also known as middleware, allow you to execute custom logic before or after specific database operations in a Node.js environment.
-- These operations include saving, validating, removing, or querying documents.
-- They are a powerful feature for enhancing data manipulation, validation, security, and automation in MongoDB applications.
Types of hooks
Mongoose offers different types of hooks:
Pre-hooks: Execute before the main operation.
Post-hooks: Execute after the main operation.

Specific pre-hooks:
Some specific pre-hooks include pre('save'), pre('validate'), pre('remove'), pre('init'), and pre('findOneAndUpdate')
:
Important considerations
When using Mongoose hooks, remember that they are asynchronous by default and the this context varies by hook type. Multiple hooks can be chained for the same event.
In essence, Mongoose hooks provide a flexible way to add custom logic to your MongoDB applications, improving functionality and maintainability.
💡 In Mongoose, the value of this depends on what type of middleware you're using:
:
📄 1. Document Middleware
Used for: save, validate, remove, etc.

Here, this refers to the actual document you’re working with (an instance of your model)
userSchema.pre('save', function (next) {
// 👉 'this' is the document being saved
if (!this.isModified('password')) return next();
this.password = hash(this.password);
next();
});
✅ Use case: You want to modify fields like password, timestamps, etc., before saving.

🔍 2. Query Middleware
Used for: find, findOne, update, deleteMany, etc.
Here, this refers to the query object, not the actual document.
userSchema.pre('find', function () {
// 👉 'this' is the query, not the document
this.where({ isActive: true });
});
🧠 Summary Table:
Middleware Type this Refers To Example Hook
Document Middleware The actual document save, validate
Query Middleware The query object find, update

--------------------------------------------------- cloduniary and multer -----------------------------------------------

--------------------------------------------------- Aggriagatin paginate -----------------------------------------------

```

```
