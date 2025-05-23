import { PrismaClient } from "@prisma/client/extension"

const prisma = new PrismaClient()

async function main() {
  // Clear existing data
  await prisma.post.deleteMany()
  await prisma.user.deleteMany()

  // Create sample users
  await prisma.user.createMany({
    data: [
      { email: 'alice@example.com', name: 'Alice' },
      { email: 'bob@example.com', name: 'Bob' }
    ]
  })

  // Create sample posts
  await prisma.post.createMany({
    data: [
      {
        title: 'Hello World',
        content: 'This is my first post',
        published: true,
        authorId: 1
      },
      {
        title: 'My First Post',
        content: "This is Bob's first post",
        published: true,
        authorId: 2
      }
    ]
  })

  console.log('Seeding completed successfully!')
}

main()
  .catch((e) => {
    console.error('Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })