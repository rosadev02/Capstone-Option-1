const jwt = require("jsonwebtoken");
const jwksRsa = require("jwks-rsa");

const auth0Config = {
  domain: "dev-qa34wg5qwlph4ul8.us.auth0.com",
  audience: "https://dev-qa34wg5qwlph4ul8.us.auth0.com/api/v2/",
};

// Middleware para verificar o JWT
const checkJwt = (req, res, next) => {
  const token = req.headers.authorization;
  console.log(token);
  if (!token) {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }

  jwt.verify(
    token.replace("Bearer ", ""),
    jwksRsa.expressJwtSecret({
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 5,
      jwksUri: `https://${auth0Config.domain}/.well-known/jwks.json`,
    }),
    {
      audience: auth0Config.audience,
      issuer: `https://${auth0Config.domain}/`,
      algorithms: ["RS256"],
    },
    (err, decoded) => {
      if (err) {
        console.error("Error decoding token:", err);
        return res.status(401).json({ error: "Unauthorized: Invalid token" });
      }

      console.log("Decoded Token:", decoded);

      req.userId = decoded.userId;
      next();
    }
  );
};

module.exports = checkJwt;
