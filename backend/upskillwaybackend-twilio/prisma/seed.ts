import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@upskillway.com' },
    update: {},
    create: {
      email: 'admin@upskillway.com',
      name: 'Admin User',
      passwordHash: hashedPassword,
      role: 'sales',
      isActive: true,
    },
  });

  console.log('✅ Admin user created:', adminUser.email);

  // Create sample blog posts
  const sampleBlog = await prisma.blog.upsert({
    where: { slug: 'welcome-to-upskillway' },
    update: {},
    create: {
      title: 'Welcome to UpSkillWay',
      slug: 'welcome-to-upskillway',
      excerpt: 'Your journey to skill enhancement starts here',
      content: 'Welcome to UpSkillWay, where we help you enhance your skills and advance your career.',
      imageUrl: 'https://example.com/welcome.jpg',
      tags: ['welcome', 'introduction'],
      status: 'published',
      createdBy: adminUser.id,
    },
  });

  console.log('✅ Sample blog created:', sampleBlog.title);

  // Create sample study abroad record
  const existingStudyAbroad = await prisma.studyAbroad.findFirst({
    where: { city: 'Toronto' }
  });

  let sampleStudyAbroad;
  if (!existingStudyAbroad) {
    sampleStudyAbroad = await prisma.studyAbroad.create({
      data: {
        city: 'Toronto',
        imageUrl: 'https://example.com/toronto.jpg',
        universities: ['University of Toronto', 'York University', 'Ryerson University'],
        avgTuition: 25000,
        livingCost: 15000,
        description: 'Toronto offers world-class education with diverse cultural experiences.',
        tags: ['Canada', 'Engineering', 'Business'],
        status: 'published',
        createdBy: adminUser.id,
      },
    });
  } else {
    sampleStudyAbroad = existingStudyAbroad;
  }

  console.log('✅ Sample study abroad record created:', sampleStudyAbroad.city);

  // Create sample FAQ
  const existingFAQ = await prisma.fAQ.findFirst({
    where: { question: 'What is UpSkillWay?' }
  });

  let sampleFAQ: any;
  if (!existingFAQ) {
    sampleFAQ = await prisma.fAQ.create({
      data: {
        question: 'What is UpSkillWay?',
        answer: 'UpSkillWay is a comprehensive platform for skill development and career advancement.',
        category: 'general',
        createdBy: adminUser.id,
      },
    });
  } else {
    sampleFAQ = existingFAQ;
  }

  console.log('✅ Sample FAQ created:', sampleFAQ.question);

  console.log('🎉 Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });