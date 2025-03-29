const GITHUB_USERNAME = "yourusername";
const REPO_NAME = "website-content";
const FILE_PATH = "content.json";
const TOKEN = "your_personal_access_token"; 

async function loadContent() {
    const response = await fetch(`https://api.github.com/repos/${GITHUB_USERNAME}/${REPO_NAME}/contents/${FILE_PATH}`, {
        headers: { "Authorization": `token ${TOKEN}` }
    });
    const data = await response.json();
    const content = JSON.parse(atob(data.content));

    if (document.getElementById("about-editor")) {
        var aboutEditor = new Quill("#about-editor", { theme: "snow" });
        aboutEditor.root.innerHTML = content.aboutMe;
        document.getElementById("save-about").addEventListener("click", () => saveContent("aboutMe", aboutEditor.root.innerHTML));
    }

    if (document.getElementById("projects-summary")) {
        const projectsContainer = document.getElementById("projects-summary");
        projectsContainer.innerHTML = content.projects.map(project => 
            `<div class='project-card'>
                <h3><a href="${project.link}">${project.title}</a></h3>
                <p>${project.summary}</p>
            </div>`
        ).join('');
    }
}

async function saveContent(section, data) {
    const response = await fetch(`https://api.github.com/repos/${GITHUB_USERNAME}/${REPO_NAME}/contents/${FILE_PATH}`, {
        headers: { "Authorization": `token ${TOKEN}` }
    });
    const fileData = await response.json();
    const existingContent = JSON.parse(atob(fileData.content));
    existingContent[section] = data;

    await fetch(`https://api.github.com/repos/${GITHUB_USERNAME}/${REPO_NAME}/contents/${FILE_PATH}`, {
        method: "PUT",
        headers: {
            "Authorization": `token ${TOKEN}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            message: `Updated ${section} content`,
            content: btoa(JSON.stringify(existingContent)),
            sha: fileData.sha
        })
    });

    alert(`${section} content saved!`);
}

loadContent();
