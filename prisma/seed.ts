import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import * as fs from "fs";
import "dotenv/config";

const url = (process.env.DATABASE_URL || "").replace(/['"]/g, "");
const adapter = new PrismaPg({
  connectionString: url,
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

  // 4. Seed Projects (ONLY the exact projects requested by the user)
  await prisma.project.deleteMany({});
  console.log("✔ Cleared old projects registry.");

  const projectsData = [
    {
      id: 1,
      title: "birthday reminder",
      imgUrl: "https://i.ibb.co/CPrHNtZ/b1.webp",
      liveLink: "https://birthdayreminder-react.netlify.app/",
      tags: ["react", "trainning"],
      tools: ["react", "jsx", "css", "reactHooks"],
    },
    {
      id: 2,
      title: "Tours",
      imgUrl: "https://i.ibb.co/SrR5Pmv/b2.webp",
      liveLink: "https://admiring-darwin-adfdec.netlify.app/",
      tags: ["react", "trainning"],
      tools: ["react", "jsx", "css", "reactHooks"],
    },
    {
      id: 3,
      title: "Review",
      imgUrl: "https://i.ibb.co/xXtjz7Q/b3.webp",
      liveLink: "https://review-react-app.netlify.app",
      tags: ["react", "trainning"],
      tools: ["react", "jsx", "css", "reactHooks"],
    },
    {
      id: 4,
      title: "Accordion",
      imgUrl: "https://i.ibb.co/JxydnLC/b4.webp",
      liveLink: "https://accordion-react-pro.netlify.app",
      tags: ["react", "trainning"],
      tools: ["react", "jsx", "css", "reactHooks"],
    },
    {
      id: 5,
      title: "Menu",
      imgUrl: "https://i.ibb.co/LYDWWcQ/b5.webp",
      liveLink: "https://our-menu-react.netlify.app",
      tags: ["react", "trainning"],
      tools: ["react", "jsx", "css", "reactHooks"],
    },
    {
      id: 6,
      title: "Tabs",
      imgUrl: "https://i.ibb.co/89Fs5cv/b6.webp",
      liveLink: "https://tabs-example-react.netlify.app",
      tags: ["react", "trainning"],
      tools: ["react", "jsx", "css", "reactHooks"],
    },
    {
      id: 7,
      title: "Slider",
      imgUrl: "https://i.ibb.co/DGxjbCF/b7.webp",
      liveLink: "https://react-slider-slider.netlify.app",
      tags: ["react", "trainning"],
      tools: ["react", "jsx", "css", "reactHooks"],
    },
    {
      id: 8,
      title: "Lorem",
      imgUrl: "https://i.ibb.co/850L0py/b8.webp",
      liveLink: "https://react-lorem-ipsom.netlify.app",
      tags: ["react", "web app"],
      tools: ["react", "jsx", "css", "reactHooks"],
    },
    {
      id: 21,
      title: "Moon Light",
      imgUrl: "https://i.ibb.co/X75dk49/Fire-Shot-Capture-002-Moon-Light-elastic-roentgen-f3c167-netlify-app.webp",
      liveLink: "https://moon-light-parallex-scrolling.netlify.app/",
      tags: ["html", "css", "landing page"],
      tools: ["html", "javascript", "css"],
    },
    {
      id: 9,
      title: "Color Generator",
      imgUrl: "https://i.ibb.co/NLRjMB5/b9.webp",
      liveLink: "https://react-color-generator-react.netlify.app",
      tags: ["react", "web app"],
      tools: ["react", "jsx", "css", "reactHooks", "values.js"],
    },
    {
      id: 10,
      title: "Sticky Note",
      imgUrl: "https://i.ibb.co/VM0nQv3/b10.webp",
      liveLink: "https://sticky-note-react.netlify.app",
      tags: ["react", "web app"],
      tools: ["react", "jsx", "css", "reactHooks"],
    },
    {
      id: 11,
      title: "Sidebar & Modal",
      imgUrl: "https://i.ibb.co/K27QFV0/b12.webp",
      liveLink: "https://react-side-bar-and-modal.netlify.app",
      tags: ["react", "trainning"],
      tools: ["react", "jsx", "css", "reactHooks"],
    },
    {
      id: 12,
      title: "Stripe",
      imgUrl: "https://i.ibb.co/T4GkgD1/b13.webp",
      liveLink: "https://react-stripe-submenu.netlify.app",
      tags: ["react", "trainning", "website"],
      tools: ["react", "jsx", "css", "reactHooks"],
    },
    {
      id: 13,
      title: "Music Box",
      imgUrl: "https://i.ibb.co/Z2Y91WY/b13-1.webp",
      liveLink: "https://music-box-tem.netlify.app/",
      tags: ["html", "css", "landing page"],
      tools: ["html", "css"],
    },
    {
      id: 14,
      title: "Developers Gate",
      imgUrl: "https://i.ibb.co/yBL5KzB/b14.webp",
      liveLink: "https://developers-gate.netlify.app/",
      tags: ["html", "css", "landing page"],
      tools: ["html", "bootstrap 5", "font awesome"],
    },
    {
      id: 15,
      title: "restaurant reviews",
      imgUrl: "https://i.ibb.co/dW8R110/b15.webp",
      liveLink: "https://restaurant-reviews-application.netlify.app/",
      tags: ["html", "css", "website", "web app"],
      tools: ["html", "css", "javascript", "json/ajax", "jquery"],
    },
    {
      id: 18,
      title: "React Pagination",
      imgUrl: "https://i.ibb.co/846X1dH/pagination.png",
      liveLink: "https://react-pagination-react.netlify.app/",
      tags: ["react", "trainning"],
      tools: ["react", "jsx", "css", "reactHooks"],
    },
    {
      id: 16,
      title: "React Cart",
      imgUrl: "https://i.ibb.co/7WzNhgn/b16.webp",
      liveLink: "https://react-cart-sa.netlify.app/",
      tags: ["react", "trainning", "redux"],
      tools: ["react", "jsx", "css", "reactHooks", "redux"],
    },
    {
      id: 20,
      title: "Ocean Landing Page",
      imgUrl: "https://i.ibb.co/DgkzxqB/Ocean-Screen.webp",
      liveLink: "https://ocean-landing-page-react.netlify.app/",
      tags: ["html", "css", "landing page"],
      tools: ["html", "javascript", "css"],
    },
    {
      id: 17,
      title: "Gamer Station",
      imgUrl: "https://i.ibb.co/LY9zVyB/portfolio-gamer-Station.webp",
      liveLink: "https://gamer-station-v2.netlify.app/",
      tags: ["react", "context api", "website", "web app"],
      tools: ["react", "jsx", "css", "reactHooks", "contextAPI", "react icons ", "react lazy load image component", "react AOS"],
    },
    {
      id: 19,
      title: "Photo Graphy",
      imgUrl: "https://i.ibb.co/6sgVwTk/photo-Graphy-Project-Image.png",
      liveLink: "https://photo-graphy-dbgunk6s4-mostafatarekaioup.vercel.app/",
      tags: ["react", "redux", "website", "web app"],
      tools: ["react", "jsx", "css", "reactHooks", "redux", "reduxToolkit", "react-icons ", "react-AOS"],
    },
    {
      id: 22,
      title: "E-Shop",
      imgUrl: "https://i.ibb.co/GHMgQv3/egyStore.webp",
      liveLink: "https://e-shop-react-redux.netlify.app/",
      tags: ["react", "redux", "website", "web app"],
      tools: ["react", "jsx", "scss", "reactHooks", "redux", "reduxToolkit", "react-icons ", "auth0", "react-glider"],
    },
    {
      id: 23,
      title: "elevenstats",
      imgUrl: "https://i.ibb.co/L9dHTj0/Screenshot-2022-11-29-205548.png",
      liveLink: "https://www.elevenstats.com/",
      tags: ["react", "redux", "website", "Next", "TypeScript"],
      tools: ["react", "jsx", "scss", "reactHooks", "redux", "reduxToolkit", "react-icons ", "auth0", "react-glider"],
    },
    {
      id: 25,
      title: "Saudi Authority for Intellectual Property",
      imgUrl: "https://i.ibb.co/3M2vsgY/Screenshot-2023-06-07-201255.png",
      liveLink: "https://www.saip.gov.sa/",
      tags: ["react", "redux", "website", "Next", "TypeScript"],
      tools: ["react", "jsx", "scss", "reactHooks", "redux", "reduxToolkit", "react-icons ", "auth0", "react-glider"],
    },
  ];

  for (const proj of projectsData) {
    await prisma.project.create({
      data: {
        id: proj.id,
        title: proj.title,
        imgUrl: proj.imgUrl,
        liveLink: proj.liveLink,
        tags: JSON.stringify(proj.tags),
        tools: JSON.stringify(proj.tools),
      },
    });
  }
  console.log(`✔ ${projectsData.length} Projects seeded with tools and exact IDs.`);

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
