const connectionDB = require("./db/connection");
const User = require("./models/user");
const Query = require("./models/query");
const Answer = require("./models/answer");

// Seed script for DevQuery Platform
// This script populates the database with sample users, queries, and answers

connectionDB();

// Sample users
const sampleUsers = [
  {
    username: "alice_dev",
    email: "alice@example.com",
    password: "password123", // Will be hashed by the User model
  },
  {
    username: "bob_coder",
    email: "bob@example.com",
    password: "password123",
  },
  {
    username: "charlie_tech",
    email: "charlie@example.com",
    password: "password123",
  },
];

// Function to create sample users
async function createUsers() {
  try {
    // Clear existing users (optional - comment out if you want to keep existing users)
    await User.deleteMany({});
    console.log("Cleared existing users");

    // Create new users using save() to trigger password hashing
    const users = [];
    for (const userData of sampleUsers) {
      const user = new User(userData);
      await user.save(); // This triggers the pre('save') hook for password hashing
      users.push(user);
    }

    console.log("Created sample users:", users.map(u => u.username));
    return users;
  } catch (error) {
    console.log("Error creating users:", error);
    return [];
  }
}

// Function to create sample queries
async function createQueries(users) {
  try {
    if (users.length === 0) {
      console.log("No users available to create queries");
      return [];
    }

    // Clear existing queries (optional)
    await Query.deleteMany({});
    console.log("Cleared existing queries");

    const sampleQueries = [
      {
        title: "How to use async/await in JavaScript?",
        description: "I'm having trouble understanding how async/await works. Can someone explain with examples?",
        author: users[0]._id,
        tags: ["javascript", "async", "promises"],
      },
      {
        title: "Best practices for MongoDB schema design",
        description: "What are the best practices when designing schemas for MongoDB? Should I embed or reference documents?",
        author: users[1]._id,
        tags: ["mongodb", "database", "schema"],
      },
      {
        title: "React useState vs useReducer",
        description: "When should I use useState and when should I use useReducer? What are the differences?",
        author: users[2]._id,
        tags: ["react", "hooks", "state-management"],
      },
      {
        title: "How to deploy Node.js app to production?",
        description: "I've built a Node.js application and want to deploy it. What are the recommended hosting platforms and deployment strategies?",
        author: users[0]._id,
        tags: ["nodejs", "deployment", "production"],
      },
    ];

    const queries = await Query.insertMany(sampleQueries);
    console.log("Created sample queries:", queries.map(q => q.title));
    return queries;
  } catch (error) {
    console.log("Error creating queries:", error);
    return [];
  }
}

// Function to create sample answers
async function createAnswers(users, queries) {
  try {
    if (users.length === 0 || queries.length === 0) {
      console.log("No users or queries available to create answers");
      return [];
    }

    // Clear existing answers (optional)
    await Answer.deleteMany({});
    console.log("Cleared existing answers");

    const sampleAnswers = [
      {
        content: "Async/await is syntactic sugar over Promises. Use 'async' before a function and 'await' before a Promise to make asynchronous code look synchronous.",
        author: users[1]._id,
        query: queries[0]._id,
      },
      {
        content: "For MongoDB schema design, embed when data is accessed together and reference when data is large or accessed independently. Consider your query patterns!",
        author: users[2]._id,
        query: queries[1]._id,
      },
      {
        content: "Use useState for simple state and useReducer when you have complex state logic or multiple sub-values. useReducer is also better for state transitions.",
        author: users[0]._id,
        query: queries[2]._id,
      },
    ];

    const answers = await Answer.insertMany(sampleAnswers);
    console.log("Created sample answers:", answers.length);
    return answers;
  } catch (error) {
    console.log("Error creating answers:", error);
    return [];
  }
}

// Main seeding function
async function seedDatabase() {
  try {
    console.log("Starting database seeding...");

    const users = await createUsers();
    const queries = await createQueries(users);
    const answers = await createAnswers(users, queries);

    console.log("\n=== Seeding Complete ===");
    console.log(`Created ${users.length} users`);
    console.log(`Created ${queries.length} queries`);
    console.log(`Created ${answers.length} answers`);

    process.exit(0);
  } catch (error) {
    console.log("Error seeding database:", error);
    process.exit(1);
  }
}

// Run the seeding if this file is executed directly
if (require.main === module) {
  seedDatabase();
}

module.exports = {
  seedDatabase,
  createUsers,
  createQueries,
  createAnswers,
};
