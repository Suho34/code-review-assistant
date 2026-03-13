import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const questions = [
  // Behavioral Questions
  {
    type: "behavioral",
    difficulty: "medium",
    question: "Tell me about a time you had to deal with a conflict within your team. How did you handle it?",
    tags: ["conflict resolution", "teamwork", "communication"],
    followUps: ["What was the outcome?", "Would you do anything differently next time?"]
  },
  {
    type: "behavioral",
    difficulty: "medium",
    question: "Describe a situation where you had to meet a tight deadline. How did you manage your time?",
    tags: ["time management", "pressure", "prioritization"],
    followUps: ["Did you have to cut any corners?", "How did you communicate the progress to stakeholders?"]
  },
  {
    type: "behavioral",
    difficulty: "hard",
    question: "Tell me about a time you failed at a project. What did you learn from it?",
    tags: ["failure", "learning", "resilience"],
    followUps: ["How did your team react?", "How did you apply that lesson in your next project?"]
  },
  {
    type: "behavioral",
    difficulty: "easy",
    question: "Why do you want to work for our company?",
    tags: ["motivation", "company culture", "career goals"],
    followUps: ["What specific products or projects of ours interest you?", "Where do you see yourself in 5 years?"]
  },
  {
    type: "behavioral",
    difficulty: "medium",
    question: "Describe a time when you received constructive criticism. How did you react?",
    tags: ["feedback", "growth mindset", "professionalism"],
    followUps: ["Can you give an example of how you implemented that feedback?", "Have you ever disagreed with feedback you received?"]
  },
  {
    type: "behavioral",
    difficulty: "medium",
    question: "Tell me about a time you took the initiative on a project without being asked.",
    tags: ["leadership", "initiative", "proactive"],
    followUps: ["What was the impact of your initiative?", "Did you face any resistance from your team?"]
  },
  {
    type: "behavioral",
    difficulty: "hard",
    question: "Describe a situation where you had to convince your team to adopt a new technology or process.",
    tags: ["persuasion", "leadership", "change management"],
    followUps: ["What data or metrics did you use to support your argument?", "How did you handle team members who were resistant to the change?"]
  },
  {
    type: "behavioral",
    difficulty: "medium",
    question: "Tell me about a time you had to work with a difficult stakeholder or client.",
    tags: ["client relations", "communication", "problem solving"],
    followUps: ["How did you ensure their needs were met while protecting your team?", "What was the final outcome?"]
  },
  {
    type: "behavioral",
    difficulty: "easy",
    question: "What is your proudest professional achievement?",
    tags: ["achievement", "motivation", "success"],
    followUps: ["What role did your team play in this achievement?", "What were the biggest challenges you overcame?"]
  },
  {
    type: "behavioral",
    difficulty: "medium",
    question: "Describe a time when you had to adapt to a sudden change in project requirements.",
    tags: ["adaptability", "flexibility", "agile"],
    followUps: ["How did you minimize the disruption to the team's workflow?", "What steps did you take to ensure the new requirements were met?"]
  },

  // Technical Questions
  {
    type: "technical",
    difficulty: "easy",
    question: "Explain the difference between SQL and NoSQL databases.",
    tags: ["databases", "sql", "nosql", "architecture"],
    followUps: ["When would you choose a NoSQL database over a SQL one?", "Can you explain ACID properties?"]
  },
  {
    type: "technical",
    difficulty: "medium",
    question: "What is a REST API and what are its core principles?",
    tags: ["api", "rest", "web development"],
    followUps: ["What is the difference between REST and GraphQL?", "How do you handle versioning in a REST API?"]
  },
  {
    type: "technical",
    difficulty: "medium",
    question: "Explain the concept of closures in JavaScript.",
    tags: ["javascript", "closures", "scope"],
    followUps: ["Can you provide a practical use case for closures?", "What are the potential downsides of using closures heavily?"]
  },
  {
    type: "technical",
    difficulty: "hard",
    question: "How does the virtual DOM work in React?",
    tags: ["react", "frontend", "performance", "dom"],
    followUps: ["What is the reconciliation process?", "When might the virtual DOM overhead be a disadvantage?"]
  },
  {
    type: "technical",
    difficulty: "medium",
    question: "Describe the differences between Server-Side Rendering (SSR) and Client-Side Rendering (CSR).",
    tags: ["rendering", "architecture", "frontend", "ssr", "csr"],
    followUps: ["What are the SEO implications of CSR?", "How does Static Site Generation (SSG) fit into this?"]
  },
  {
    type: "technical",
    difficulty: "hard",
    question: "Explain the concept of Event Sourcing and when to use it.",
    tags: ["architecture", "event sourcing", "system design", "CQRS"],
    followUps: ["How do you handle event schema changes over time?", "What is CQRS and how does it relate to Event Sourcing?"]
  },
  {
    type: "technical",
    difficulty: "medium",
    question: "What are Docker containers and how do they differ from virtual machines?",
    tags: ["docker", "devops", "containers", "virtualization"],
    followUps: ["What are some common use cases for Docker in a development workflow?", "Explain the purpose of a Docker Compose file."]
  },
  {
    type: "technical",
    difficulty: "medium",
    question: "Explain the concept of Dependency Injection.",
    tags: ["design patterns", "oop", "dependency injection", "solid"],
    followUps: ["How does Dependency Injection improve testability?", "Can you give an example of how you'd implement DI in your preferred language?"]
  },
  {
    type: "technical",
    difficulty: "hard",
    question: "How do you design a scalable microservices architecture?",
    tags: ["microservices", "system design", "scalability", "architecture"],
    followUps: ["How do you handle distributed transactions across microservices?", "What are the challenges of inter-service communication?"]
  },
  {
    type: "technical",
    difficulty: "medium",
    question: "What are the key differences between OAuth 2.0 and OpenID Connect?",
    tags: ["security", "authentication", "authorization", "oauth", "oidc"],
    followUps: ["What is an ID Token and how is it different from an Access Token?", "Explain the Authorization Code Flow."]
  },

  // DSA Questions
  {
    type: "dsa",
    difficulty: "easy",
    question: "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`. You may assume that each input would have exactly one solution, and you may not use the same element twice.",
    tags: ["arrays", "hash tables", "two sum"],
    followUps: ["Can you do this in O(n) time complexity?", "What if the array was already sorted?"]
  },
  {
    type: "dsa",
    difficulty: "easy",
    question: "Given a string `s`, determine if it is a palindrome, considering only alphanumeric characters and ignoring cases.",
    tags: ["strings", "two pointers", "palindrome"],
    followUps: ["How would you handle a continuous stream of characters?", "What is the space complexity of your solution?"]
  },
  {
    type: "dsa",
    difficulty: "medium",
    question: "Given the `head` of a linked list, return the list after reversing it.",
    tags: ["linked lists", "recursion", "iteration"],
    followUps: ["Can you implement both an iterative and a recursive solution?", "How would you reverse only a portion of the linked list?"]
  },
  {
    type: "dsa",
    difficulty: "medium",
    question: "Given an array of integers `nums`, find the contiguous subarray (containing at least one number) which has the largest sum and return its sum.",
    tags: ["arrays", "dynamic programming", "kadane's algorithm"],
    followUps: ["What is the time complexity of Kadane's algorithm?", "How would you return the start and end indices of the contiguous subarray?"]
  },
  {
    type: "dsa",
    difficulty: "medium",
    question: "Given a binary tree, return the level order traversal of its nodes' values. (i.e., from left to right, level by level).",
    tags: ["trees", "bfs", "queues"],
    followUps: ["How would you modify this to return a zigzag level order traversal?", "What is the maximum queue size during the traversal?"]
  },
  {
    type: "dsa",
    difficulty: "hard",
    question: "Given an array of integers `heights` representing the histogram's bar height where the width of each bar is 1, return the area of the largest rectangle in the histogram.",
    tags: ["stacks", "monotonic stack", "arrays"],
    followUps: ["Can you explain the intuition behind closing the monotonic stack?", "What are the time and space constraints for your optimal solution?"]
  },
  {
    type: "dsa",
    difficulty: "medium",
    question: "Implement a basic calculator to evaluate a simple expression string. The expression string may contain open `(` and closing parentheses `)`, the plus `+` or minus sign `-`, non-negative integers and empty spaces ` `.",
    tags: ["stacks", "math", "strings"],
    followUps: ["How would you extend this to handle multiplication and division?", "Can you solve this without using a stack?"]
  },
  {
    type: "dsa",
    difficulty: "hard",
    question: "Given a matrix, find the length of the longest increasing path. You can move up, down, left, or right, but not diagonally.",
    tags: ["matrices", "dfs", "memoization", "dynamic programming", "graphs"],
    followUps: ["Why is memoization necessary for an optimal solution?", "What is the worst-case scenario for time complexity?"]
  },
  {
    type: "dsa",
    difficulty: "medium",
    question: "Given a string `s` and a dictionary of strings `wordDict`, return true if `s` can be segmented into a space-separated sequence of one or more dictionary words.",
    tags: ["strings", "dynamic programming", "trie", "memoization"],
    followUps: ["How would you return all possible segmentations?", "Can you optimize the solution using a Trie data structure?"]
  },
  {
    type: "dsa",
    difficulty: "hard",
    question: "Merge `k` sorted linked lists and return it as one sorted list.",
    tags: ["linked lists", "heaps", "priority queues", "divide and conquer"],
    followUps: ["What is the time and space complexity of using a min-heap?", "Can you explain the divide and conquer approach, and compare its performance to the heap approach?"]
  }
]

async function main() {
  console.log('Start seeding questions...')
  
  // Clear existing questions (optional, depending on your needs)
  await prisma.question.deleteMany()
  
  for (const q of questions) {
    const question = await prisma.question.create({
      data: q,
    })
    console.log(`Created question with id: ${question.id}`)
  }
  
  console.log('Seeding finished.')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
