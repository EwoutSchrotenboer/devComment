import * as dateFns from 'date-fns';
import * as vsCode from 'vscode';
import { getConfiguration } from "./configuration";

/**
 * The keywords that can be defined in the comment template
 */
enum Keyword {
    Branch = "{branch}",
    PartialBranch = "{partialBranch}",
    User = "{user}",
    Date = "{date}"
}

/**
 * The Formatter class. Responsible for formatting the developer comment message, depending on the settings.
 */
export class Formatter {
    /**
     * The DevComment configuration
     */
    private settings = getConfiguration();

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
    public createComment = (): Promise<string> => {
        const commentFormat = this.settings.commentFormat;
        let baseComment = commentFormat !== undefined ? commentFormat : "{date}:";

        return new Promise((resolve) => resolve(this.updateComment(baseComment)));
    }

    private updateComment = (baseComment: string): Promise<string> => {
        return new Promise((resolve) => {
            let comment = this.addCommentTags(baseComment);

            comment = this.replaceKeyword(comment, Keyword.Date, this.getCurrentDateString());
            comment = this.replaceKeyword(comment, Keyword.User, this.getUser());

            if (this.containsAny(comment, [Keyword.Branch, Keyword.PartialBranch])) {
                this.getBranchName().then((branchName) => {
                    comment = this.replaceKeyword(comment, Keyword.Branch, branchName);
                    comment = this.replaceKeyword(comment, Keyword.PartialBranch, this.getBranchIdentifier(branchName));

                    resolve(comment);
                });
            }
            else {
                resolve(comment);
            }
        });
    }

    private addCommentTags = (comment: string): string => {
        // Check for user-defined languages first, move to the defaults otherwise.
        const userDefined = this.settings.additionalFormats.find((format) => {
            return format.languageId === this.languageId;
        });

        if (userDefined) {
            return `${userDefined.commentSymbol} ${comment}`;
        }

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

    private getBranchIdentifier = (branchName: string): string => {
        const partialBranchRegex = this.settings.partialBranch;

        if (partialBranchRegex) {
            const regEx = new RegExp(partialBranchRegex);
            const value = branchName.match(regEx);

            // If the regex does not match the branchname, return an empty string
            return value ? value[0] : "";
        } else {
            return branchName;
        }
    }

    private getBranchName = (): Promise<string> => {
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

    private getCurrentDateString = (): string => {
        const format = this.settings.dateFormat;

        if (format) {
            try {
                return dateFns.format(Date.now(), format);
            } catch {
                // do nothing, return the default.

            }
        }

        return dateFns.format(Date.now(), "yyyyMMdd");
    }

    private getUser = (): string => this.settings.user ? this.settings.user : "";
    
    private containsAny = (comment: string, keywords: Keyword[]): boolean => keywords.some((keyword) => { return comment.indexOf(keyword) > -1; });

    private replaceKeyword = (comment: string, keyword: Keyword, value: string): string => comment.replace(keyword, value);
}
