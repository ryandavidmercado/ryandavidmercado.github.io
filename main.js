const htmlElem = document.querySelector("html");
const bodyElem = document.querySelector("body");
const isMobile = window.innerWidth < 800;

// Disables scrolling while intro animation plays on mobile
if (isMobile) {
  bodyElem.classList.add("scroll-disable");
  setTimeout(() => {
    bodyElem.classList.remove("scroll-disable");
  }, 1200);
}

// On refresh, hides the page to reset scroll
// You would not believe how much trial and error it took to find this
window.onbeforeunload = function () {
  htmlElem.classList.add("hidden");
};

/* Redirects to unindexed site if page is loaded w/ index.
Fixes refresh on Firefox Mobile. */
window.onload = function () {
  let url = window.location.href;
  const hashIndex = url.indexOf("#");
  if (hashIndex !== -1) {
    window.location.href = url.slice(0, hashIndex);
  }
};

// inits the third-party AOS (Animate on Scroll) library
AOS.init();

/* Functionality for automatically generating project previews
and updating them to the DOM. */

async function getPinnedRepos(username) {
  const url = `https://gh-pinned-repos-5l2i19um3.vercel.app/?username=${username}`;
  try {
    const res = await fetch(url);
    return await res.json();
  } catch (err) {
    console.log(err);
    return [];
  }
}

async function getRepoREADME(projectURL) {
  const slicedProjectURL = projectURL.slice(19);
  const readmeURL = `https://raw.githubusercontent.com/${slicedProjectURL}/main/README.md`;
  try {
    const res = await fetch(readmeURL);
    return await res.text();
  } catch (err) {
    console.log(err);
    return "";
  }
}

async function getRepoSkills(projectURL) {
  const slicedProjectURL = projectURL.slice(19);
  const skillsURL = `https://raw.githubusercontent.com/${slicedProjectURL}/main/skills.md`;
  try {
    const res = await fetch(skillsURL);
    if (res.ok) {
      const skillsData = await res.text();
      return skillsData.split("\n");
    } else throw new Error("skills.md was not found.");
  } catch (error) {
    console.log(error);
    return ["HTML", "CSS", "JavaScript"];
  }
}

function getPreviewImageURL(projectURL) {
  const slicedProjectURL = projectURL.slice(19);
  return `https://raw.githubusercontent.com/${slicedProjectURL}/main/screenshots/preview.png`;
}

function getPreviewLink(readme) {
  const clauses = ["Preview", "Demo", "App", "Application", "Site", "API"];
  let match = "";
  clauses.forEach((clause) => {
    if (!match) {
      const testCase = new RegExp(`\\[Live ${clause}]\\((.*)\\)`);
      const matchAttempt = readme.match(testCase);
      if(matchAttempt) match = matchAttempt[1];
    }
  });
  return match || "#";
}

async function reposToDivs(username) {
  const repos = await getPinnedRepos(username);
  let output = "";
  let idNum = 0;

  function divMaker(
    screenshotURL,
    title,
    description,
    skills,
    previewURL,
    githubLink
  ) {
    const skillsDivs = skills.map((skill) => `<li>${skill}</li>`).join("\n");
    const aosBlock = isMobile ? "fade-right" : "fade-up";
    return `
      <div id="showcase-project-${idNum}" data-aos="${aosBlock}" class="showcase-project center-text">
        <img src=${screenshotURL} onerror="this.style.display='none'" />
        <h3>${title}</h3>
        <p>${description}</h3>
        <div class="showcase-skills-container">
          <ul class="showcase-skills">
            ${skillsDivs}
          </ul>
        </div>
        <nav class="showcase-link-container">
          <a class="showcase-link" href="${previewURL}" target="_blank">Live Demo</a>
          <a class="showcase-link" href="${githubLink}" target="_blank">GitHub</a>
        </nav>
      </div>
    `;
  }

  for (let repo of repos) {
    const githubLink = repo.link;

    const skills = await getRepoSkills(githubLink);
    const screenshotURL = getPreviewImageURL(githubLink);

    const readme = await getRepoREADME(githubLink);
    const previewURL = getPreviewLink(readme);
    const description = repo.description;
    const title = repo.repo;

    output += divMaker(
      screenshotURL,
      title,
      description,
      skills,
      previewURL,
      githubLink
    );

    idNum++;
  }

  return output;
}

async function populateShowcase(username) {
  const content = await reposToDivs(username);
  document.querySelector("#showcase-container").innerHTML = content;
  AOS.refreshHard();
}

populateShowcase("ryandavidmercado");
