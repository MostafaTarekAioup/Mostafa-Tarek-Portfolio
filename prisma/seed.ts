import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import Database from "better-sqlite3";
import * as fs from "fs";
import * as path from "path";

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL || "file:./dev.db",
});
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Starting seed...");

  // 1. Seed Profile
  await prisma.profile.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      fullName: "Mostafa Tarek Mostafa",
      title: "Front-End React Developer",
      bio: "front-end-developer (ReactJS), 1 year of experience Working on multinational company using React/Next.JS . optimizing web design for smartphones. balance functional design with esthetic design. use a variety of accent languages to write web pages. and I keep my skills updated and learning Modern technologies to make the website more interactive with users.",
      birthday: "11 / 11 / 1996",
      age: 26,
      degree: "Computer Science",
      phone: "01094855028",
      experience: "1 Year",
      graduationYear: "8 / 2020",
      militaryService: "exempt",
      city: "Cairo , Egypt",
      cvUrl: "/images/Mostafa-Tarek-Front-End-React.pdf",
      avatarUrl: "/images/MyPersonalImage.webp",
    },
  });
  console.log("✔ Profile seeded.");

  // 2. Seed Skills
  const legacySkills = [
    { title: "HTML", iconName: "FaHtml5", acquiredDate: "8/2018", sources: ["Udacity", "El-Zero Youtube Channel"], category: "Frontend", proficiency: 95 },
    { title: "CSS", iconName: "FaCss3Alt", acquiredDate: "9/2018", sources: ["Udacity", "El-Zero Youtube Channel"], category: "Frontend", proficiency: 95 },
    { title: "JavaScript", iconName: "FaJsSquare", acquiredDate: "10/2018", sources: ["Udacity"], category: "Frontend", proficiency: 90 },
    { title: "Js Dom", iconName: "FaJsSquare", acquiredDate: "12/2018", sources: ["Udacity", "El-Zero Youtube Channel"], category: "Frontend", proficiency: 90 },
    { title: "Js Bom", iconName: "FaJsSquare", acquiredDate: "1/2019", sources: ["El-Zero Youtube Channel"], category: "Frontend", proficiency: 85 },
    { title: "Bootstrap", iconName: "FaBootstrap", acquiredDate: "2/2019", sources: ["Documentation"], category: "Frontend", proficiency: 85 },
    { title: "JSON & AJAX", iconName: "FaJsSquare", acquiredDate: "3/2019", sources: ["Udacity"], category: "Core", proficiency: 85 },
    { title: "ES 6", iconName: "FaJsSquare", acquiredDate: "4/2019", sources: ["Udacity"], category: "Frontend", proficiency: 90 },
    { title: "Git/Github", iconName: "FaGithubSquare", acquiredDate: "5/2019", sources: ["El-Zero Youtube Channel"], category: "Tools", proficiency: 88 },
    { title: "React.js", iconName: "FaReact", acquiredDate: "6/2019", sources: ["El-Zero Youtube Channel"], category: "Frontend", proficiency: 92 },
  ];

  for (const skill of legacySkills) {
    const existing = await prisma.skill.findFirst({ where: { title: skill.title } });
    if (!existing) {
      await prisma.skill.create({
        data: {
          title: skill.title,
          iconName: skill.iconName,
          acquiredDate: skill.acquiredDate,
          sources: JSON.stringify(skill.sources),
          category: skill.category,
          proficiency: skill.proficiency,
        },
      });
    }
  }
  console.log("✔ Skills seeded.");

  // 3. Seed Education
  const legacyEducation = [
    {
      title: "Computer Science",
      institution: "Faculity of Science Zagazig University Computer Science Department",
      period: "2015-2020",
      description: "Bachelor of Computer Science studying core algorithms, databases, OS, networks, and AI.",
      courses: ["database", "artificial intelligence", "algorithm", "computer network", "operating system", "c++ programming", "wireless network", "formal language"],
      certificateUrl: null,
    },
    {
      title: "Udacity Nanodegree",
      institution: "Udacity",
      period: "7-2019 / 9-2019",
      description: "Front-End Web Developer Nanodegree covering modern JavaScript, responsive web design, DOM manipulation, and asynchronous programming.",
      courses: ["Html", "Css", "Responsive", "Markdown", "Javascript", "Js Dom", "Js OOP", "Web Accessibility", "Js Design Pattern", "Js Promises", "Service Worker"],
      certificateUrl: "https://confirm.udacity.com/R4EJP6MK",
    },
  ];

  for (const edu of legacyEducation) {
    const existing = await prisma.education.findFirst({ where: { title: edu.title } });
    if (!existing) {
      await prisma.education.create({
        data: {
          title: edu.title,
          institution: edu.institution,
          period: edu.period,
          description: edu.description,
          courses: JSON.stringify(edu.courses),
          certificateUrl: edu.certificateUrl,
        },
      });
    }
  }
  console.log("✔ Education seeded.");

  // 4. Seed Projects from content.md or fallback
  let projectsData: any[] = [];
  try {
    const contentPath = "C:\\Users\\Mostafa\\.gemini\\antigravity\\brain\\44c6d9e3-911a-4cbc-87e0-3b8d443995c3\\.system_generated\\steps\\26\\content.md";
    if (fs.existsSync(contentPath)) {
      const contentText = fs.readFileSync(contentPath, "utf-8");
      const lines = contentText.split("\n");
      for (const line of lines) {
        if (line.trim().startsWith("[{")) {
          projectsData = JSON.parse(line.trim());
          break;
        }
      }
    }
  } catch (e) {
    console.warn("Could not read projects from content.md, using backup list...", e);
  }

  if (projectsData.length === 0) {
    projectsData = [
      { id: 1, title: "birthday reminder", img: "https://i.ibb.co/CPrHNtZ/b1.webp", link: "https://birthdayreminder-react.netlify.app/", tags: ["react", "trainning"] },
      { id: 2, title: "Tours", img: "https://i.ibb.co/SrR5Pmv/b2.webp", link: "https://admiring-darwin-adfdec.netlify.app/", tags: ["react", "trainning"] },
      { id: 3, title: "Review", img: "https://i.ibb.co/xXtjz7Q/b3.webp", link: "https://review-react-app.netlify.app", tags: ["react", "trainning"] },
      { id: 4, title: "Accordion", img: "https://i.ibb.co/JxydnLC/b4.webp", link: "https://accordion-react-pro.netlify.app", tags: ["react", "trainning"] },
      { id: 5, title: "Menu", img: "https://i.ibb.co/LYDWWcQ/b5.webp", link: "https://our-menu-react.netlify.app", tags: ["react", "trainning"] },
      { id: 6, title: "Tabs", img: "https://i.ibb.co/89Fs5cv/b6.webp", link: "https://tabs-example-react.netlify.app", tags: ["react", "trainning"] },
      { id: 7, title: "Slider", img: "https://i.ibb.co/DGxjbCF/b7.webp", link: "https://react-slider-slider.netlify.app", tags: ["react", "trainning"] },
    ];
  }

  for (const proj of projectsData) {
    const existing = await prisma.project.findFirst({ where: { title: proj.title } });
    if (!existing) {
      await prisma.project.create({
        data: {
          title: proj.title,
          imgUrl: proj.img || proj.imgUrl || "https://i.ibb.co/CPrHNtZ/b1.webp",
          liveLink: proj.link || proj.liveLink || "#",
          tags: JSON.stringify(proj.tags || ["react"]),
        },
      });
    }
  }
  console.log(`✔ ${projectsData.length} Projects seeded.`);

  console.log("🎉 Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
