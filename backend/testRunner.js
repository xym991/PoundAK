// TestRunner.js

import User from "./models/User.js";

export default class TestRunner {
  constructor() {
    console.log("🧪 TestRunner initialized");
  }
  async deleteUserWithQuery(query) {
    try {
      const result = await User.deleteMany(query);
      console.log(
        `🗑️ Deleted ${result.deletedCount} user(s) with query:`,
        query
      );
    } catch (err) {
      console.error("❌ Failed to delete users with query:", query, err);
    }
  }

  async runAll() {
    console.log("🚀 Running all tests...");
    // await this.deleteUserWithQuery({ email: "xym9910@gmail.com" });
  }
}
