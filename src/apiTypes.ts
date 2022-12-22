export type apiResponse =
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
export type blobItem = item & {
    type: "blob";
    size: number;
};
export type treeItem = item & {
    type: "tree";
};
