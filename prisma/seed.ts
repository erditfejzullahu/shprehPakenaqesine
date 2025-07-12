import {faker} from "@faker-js/faker"
import * as bcrypt from "bcrypt"
import prisma from "..//lib/prisma";

async function main(){
    console.log('starting seed');

    const hashedPassword = await bcrypt.hash("erditbaba1!.", 10);

    const user = await prisma.users.create({
        data: {
            nickName: "Anonimi",
            password: hashedPassword,
            createdAt: new Date().toISOString()
        }
    })
    console.log(`User ${user.nickName} created...`)

    const companies = [];

    for (let i = 0; i < 20; i++) {
        const companyName = faker.company.name();
        const foundedYear = faker.date.past().getFullYear().toString()
        const phoneNumber = faker.helpers.replaceSymbols('+383#######');
        const company = await prisma.companies.create({
            data: {
              name: companyName,
              description: faker.lorem.paragraphs(2),
              logoUrl: faker.image.urlLoremFlickr({ category: 'business' }),
              address: `${faker.location.streetAddress()}, ${faker.location.city()}, Kosovo`,
              website: faker.internet.url(),
              email: faker.internet.email({ provider: 'company.com' }),
              phone: faker.datatype.boolean() ? phoneNumber : `0${phoneNumber.substring(4)}`,
              images: Array.from({ length: 3 }, () => faker.image.urlLoremFlickr({ category: 'business' })).join(','),
              industry: faker.commerce.department(),
              foundedYear: foundedYear,
              acceptedRequest: faker.datatype.boolean(),
            },
          });
      
          companies.push(company);
          console.log(`Created company: ${company.name}`);
    }
    console.log(`✅ Created ${companies.length} companies`);
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    })