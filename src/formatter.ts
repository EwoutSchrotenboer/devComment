import * as dateFns from 'date-fns';
import * as vsCode from 'vscode';

const branch = "{branch}";
const identifier = "{identifier}";
const user = "{user}";
const date = "{date}";
type Keyword = typeof branch | typeof identifier | typeof user | typeof date;


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
    public CreateComment = (): Promise<string> => {
        const commentFormat = this.devCommentConfiguration.get<string>("commentFormat");
        let baseComment = commentFormat !== undefined ? commentFormat : "{date}:";

        return new Promise((resolve) => resolve(this.UpdateComment(baseComment)));
    }

    private UpdateComment = (baseComment: string): Promise<string> => {
        return new Promise((resolve) => {
            let comment = this.AddCommentTags(baseComment);

            comment = this.replaceKeyword(comment, date, this.GetCurrentDateString());
            comment = this.replaceKeyword(comment, user, this.GetUser());

            if (this.containsAny(comment, [branch, identifier])) {
                this.GetBranchName().then((branchName) => {
                    comment = this.replaceKeyword(comment, branch, branchName);
                    comment = this.replaceKeyword(comment, identifier, this.GetBranchIdentifier(branchName));

                    resolve(comment);
                });
            }
            else {
                resolve(comment);
            }
        });
    }

    private containsAny = (comment: string, keywords: Keyword[]): boolean => keywords.some((keyword) => { return comment.indexOf(keyword) > -1; });
    private replaceKeyword = (comment: string, keyword: Keyword, value: string): string => comment.replace(keyword, value);

    /**
     * Adds comment tags for the supported languages
     * @param {string} comment the base comment without tags
     * @returns {string} the comment with tags
     */
    private AddCommentTags = (comment: string): string => {
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
    private GetBranchIdentifier = (branchName: string): string => {
        const partialBranchRegex = this.devCommentConfiguration.get<string>("partialBranch");

        if (partialBranchRegex) {
            const regEx = new RegExp(partialBranchRegex);
            const value = branchName.match(regEx);

            // If the regex does not match the branchname, return an empty string
            return value ? value[0] : "";
        } else {
            return branchName;
        }
    }

    /**
     * Returns the branchname of the git-branch that contains the current active document. 
     * If no branch can be found, this resolves to an empty string.
     * @returns {Promise<string>}
     */
    private GetBranchName = (): Promise<string> => {
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
    private GetCurrentDateString = (): string => {
        const format = this.devCommentConfiguration.get<string>("dateFormat");

        if (format) {
            try {
                return dateFns.format(Date.now(), format);
            } catch {
                // do nothing, return the default.

            }
        }

        return dateFns.format(Date.now(), "YYYYMMDD");
    }

    private GetUser = (): string => {
        const userName = this.devCommentConfiguration.get<string>("user");
        return userName ? userName : "";
    }
}
