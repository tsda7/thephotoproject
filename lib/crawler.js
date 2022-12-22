var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { baseUrl, target } from "./config.js";
import checkFileExtension from "./fileChecker.js";
function displayImage(item) {
    let img = document.createElement("img");
    img.src = item.url;
    target.appendChild(img);
}
function displayFolder(item) {
    let folder = document.createElement("div");
    folder.className = "folder";
    folder.innerText = item.path;
    folder.addEventListener("click", () => crawler(item.url));
    target.appendChild(folder);
}
function clearData() {
    target.innerHTML = "";
}
function displayData(data) {
    if ("message" in data) {
        console.log(data.message);
        return;
    }
    data.tree.forEach((item) => {
        if (item.type === "blob" && checkFileExtension(item.path)) {
            displayImage(item);
        }
        else if (item.type === "tree") {
            displayFolder(item);
        }
    });
}
export default function crawler(url = baseUrl) {
    return __awaiter(this, void 0, void 0, function* () {
        const data = (yield (yield fetch(url)).json());
        clearData();
        displayData(data);
    });
}
//# sourceMappingURL=crawler.js.map