import { baseUrl, target } from "./config.js";
import checkFileExtension from "./fileChecker.js";

type apiResponse =
    | {
          sha: string;
          url: string;
          tree: (blobItem | treeItem)[];
          truncated: boolean;
      }
    | {
          message: string;
          documentation_url: string;
      };
type item = {
    path: string;
    mode: string;
    sha: string;
    url: string;
};
type blobItem = item & {
    type: "blob";
    size: number;
};
type treeItem = item & {
    type: "tree";
};

function displayImage(item: blobItem) {
    let img = document.createElement("img");
    img.src = item.url;
    target.appendChild(img);
}

function displayFolder(item: treeItem) {
    let folder = document.createElement("div");
    folder.className = "folder";
    folder.innerText = item.path;
    folder.addEventListener("click", () => crawler(item.url));
    target.appendChild(folder);
}
function clearData() {
    target.innerHTML = "";
}
function displayData(data: apiResponse) {
    if ("message" in data) {
        console.log(data.message);
        return;
    }
    data.tree.forEach((item) => {
        if (item.type === "blob" && checkFileExtension(item.path)) {
            displayImage(item);
        } else if (item.type === "tree") {
            displayFolder(item);
        }
    });
}

export default async function crawler(url: string = baseUrl) {
    const data = (await (await fetch(url)).json()) as apiResponse;
    clearData();
    displayData(data);
}
