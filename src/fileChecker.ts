import allowedFileExtensions from "./filesWhitelist.js";
export default function checkFileExtension(filename: string) {
    let fileExtension = filename.split(".").pop();
    if (!fileExtension) return false; // no extension --> not allowed
    return allowedFileExtensions.includes(fileExtension);
}
