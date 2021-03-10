const htmlElem = document.querySelector("html");
const bodyElem = document.querySelector("body");

// Disables scrolling while intro animation plays on mobile
if (window.innerWidth <= 800) {
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

function getPinnedRepos(username) {
  const url = `https://gh-pinned-repos-5l2i19um3.vercel.app/?username=${username}`;
  return fetch(url)
    .then((res) => res.json())
    .catch(console.log);
}

function getRepoREADME(projectURL) {
  const slicedProjectURL = projectURL.slice(19);
  const readmeURL = `https://raw.githubusercontent.com/${slicedProjectURL}/main/README.md`;
  return fetch(readmeURL)
    .then((res) => res.text())
    .catch(console.log);
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

function getPreviewImageURL(previewURL) {
  return `https://api.apiflash.com/v1/urltoimage?access_key=e0de860625c54387ba3bcf3368cb0038&url=${previewURL}`;
}

async function reposToDivs(username) {
  const repos = await getPinnedRepos(username);
  let output = "";
  let idNum = 0;

  const flipSide = {
    num: 0,
    get: function () {
      if (!this.num) {
        this.num = 1;
        return "fade-right";
      } else {
        this.num = 0;
        return "fade-left";
      }
    },
  };

  function divMaker(
    screenshotURL,
    title,
    description,
    skills,
    previewURL,
    githubLink
  ) {
    const skillsDivs = skills.map((skill) => `<li>${skill}</li>`).join("\n");
    return `
      <div id="showcase-project-${idNum}" data-aos-delay="0" data-aos-anchor-placement="top-center" data-aos="${flipSide.get()}" class="showcase-project center-text">
        <img src=${screenshotURL} />
        <h3>${title}</h3>
        <p>${description}</h3>
        <div class="showcase-skills-container">
          <ul class="showcase-skills">
            ${skillsDivs}
          </ul>
        </div>
        <nav class="showcase-link-container">
          <a class="showcase-link" href="${previewURL}">Live Demo</a>
          <a class="showcase-link" href="${githubLink}">GitHub</a>
        </nav>
      </div>
    `;
  }

  for (let i = 0; i < repos.length; i++) {
    const githubLink = repos[i].link;
    const readme = await getRepoREADME(githubLink);
    const skills = await getRepoSkills(githubLink);

    const previewURL = readme.match(/\[Live Preview]\(([^)]*)/m)[1];
    const screenshotURL = getPreviewImageURL(previewURL);
    const description = readme.match(/\n(.*)/)[1];
    const title = repos[i].repo;

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

  if (repos.length < 4) {
    for (let i = 4 - repos.length; i > 0; i--) {
      output += divMaker(
        `https://via.placeholder.com/1280x720.png?text-"Project Placeholder"`,
        "Project Placeholder",
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        ["HTML", "CSS", "JavaScript"],
        "#",
        "#"
      );
      idNum++;
    }
  }

  return output;
}

async function populateShowcase(username) {
  const content = await reposToDivs(username);
  document.querySelector("#showcase-container").innerHTML = content;
}

populateShowcase("ryandavidmercado");
