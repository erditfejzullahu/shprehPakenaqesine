import {faker} from "@faker-js/faker"
import * as bcrypt from "bcrypt"
import prisma from "../lib/prisma";
import { Category, ComplaintStatus, ResolvedStatus } from "../app/generated/prisma";

async function main(){
    console.log('starting seed');

    await prisma.users.deleteMany();
    await prisma.companies.deleteMany();
    await prisma.complaint.deleteMany();

    const hashedPassword = await bcrypt.hash("erditbaba1!.", 10);

    const user = await prisma.users.create({
        data: {
            username: "Anonimi",
            password: hashedPassword,
            createdAt: new Date().toISOString(),
            gender: "MASHKULL",
            acceptedUser: true,
            email: "erditfejzullahu45@gmail.com",
            email_verified: true,
            reputation: 0,
            anonimity: false
        }
    })
    console.log(`User ${user.username} created...`)

    // Create industries for realistic company data
  const industries = [
    'Technology',
    'Healthcare',
    'Finance',
    'Education',
    'Retail',
    'Manufacturing',
    'Construction',
    'Transportation',
    'Energy',
    'Telecommunications',
    'Hospitality',
    'Entertainment'
  ];

  const usedNames = new Set<string>();
  
  // Create 50 companies
  const companies = [];
  for (let i = 0; i < 50; i++) {
    let name: string;
    let attempts = 0;
    
    // Ensure unique company name
    do {
      name = faker.company.name();
      attempts++;
      if (attempts > 10) {
        // Fallback if we can't generate a unique name
        name = `${faker.company.name()} ${faker.number.int({ min: 1, max: 1000 })}`;
      }
    } while (usedNames.has(name));
    
    usedNames.add(name);

    const company = await prisma.companies.create({
      data: {
        name,
        description: faker.company.catchPhrase(),
        logoUrl: faker.image.urlLoremFlickr({ category: 'business' }),
        address: `${faker.location.streetAddress()}, ${faker.location.city()}, ${faker.location.state()}, ${faker.location.zipCode()}`,
        website: faker.internet.url(),
        email: faker.internet.email(),
        phone: faker.phone.number(),
        images: ([
          faker.image.urlLoremFlickr({ category: 'business' }),
          faker.image.urlLoremFlickr({ category: 'office' })
        ]),
        industry: industries[Math.floor(Math.random() * industries.length)],
        foundedYear: faker.date.past({ years: 30 }).getFullYear(),
      }
    });
    companies.push(company);
  }
  console.log(`Created ${companies.length} companies...`);

  // Get all enum values
  const categories = Object.values(Category);
  const statuses = Object.values(ComplaintStatus);
  const resolvedStatuses = Object.values(ResolvedStatus)

  // Create 200 complaints spread across companies
  const complaints = [];
  for (let i = 0; i < 200; i++) {
    const randomCompany = companies[Math.floor(Math.random() * companies.length)];
    const randomDate = faker.date.between({ 
      from: '2020-01-01', 
      to: new Date() 
    });

    const complaint = await prisma.complaint.create({
      data: {
        companyId: randomCompany.id,
        title: `Complaint about ${faker.word.adjective()} ${faker.word.noun()}`,
        description: faker.lorem.paragraphs(3),
        status: statuses[Math.floor(Math.random() * statuses.length)],
        category: categories[Math.floor(Math.random() * categories.length)],
        createdAt: randomDate,
        attachments: ([
          faker.image.urlLoremFlickr({ category: 'business' }),
          faker.image.urlLoremFlickr({ category: 'office' })
        ]),
        updatedAt: faker.date.between({ 
          from: randomDate, 
          to: new Date() 
        }),
        resolvedStatus:  resolvedStatuses[Math.floor(Math.random() * resolvedStatuses.length)],
        userId: user.id
      }
    });
    complaints.push(complaint);
  }
  console.log(`Created ${complaints.length} complaints...`);
  console.log('Seed completed successfully!');
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    })