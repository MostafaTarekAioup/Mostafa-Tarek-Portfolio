import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import * as fs from "fs";

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL || "file:./dev.db",
});
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Starting seed with updated CV and legacy projects...");

  // 1. Seed Profile from new CV
  const profileData = {
    fullName: "Mostafa Tarek Mostafa",
    title: "Frontend Engineer (React)",
    bio: "Frontend Developer with 4+ years of experience building scalable web applications and micro-frontend architectures. Skilled in delivering high-quality services, creating reusable components, and collaborating with cross-functional teams to translate business needs into seamless user experiences. Seeking to build dynamic, high-performance interfaces.",
    birthday: "11 / 11 / 1996",
    age: 28,
    degree: "Computer Science",
    phone: "+201094855028",
    experience: "4+ Years",
    graduationYear: "08 / 2020",
    militaryService: "Exempt",
    city: "Cairo / Egypt",
    cvUrl: "/images/Mostafa Tarek_Aioup_CV.pdf",
    avatarUrl: "/images/MyPersonalImage.webp",
  };

  await prisma.profile.upsert({
    where: { id: 1 },
    update: profileData,
    create: { id: 1, ...profileData },
  });
  console.log("✔ Profile updated with 4+ years exp & new CV link.");

  // 2. Seed Skills from CV
  const allSkills = [
    { title: "HTML5", iconName: "FaHtml5", acquiredDate: "2018", sources: ["Udacity", "Experience"], category: "Frontend", proficiency: 98 },
    { title: "CSS3 / SCSS", iconName: "FaCss3Alt", acquiredDate: "2018", sources: ["Udacity", "Experience"], category: "Frontend", proficiency: 95 },
    { title: "JavaScript (ES6+)", iconName: "FaJsSquare", acquiredDate: "2018", sources: ["Udacity", "Watania"], category: "Frontend", proficiency: 95 },
    { title: "TypeScript", iconName: "Code", acquiredDate: "2021", sources: ["Experience", "Documentation"], category: "Frontend", proficiency: 92 },
    { title: "React.js", iconName: "FaReact", acquiredDate: "2019", sources: ["Udacity", "Watania", "Techsquad"], category: "Frontend", proficiency: 96 },
    { title: "Next.js", iconName: "FaReact", acquiredDate: "2021", sources: ["Experience", "Documentation"], category: "Frontend", proficiency: 90 },
    { title: "Redux & State", iconName: "Code", acquiredDate: "2020", sources: ["Experience", "Udacity"], category: "Frontend", proficiency: 92 },
    { title: "MUI 5 & Bootstrap", iconName: "FaBootstrap", acquiredDate: "2019", sources: ["Experience"], category: "Frontend", proficiency: 90 },
    { title: "YUP & Formik", iconName: "Code", acquiredDate: "2021", sources: ["Watania Solutions"], category: "Frontend", proficiency: 88 },
    { title: "Vitest & Cypress", iconName: "Code", acquiredDate: "2022", sources: ["Experience", "Testing"], category: "Tools", proficiency: 85 },
    { title: "Git & GitHub", iconName: "FaGithubSquare", acquiredDate: "2018", sources: ["Experience"], category: "Tools", proficiency: 94 },
    { title: "Micro-frontends", iconName: "Layers", acquiredDate: "2023", sources: ["Watania Solutions (SAIP)"], category: "Architecture", proficiency: 90 },
  ];

  for (const skill of allSkills) {
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
    } else {
      await prisma.skill.update({
        where: { id: existing.id },
        data: {
          proficiency: skill.proficiency,
          category: skill.category,
          sources: JSON.stringify(skill.sources),
        },
      });
    }
  }
  console.log("✔ Skills seeded/updated.");

  // 3. Seed Education
  const legacyEducation = [
    {
      title: "Computer Science",
      institution: "Zagazig University",
      period: "09/2015 – 08/2020",
      description: "Bachelor of Computer Science studying core algorithms, databases, OS, networks, and AI.",
      courses: ["database", "artificial intelligence", "algorithm", "computer network", "operating system", "c++ programming", "wireless network", "formal language"],
      certificateUrl: null,
    },
    {
      title: "Front-End Web Developer Nanodegree",
      institution: "Udacity",
      period: "07/2019 – 09/2019",
      description: "Front-End Web Developer Nanodegree covering modern JavaScript, responsive web design, DOM manipulation, and asynchronous programming.",
      courses: ["Html", "Css", "Responsive Design", "Javascript", "DOM", "Web Accessibility", "ES6+", "Promises", "Service Worker"],
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

  // 4. Seed Projects (Both professional enterprise projects from CV & legacy training projects)
  const projectsData = [
    {
      title: "SAIP IP Portal (Watania Solutions)",
      imgUrl: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80",
      liveLink: "https://saip.gov.sa",
      tags: ["React", "Micro-frontend", "Next.js", "Production", "WCAG"],
    },
    {
      title: "Elevenstats Player Analytics (Techsquad)",
      imgUrl: "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80",
      liveLink: "https://elevenstats.com",
      tags: ["React", "Charts", "API", "Statistics", "Production"],
    },
    {
      title: "KLU Enterprise Application",
      imgUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
      liveLink: "https://github.com/MostafaTarekAioup",
      tags: ["React", "ES6+", "Architecture", "Production"],
    },
    {
      title: "TAHAQQ Component Library & Squad Lead",
      imgUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
      liveLink: "https://github.com/MostafaTarekAioup",
      tags: ["React", "Performance", "Scalability", "Production"],
    },
    {
      title: "birthday reminder",
      imgUrl: "https://i.ibb.co/CPrHNtZ/b1.webp",
      liveLink: "https://birthdayreminder-react.netlify.app/",
      tags: ["react", "training", "legacy"],
    },
    {
      title: "Tours",
      imgUrl: "https://i.ibb.co/SrR5Pmv/b2.webp",
      liveLink: "https://admiring-darwin-adfdec.netlify.app/",
      tags: ["react", "training", "legacy"],
    },
    {
      title: "Review",
      imgUrl: "https://i.ibb.co/xXtjz7Q/b3.webp",
      liveLink: "https://review-react-app.netlify.app",
      tags: ["react", "training", "legacy"],
    },
    {
      title: "Accordion",
      imgUrl: "https://i.ibb.co/JxydnLC/b4.webp",
      liveLink: "https://accordion-react-pro.netlify.app",
      tags: ["react", "training", "legacy"],
    },
    {
      title: "Menu",
      imgUrl: "https://i.ibb.co/LYDWWcQ/b5.webp",
      liveLink: "https://our-menu-react.netlify.app",
      tags: ["react", "training", "legacy"],
    },
    {
      title: "Tabs",
      imgUrl: "https://i.ibb.co/89Fs5cv/b6.webp",
      liveLink: "https://tabs-example-react.netlify.app",
      tags: ["react", "training", "legacy"],
    },
    {
      title: "Slider",
      imgUrl: "https://i.ibb.co/DGxjbCF/b7.webp",
      liveLink: "https://react-slider-slider.netlify.app",
      tags: ["react", "training", "legacy"],
    },
  ];

  for (const proj of projectsData) {
    const existing = await prisma.project.findFirst({ where: { title: proj.title } });
    if (!existing) {
      await prisma.project.create({
        data: {
          title: proj.title,
          imgUrl: proj.imgUrl,
          liveLink: proj.liveLink,
          tags: JSON.stringify(proj.tags),
        },
      });
    } else {
      await prisma.project.update({
        where: { id: existing.id },
        data: {
          imgUrl: proj.imgUrl,
          liveLink: proj.liveLink,
          tags: JSON.stringify(proj.tags),
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
