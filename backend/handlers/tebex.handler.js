import fetch from "node-fetch";
import crypto from "crypto";

export const getTebexPackages = async (req, res) => {
  try {
    const response = await fetch("https://plugin.tebex.io/packages", {
      headers: {
        "X-Tebex-Secret": process.env.TEBEX_SECRET,
      },
    });

    if (!response.ok) {
      return res
        .status(500)
        .json({ error: "Failed to fetch packages from Tebex" });
    }

    const data = await response.json();

    const filtered = data
      .filter((pkg) => pkg.category === "POUND AK Subscriptions")
      .map((pkg) => ({
        id: pkg.id,
        name: pkg.name,
        price: `$${pkg.price.toFixed(2)}`,
        description: pkg.description,
        category: pkg.category,
      }));

    res.status(200).json(filtered);
  } catch (error) {
    console.error("Tebex fetch error:", error);
    res.status(500).json({ error: "Server error fetching Tebex packages" });
  }
};

export const tebexPayment = async (req, res) => {
  // console.log(req.body);

  return res.status(200).json({ id: req.body.id });
};
