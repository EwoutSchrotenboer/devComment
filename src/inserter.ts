import * as vsCode from "vscode";
import { getConfiguration, IDevCommentSettings } from "./configuration";

/**
 * The inserter class, responsible for inserting the generated comment into the active document.
 */
export class Inserter {

    private settings: IDevCommentSettings = getConfiguration();

    /**
     *Creates an instance of Inserter.
     * @param {string} [languageId=""] Optional, is used in the formatting of the comment tags. Defaults to empty.
     * @memberof Inserter
     */
    constructor(private languageId: string = "") { }

    /**
     * Insert the created comment into the active document.
     * @param {string} text The formatted string
     * @returns {Promise<number>} A promise with the position of the last character of the comment,
     * can be used for repositioning of the cursor.
     */
    public insertInTextEditor = (text: string): Promise<number> => {
        return new Promise<number>((resolve) => {
            let selection: vsCode.Selection;
            let startLine: number;
            let startCharacter: number;

            if (vsCode.window !== undefined && vsCode.window.activeTextEditor !== undefined) {
                const editor = vsCode.window.activeTextEditor;

                selection = editor.selection;
                startLine = selection.start.line;
                const editorLine = editor.document.lineAt(startLine);

                // Add comment to the end of the line if it contains text. Move cursor to end, add extra space.
                if (this.settings.moveToEnd && !editor.document.lineAt(startLine).isEmptyOrWhitespace) {
                    startCharacter = editorLine.range.end.character;
                    text = " " + text;
                    this.setPosition(editor, startLine, startCharacter);
                } else {
                    startCharacter = selection.start.character;
                }

                editor.edit((editBuilder) => {
                    const pos = new vsCode.Position(startLine, startCharacter);
                    editBuilder.insert(pos, text);

                    // resolve with current cursor position
                    resolve(text.length);
                });
            }
        });
    }

    /**
     * Moves the cursor to within the comment tags, if the languageId is supported.
     * @param {number} oldPosition The position of the last character of the comment.
     */
    public moveCursor = (oldPosition: number) => {
        if (vsCode.window !== undefined && vsCode.window.activeTextEditor !== undefined) {
            const editor = vsCode.window.activeTextEditor;

            // after the edit, move the cursor for specific filetypes:
            if (this.languageId === "html" || this.languageId === "xml") {
                const position = editor.selection.active;

                // To move the cursor to within the comment tag, jump 4 characters back (to skip to before the --> )
                const calculatedNewPosition = position.character + oldPosition - 4;
                this.setPosition(editor, position.line, calculatedNewPosition);
            }
        }
    }

    private setPosition = (editor: vsCode.TextEditor, line: number, cursorPosition: number): void => {
        const newPosition = editor.selection.active.with(line, cursorPosition);
        const newSelection = new vsCode.Selection(newPosition, newPosition);
        editor.selection = newSelection;
    }
}
