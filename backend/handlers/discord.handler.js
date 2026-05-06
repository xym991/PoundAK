import axios from "axios";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import createResponse from "../utils/response.js";
import dotenv from "dotenv";
dotenv.config();

const jwtSecret = process.env.JWT_SECRET;

function getDiscordAvatarUrl(userId, avatarHash, size = 1024) {
  if (!userId || !avatarHash) return null;
  const isGif = avatarHash.startsWith("a_");
  const format = isGif ? "gif" : "png";
  return `https://cdn.discordapp.com/avatars/${userId}/${avatarHash}.${format}?size=${size}`;
}

export async function auth(req, res) {
  const { code } = req.query;

  if (!code) {
    return res.status(400).send("Missing code");
  }

  try {
    const params = new URLSearchParams();
    params.append("client_id", process.env.DISCORD_CLIENT_ID);
    params.append("client_secret", process.env.DISCORD_CLIENT_SECRET);
    params.append("grant_type", "authorization_code");
    params.append("code", code);
    params.append("redirect_uri", process.env.BASE_URL + "/discord/auth");
    params.append("scope", "identify email");

    const tokenRes = await axios.post(
      "https://discord.com/api/oauth2/token",
      params,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const access_token = tokenRes.data.access_token;

    const userRes = await axios.get("https://discord.com/api/users/@me", {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    const data = userRes.data;
    const user = await User.findOne({ discordId: data.id });

    let token;
    let path;

    if (user) {
      token = jwt.sign({ userId: user._id }, jwtSecret, {
        expiresIn: "30d",
      });
      path = "/login";
    } else {
      const avatarUrl = getDiscordAvatarUrl(data.id, data.avatar);
      const newUser = new User({
        discordId: data.id,
        username: data.username,
        discriminator: data.discriminator,
        email: data.email,
        info: {
          image: avatarUrl,
          playerTag: data.username,
        },
        badges: ["tester"],
      });
      await newUser.save();
      token = jwt.sign({ userId: newUser._id }, jwtSecret, {
        expiresIn: "30d",
      });
      path = "/register";
    }

    if (!token) throw new Error("No token");
    const query = `token=${token}`;

    res.send(
      `
<!DOCTYPE html>
<html lang="en">
  <head>
    <style>
      @import url("https://fonts.googleapis.com/css2?family=Oxanium:wght@200..800&display=swap");

      body {
        margin: 0;
        padding: 0;
        display: flex;
        justify-content: center;
        height: 100vh;
        overflow: hidden;
        align-items: center;
        background: #000;
        color: white;
        flex-direction: column;
        font-family: "Oxanium", cursive !important;
      }

     #go {
        width: 100%;
        min-width: 100%;
        max-width: 100%;
        height: fit-content;
      }
      div {
        width: 1570px;
        max-width: 1570px;
        min-width: 1570px;
        height: fit-content;
        position: relative;
        transform: scale(0.9);
      }

      button {
        background: none;
        position: absolute;
        width: 397px;
        height: 57px;
        left: 454px;
        top: 535px;
        cursor: pointer;
      }

      div p {
        height: 60px;
        width: 400px;
        background: black;
        position: absolute;
        top: 56px;
        left: 193px;
      }

      h1 {
        margin-bottom: 0rem;
      }
    </style>
  </head>

  <body>
    <div>
      <img
        id="go"
        src="${process.env.BASE_URL}/images/redirect-bg.png"
        alt="Redirect Background"
      />
      <button id="btn"></button>
      <p></p>
    </div>
    <h1>Why Ads?</h1>
    <p>
      Ads fund this platform so we can keep it free and keep leveling it up.
    </p>
    <script>
      document.getElementById("btn").onclick = () => {
        window.location.href = "pound-ak://auth/${path}?${query}";
      };
    </script>
  </body>
</html>
      `
    );
  } catch (err) {
    console.error("OAuth Error:", err.response?.data || err.message);
    res.status(500).send("OAuth Error");
  }
}

export async function verify(req, res) {
  const discordId = req.body?.discord_id;

  if (!discordId) {
    return res.status(400).send("Missing discordId");
  }

  try {
    const user = await User.findOne({ discordId });

    if (!user) {
      return res.send({ valid: false });
    }

    if (!user.badges.includes("discord")) {
      user.badges.push("discord");
      await user.save();
    }

    res.send({ valid: true });
  } catch (err) {
    console.error("Verify Error:", err.message);
    res.status(500).send(createResponse("Server error", "error"));
  }
}
