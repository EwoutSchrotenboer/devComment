import * as vsCode from "vscode";

export interface IDevCommentSettings {
    commentFormat: string;
    user: string;
    dateFormat: string;
    partialBranch: string;
    moveToEnd: boolean;
    additionalFormats: IAdditionalFormat[];
}

export interface IAdditionalFormat {
    languageId: string;
    commentSymbol: string;
}

export const getConfiguration = (): IDevCommentSettings => {
    const configuration = vsCode.workspace.getConfiguration("devComment");

    return {
        additionalFormats: configuration.get<IAdditionalFormat[]>("additionalFormats"),
        commentFormat: configuration.get<string>("commentFormat"),
        dateFormat: configuration.get<string>("dateFormat"),
        moveToEnd: configuration.get<boolean>("moveToEnd"),
        partialBranch: configuration.get<string>("partialBranch"),
        user: configuration.get<string>("user"),
    } as IDevCommentSettings;
};
