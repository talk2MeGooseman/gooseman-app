require('dotenv').config();

export default {
  clientId: process.env.PATREON_CLIENT_ID || "",
  clientSecret: process.env.PATREON_SECRET || "",
}
