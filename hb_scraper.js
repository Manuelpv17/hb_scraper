const puppeteer = require("puppeteer");
const Review = require("./models/Review");
const Student = require("./models/Student");
const Project = require("./models/Project");

const scrape = async function scraping() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setDefaultNavigationTimeout(0);

  await page.goto("https://intranet.hbtn.io/");

  await page.type("[name='user[login]']", process.env.EMAIL);
  await page.type("[name='user[password]']", process.env.PASS);

  await page.click(["[type=submit]"]);
  await page.waitForSelector(".group-staff");

  // STUDENTS
  await students(browser);

  //PROJECTS
  await reviews(browser);

  await browser.close();
  console.log("End");
};

console.log("Start");
scrape();

async function students(browser) {
  const page = await browser.newPage();
  await page.setDefaultNavigationTimeout(0);

  await page.goto("https://intranet.hbtn.io/dashboards/my_all_students");
  await page.waitForSelector(".list-group");

  const students = await page.evaluate(() => {
    const students = [];
    const amount_students = document.querySelectorAll(`.gap > li`).length;
    for (let i = 1; i <= amount_students; i++) {
      const info = document
        .querySelector(`.gap li:nth-child(${i}) h3`)
        .innerText.split("-");
      const student = {};
      student["name"] = info[0];
      student["id"] = document.querySelector(
        `.gap li:nth-child(${i}) p code:first-child`
      ).innerText;
      student["city"] = info[1].replace(/\s+/g, "");

      if (info[2].slice(-8) === "Activate") {
        student["cohort"] = info[2].slice(0, -8).replace(/\s+/g, "");
        student["status"] = "inactive";
      } else {
        student["cohort"] = info[2].replace(/\s+/g, "");
        student["status"] = "active";
      }

      try {
        student["github"] = document.querySelector(
          `.gap li:nth-child(${i}) [href*='github']`
        ).href;
      } catch {}
      students.push(student);
    }
    return students;
  });

  for (let i = 0; i < students.length; i++) {
    const { name, id, github, city, cohort, status } = students[i];
    const updatedStudent = await Student.findOneAndUpdate(
      { id: id },
      { name, id, github, city, cohort, status },
      { setDefaultsOnInsert: true }
    );
    if (updatedStudent === null) {
      const newStudent = new Student({
        name,
        id,
        github,
        city,
        cohort,
        status,
      });
      await newStudent.save();
    }
  }
}

async function reviews(browser) {
  const page = await browser.newPage();
  await page.setDefaultNavigationTimeout(0);

  const cohorts = [
    "https://intranet.hbtn.io/batches/22", //ch 9
    "https://intranet.hbtn.io/batches/27", //ch 10
    "https://intranet.hbtn.io/batches/35", //ch 11
    "https://intranet.hbtn.io/batches/45", //ch 12
    "https://intranet.hbtn.io/batches/59", //ch 13
    "https://intranet.hbtn.io/batches/80", //ch 14
  ];

  //go to the cohort projects
  for (let ch = 0; ch < cohorts.length; ch++) {
    await page.goto(cohorts[ch]);

    const cohort_projects = await page.evaluate(() => {
      projects = [];
      const amount_projects = document.querySelector("#planning_items table")
        .tBodies[0].rows.length;
      for (let i = 1; i <= amount_projects; i++)
        projects.push(
          document.querySelector(
            `#planning_items table tbody tr:nth-child(${i}) td:last-child a`
          ).href
        );
      return projects;
    });

    //go to the project
    for (let ch_p = 0; ch_p < cohort_projects.length; ch_p++) {
      await page.goto(cohort_projects[ch_p]);
      await page.waitForSelector("#qa-reviews");

      const response = await page.evaluate(() => {
        const reviews = [];
        const project = {};
        const response = { project: project, reviews: reviews };

        //project
        project["project_id"] = document
          .querySelector("article p:nth-child(2) a")
          .href.split("/")[4];
        project["name"] = document.querySelector(
          "article p:nth-child(2) a"
        ).innerText;

        const start_date = new Date(
          document.querySelector("article p:nth-child(3)").innerText.slice(12)
        );
        const end_date = new Date(
          document.querySelector("article p:nth-child(4)").innerText.slice(10)
        );
        project["duration"] = (end_date - start_date) / (1000 * 60 * 60 * 24);

        //reviews
        const amount_reviews = document.querySelector("#qa-reviews table")
          .tBodies[0].rows.length;

        for (let i = 1; i <= amount_reviews; i++) {
          const student = document
            .querySelector(
              `#qa-reviews table tbody tr:nth-child(${i}) td:nth-child(1) a`
            )
            .href.split("/");
          const review = {};
          review["student_id"] = student[student.length - 1];
          review["score"] = parseFloat(
            document.querySelector(
              `#qa-reviews table tbody tr:nth-child(${i}) td:nth-child(4)`
            ).innerText
          );

          reviews.push(review);
        }
        return response;
      });

      const { project, reviews } = response;
      const { project_id, name, duration } = project;

      const updateProject = await Project.findOneAndUpdate(
        { id: project_id },
        { name, duration }
      );
      if (updateProject === null) {
        const newProject = new Project({ id: project_id, name, duration });
        await newProject.save();
      }

      const updatingProject = await Project.findOne({ id: project_id });

      for (let i = 0; i < reviews.length; i++) {
        const { score, student_id } = reviews[i];
        const updatedReview = await Review.findOneAndUpdate(
          { project_id, student_id },
          { score }
        );
        if (updatedReview === null) {
          const newReview = new Review({
            project_id,
            student_id,
            score,
          });
          await newReview.save();

          await Student.findOneAndUpdate(
            { id: student_id },
            { $push: { reviews: newReview._id } }
          );
          updatingProject.reviews.push(newReview._id);
        }
      }
      await updatingProject.save();
    }
  }
}
