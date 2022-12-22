import allowedFileExtensions from "./filesWhitelist.js";
export default function checkFileExtension(filename) {
    let fileExtension = filename.split(".").pop();
    if (!fileExtension)
        return false;
    return allowedFileExtensions.includes(fileExtension);
}
//# sourceMappingURL=fileChecker.js.map