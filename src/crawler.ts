import { baseUrl, repo, target } from "./config.js";
import checkFileExtension from "./fileChecker.js";
import { apiResponse } from "./apiTypes.js";

type parsedFileSystem = {
    [key: string]: parsedFileSystem | string;
};

export function clearData() {
    target.innerHTML = "";
}

export default async function crawler() {
    const data = (await (await fetch(baseUrl)).json()) as apiResponse;

    if ("message" in data) {
        console.error(data.message);
        return;
    }

    const parsedFileSystem: parsedFileSystem = {};
    data.tree.forEach((item) => {
        if (item.type === "blob" && checkFileExtension(item.path)) {
            let path = item.path.split("/");
            let filename = path.pop();
            let currentDir = parsedFileSystem;
            path.forEach((dir: string) => {
                if (!currentDir[dir]) currentDir[dir] = {};
                currentDir = currentDir[dir] as parsedFileSystem;
            });
            currentDir[filename as string] = item.url;
        }
    });

    displayFileSystem(parsedFileSystem);
}

/**
 * resolves as soon as the directory is closed
 */
function displayFileSystem(
    currentDir: parsedFileSystem,
    currentPath = "",
    dirName?: string
): Promise<void> {
    return new Promise((resolve, _reject) => {
        /**
         *
         * @param dir the directory to open
         * @returns true if the directory was opened and later closed again, false if the directory was not a directory
         */
        async function openDir(dir: string) {
            const newDir = currentDir[dir];
            if (newDir !== undefined && typeof newDir !== "string") {
                await displayFileSystem(newDir, currentPath + dir + "/", dir);
                return true;
            } else return false;
        }

        function displayFolder(name: string) {
            let folder = document.createElement("div");
            folder.classList.add(
                "flex",
                "flex-row",
                "items-center",
                "cursor-pointer",
                "bg-gray-200",
                "p-2",
                "rounded-md",
                "flex",
                "gap-2"
            );

            let folderIcon = folder.appendChild(document.createElement("span"));
            folderIcon.className = "material-symbols-outlined";
            folderIcon.innerText = "folder";

            let folderName = folder.appendChild(document.createElement("span"));
            folderName.innerText = name;

            folder.addEventListener("click", () =>
                openDir(name).then(async (wasOpened) => {
                    if (wasOpened)
                        resolve(
                            await displayFileSystem(
                                currentDir,
                                currentPath,
                                dirName
                            )
                        );
                })
            );
            target.appendChild(folder);
        }

        function displayImage(item: string) {
            let container = document.createElement("div");
            container.classList.add("flex", "flex-col", "items-center");
            let img = container.appendChild(document.createElement("img"));
            img.classList.add("w-1/2", "h-1/2", "object-contain");
            img.src = `https://github.com/${repo}/raw/main/${
                currentPath + item
            }`;
            target.appendChild(img);
        }

        function displayNavigation(dirName: string) {
            let nav = target.appendChild(document.createElement("nav"));
            nav.classList.add("flex", "flex-row", "gap-2", "items-center");

            let iconBack = nav.appendChild(document.createElement("span"));
            iconBack.classList.add(
                "material-symbols-outlined",
                "cursor-pointer"
            );
            iconBack.innerText = "arrow_back";
            iconBack.addEventListener("click", () => {
                resolve();
            });

            let path = nav.appendChild(document.createElement("span"));
            path.className = "path";
            path.innerText = dirName;
        }

        target.innerHTML = "";

        if (dirName) displayNavigation(dirName);

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
