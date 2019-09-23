import * as vsCode from "vscode";

/**
 * The strong typing for the developer comment settings.
 */
export interface IDevCommentSettings {
    commentFormat: string;
    user: string;
    dateFormat: string;
    partialBranch: string;
    identifier: string;
    moveToEnd: boolean;
    additionalFormats: IAdditionalFormat[];
}

/**
 * Additional format definition, languageId as defined by vs code.
 */
export interface IAdditionalFormat {
    languageId: string;
    commentSymbol: string;
}

/**
 * Gets the configuration from the workspace and types them
 */
export const getConfiguration = (): IDevCommentSettings => {
    const configuration = vsCode.workspace.getConfiguration("devComment");

    return {
        additionalFormats: configuration.get<IAdditionalFormat[]>("additionalFormats"),
        commentFormat: configuration.get<string>("commentFormat"),
        dateFormat: configuration.get<string>("dateFormat"),
        moveToEnd: configuration.get<boolean>("moveToEnd"),
        partialBranch: configuration.get<string>("partialBranch"),
        identifier: configuration.get<string>("identifier"),
        user: configuration.get<string>("user"),
    } as IDevCommentSettings;
};
