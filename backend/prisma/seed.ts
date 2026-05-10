import prisma from '../src/config/database';
import bcrypt from 'bcrypt';

async function main() {
  console.log('🌱 Seeding database...');
 
  // Créer un utilisateur de test
  const hashedPassword = await bcrypt.hash('password123', 10);
  
  const user = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      email: 'test@example.com',
      username: 'testuser',
      password: hashedPassword,
    },
  });
 
  console.log('✅ User created:', user.email);

  // Créer un livre de test
  const book = await prisma.book.upsert({
    where: { slug: 'loup-solitaire-01' },
    update: {},
    create: {
      title: 'Vol pour le Sommerlund',
      slug: 'loup-solitaire-01',
      author: 'Joe Dever',
      series: 'Loup Solitaire',
      seriesIndex: 1,
      description: 'Vous êtes Loup Solitaire, dernier survivant des Kaï...',
      isPublished: true,
    },
  });

  console.log('✅ Book created:', book.title);

  // Créer quelques passages
  const passage1 = await prisma.passage.upsert({
    where: {
      bookId_number: {
        bookId: book.id,
        number: 1,
      },
    },
    update: {},
    create: {
      bookId: book.id,
      number: 1,
      title: 'Le début de l\'aventure',
      content: 'Vous vous réveillez dans le monastère des Kaï...',
      type: 'normal',
    },
  });

  console.log('✅ Passage created:', passage1.number);

  // Créer des choix pour le passage 1
  await prisma.choice.createMany({
    data: [
      {
        passageId: passage1.id,
        text: 'Explorer les environs',
        targetPassageNumber: 2,
      },
      {
        passageId: passage1.id,
        text: 'Prendre la route du sud',
        targetPassageNumber: 3,
      },
    ],
    skipDuplicates: true,
  });

  console.log('✅ Choices created for passage 1');

  // Créer un personnage de test
  const character = await prisma.character.create({
    data: {
      userId: user.id,
      bookId: book.id,
      name: 'Loup Gris',
      skill: 15,
      skillMax: 15,
      endurance: 25,
      enduranceMax: 25,
      gold: 10,
      disciplines: ['La Chasse', 'Puissance Psychique'],
      masteredWeapon: 'Épée',
      currentPassageNumber: 1,
    },
  });

  console.log('✅ Character created:', character.name);

  console.log('🎉 Seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });