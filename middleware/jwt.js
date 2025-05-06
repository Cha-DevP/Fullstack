import jwt from "jsonwebtoken";

const PUBLIC_KEY = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA12PUGbtrJmPP4jacg7kA
wxcE2Bpd5tOA1gJXBqUUxa7sGKImQrelC8Ap+OcRNWUusMZkRWoBapj8E17VnE6R
qTWKGesKFuIb2NxAXR34Wpfb3rTQDHb/4D/8pa5+vIPZbxSEDfNhaNqRj9jve30N
2OQ3pkqNnyJlTb/SUSvLLvEpkt6sURVLkqQIQY2SCe7hiBn2dnVwca+uJ8Z0sPRG
kznsCkBXtVIrRv6KUjs7dDC0wkc+5+1ApR1GN9fm/t0TbuFvmCMLccBMpTL5d+r6
Rqb9z/65GfbJLqmJy1iG8SRZOoPwE1/SmR7C6pLpOnL3EoesOOHTQwM2idUD8BZW
7wIDAQAB
-----END PUBLIC KEY-----`;

export const verifyJWT = (req, res, next) => {
  const auth_key = req?.headers?.authorization;

  if (!auth_key || !auth_key?.startsWith("Bearer ")) {
    console.log("unauthorized => ", req?.headers);
    return res.status(401).json({ resultCode: 401, message: "Unauthorized" });
  }

  const token = auth_key?.split(" ")[1];
  jwt?.verify(
    token,
    PUBLIC_KEY,
    {
      algorithms: "RS256",
    },
    (err, plainCode) => {
      if (err) {
        if (err?.name === "TokenExpiredError") {
          console.log(`token is expired`);
          return res
            .status(401)
            .json({ resultCode: 401, message: "Session is expired" });
        } else {
          console.log(`${req?.headers}\t Forbidden on jwt decode error`);
          return res
            .status(403)
            .json({ resultCode: 403, message: "Forbidden" });
        }
      }

      req.id = plainCode?.id;
      req.username = plainCode?.username;
      req.role = plainCode?.role;
      next();
    }
  );
};