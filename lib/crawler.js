var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { baseUrl, repo, target } from "./config.js";
import checkFileExtension from "./fileChecker.js";
export function clearData() {
    target.innerHTML = "";
}
export default function crawler() {
    return __awaiter(this, void 0, void 0, function* () {
        const data = (yield (yield fetch(baseUrl)).json());
        if ("message" in data) {
            console.error(data.message);
            return;
        }
        const parsedFileSystem = {};
        data.tree.forEach((item) => {
            if (item.type === "blob" && checkFileExtension(item.path)) {
                let path = item.path.split("/");
                let filename = path.pop();
                let currentDir = parsedFileSystem;
                path.forEach((dir) => {
                    if (!currentDir[dir])
                        currentDir[dir] = {};
                    currentDir = currentDir[dir];
                });
                currentDir[filename] = item.url;
            }
        });
        displayFileSystem(parsedFileSystem);
    });
}
function displayFileSystem(currentDir, currentPath = "", dirName) {
    return new Promise((resolve, _reject) => {
        function openDir(dir) {
            return __awaiter(this, void 0, void 0, function* () {
                const newDir = currentDir[dir];
                if (newDir !== undefined && typeof newDir !== "string") {
                    yield displayFileSystem(newDir, currentPath + dir + "/", dir);
                    return true;
                }
                else
                    return false;
            });
        }
        function displayFolder(name) {
            let folder = document.createElement("div");
            folder.classList.add("flex", "flex-row", "items-center", "cursor-pointer", "bg-gray-200", "p-2", "rounded-md", "flex", "gap-2");
            let folderIcon = folder.appendChild(document.createElement("span"));
            folderIcon.className = "material-symbols-outlined";
            folderIcon.innerText = "folder";
            let folderName = folder.appendChild(document.createElement("span"));
            folderName.innerText = name;
            folder.addEventListener("click", () => openDir(name).then((wasOpened) => __awaiter(this, void 0, void 0, function* () {
                if (wasOpened)
                    resolve(yield displayFileSystem(currentDir, currentPath, dirName));
            })));
            target.appendChild(folder);
        }
        function displayImage(item) {
            let container = document.createElement("div");
            container.classList.add("flex", "flex-col", "items-center", "justify-center");
            let img = container.appendChild(document.createElement("img"));
            img.classList.add("w-1/2", "h-1/2", "object-contain", "cursor-pointer");
            img.dataset.fancybox = "gallery";
            img.src = `https://github.com/${repo}/raw/main/${currentPath + item}`;
            target.appendChild(container);
        }
        function displayNavigation(dirName) {
            let navPlaceholder = document.createElement("div");
            navPlaceholder.classList.add("h-6");
            target.appendChild(navPlaceholder);
            let nav = target.appendChild(document.createElement("nav"));
            nav.classList.add("flex", "flex-row", "gap-2", "items-center", "fixed", "top-0", "left-0", "p-4", "z-10");
            let iconBack = nav.appendChild(document.createElement("span"));
            iconBack.classList.add("material-symbols-outlined", "cursor-pointer");
            iconBack.innerText = "arrow_back";
            iconBack.addEventListener("click", () => {
                resolve();
            });
            let path = nav.appendChild(document.createElement("span"));
            path.className = "path";
            path.innerText = dirName;
        }
        target.innerHTML = "";
        if (dirName)
            displayNavigation(dirName);
        Object.keys(currentDir)
            .filter((dir) => {
            return typeof currentDir[dir] === "object";
        })
            .map(displayFolder);
        Object.keys(currentDir)
            .filter((dir) => {
            return typeof currentDir[dir] === "string";
        })
            .map(displayImage);
    });
}
target.classList.add("flex", "flex-col", "gap-4", "p-4");
//# sourceMappingURL=crawler.js.map