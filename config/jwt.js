const SECRET = process.env.JWT_SECRET || "fitness_platform_secret_key_change_in_production";
const EXPIRES_IN = "7d";

module.exports = {
    SECRET,
    EXPIRES_IN
};
