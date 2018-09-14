import * as dateFns from 'date-fns';
import * as vsCode from 'vscode';

/**
 * The Formatter class. Responsible for formatting the developer comment message, depending on the settings.
 */
export class Formatter {
    /**
     *Retrieves the devComment Configuration.
     */
    private devCommentConfiguration = vsCode.workspace.getConfiguration("devComment");

    /**
     *Creates an instance of Formatter.
     * @param {string} [languageId=""] Optional, is used in the formatting of the comment tags. Defaults to empty.
     */
    constructor(private languageId: string = "") { }

    /**
     * Returns a promise with a newly formatted dev comment. Settings are retrieved 
     * from the usersettings, and formatted depending on how the commentFormat is defined.
     * @param {boolean} [withCommentTags] Defines whether comment tags should be added to the formatted string
     * @returns {Promise<string>} The promise with the formatted string.
     */
    public FormatDevComment(): Promise<string> {
        // First, retrieve the format, or use the default format
        const commentFormat = this.devCommentConfiguration.get<string>("commentFormat");
        let baseComment = commentFormat !== undefined ? commentFormat : "{date}:";

        return new Promise((resolve, reject) => {
            if (baseComment !== null && baseComment !== undefined) {
                baseComment = this.AddCommentTags(baseComment);

                if (baseComment.indexOf("{date}") > -1) {
                    baseComment = baseComment.replace("{date}", this.GetCurrentDateString());
                }

                if (baseComment.indexOf("{user}") > -1) {
                    baseComment = baseComment.replace("{user}", this.GetUser());
                }

                // Only get the branch information if one or both of these parameters are used.
                if (baseComment.indexOf("{branch}") > -1 || baseComment.indexOf("{identifier}") > -1) {
                    this.GetBranchName().then((result) => {

                        if (baseComment.indexOf("{branch}") > -1) {
                            baseComment = baseComment.replace("{branch}", result);
                        }

                        if (baseComment.indexOf("{identifier}") > -1) {
                            baseComment = baseComment.replace("{identifier}", this.GetPartialBranchString(result));
                        }

                        resolve(baseComment);
                    });
                } else {
                    resolve(baseComment);
                }

            } else {
                reject("DevComment is not configured correctly, please check the documentation.");
            }
        });
    }

    /**
     * Adds comment tags for the supported languages
     * @param {string} comment the base comment without tags
     * @returns {string} the comment with tags
     */
    private AddCommentTags(comment: string): string {
        switch (this.languageId) {
            case "xml":
            case "html":
                comment = "<!-- " + comment + " -->";
                break;
            case "javascript":
            case "javascriptreact":
            case "typescript":
            case "typescriptreact":
            case "csharp":
                comment = "// " + comment;
                break;
            default:
                break;
        }

        return comment;
    }

    /**
     * Gets the identifier, depending on the configured regular expression in the settings. If no regex is defined, the whole branchname is returned.
     * If no match is found, an empty string is returned.
     * @param {string} branchName The current branch
     * @returns {string} The identifier (the partial branchname)
     */
    private GetPartialBranchString(branchName: string): string {
        const partialBranchRegex = this.devCommentConfiguration.get<string>("partialBranch");

        if (partialBranchRegex !== null && partialBranchRegex !== undefined) {
            const regEx = new RegExp(partialBranchRegex);
            const value = branchName.match(regEx);

            if (value !== null) {
                return value[0];
            }
            else {
                // If the regex does not match the branchname, return an empty string
                return "";
            }
        } else {
            // If there is no regex, do nothing, return the full branchname
            return branchName;
        }
    }

    /**
     * Returns the branchname of the git-branch that contains the current active document. 
     * If no branch can be found, this resolves to an empty string.
     * @returns {Promise<string>}
     */
    private GetBranchName(): Promise<string> {
        return new Promise((resolve) => {
            let simpleGit: any;

            if (vsCode.workspace && vsCode.workspace.workspaceFolders) {
                simpleGit = require('simple-git')(vsCode.workspace.workspaceFolders[0].uri.fsPath);

                simpleGit.branchLocal((error: any, data: any) => {
                    if (error) {
                        resolve("");
                    } else {
                        resolve(data.current);
                    }
                });
            } else {
                resolve("");
            }
        });
    }

    /**
     * Returns a formatted date string, with the default formatting or the given setting.
     * @param format The format to use, this is usually retrieved from the settings.
     */
    private GetCurrentDateString(): string {
        const format = this.devCommentConfiguration.get<string>("dateFormat");

        if (format !== null && format !== undefined) {
            try {
                return dateFns.format(Date.now(), format);
            } catch {
                // do nothing, return the default.
                
            }
        }

        return dateFns.format("YYYYMMDD");
    }

    private GetUser(): string {
        const userName = this.devCommentConfiguration.get<string>("user");

        if (userName !== null && userName !== undefined) {
            return userName;
        }

        return "";
    }
}
