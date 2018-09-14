import * as vsCode from "vscode";

/**
 * The inserter class, responsible for inserting the generated comment into the active document.
 */
export class Inserter {

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
    public InsertInTextEditor(text: string): Promise<number> {
        return new Promise<number>((resolve) => {
            let selection: vsCode.Selection;
            let startLine: number;
            let startCharacter: number;

            if (vsCode.window !== undefined && vsCode.window.activeTextEditor !== undefined) {
                const editor = vsCode.window.activeTextEditor;

                selection = editor.selection;
                startLine = selection.start.line;

                startCharacter = selection.start.character;

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
    public MoveCursor(oldPosition: number) {
        if (vsCode.window !== undefined && vsCode.window.activeTextEditor !== undefined) {
            const editor = vsCode.window.activeTextEditor;

            // after the edit, move the cursor for specific filetypes:
            if (this.languageId === "html" || this.languageId === "xml") {
                const position = editor.selection.active;

                // To move the cursor to within the comment tag, jump 4 characters back (to skip to before the --> )
                const calculateNewPosition = position.character + oldPosition - 4;
                const newPosition = position.with(position.line, calculateNewPosition);
                const newSelection = new vsCode.Selection(newPosition, newPosition);
                editor.selection = newSelection;
            }
        }
    }
}
