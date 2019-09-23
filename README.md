# Developer Comment README

## Configuration parameters

Open the user settings and navigate to the Developer Comment Extension section

Here, the following parameters can be set/adjusted:

- Comment Format: the format for the whole comment, as defined in the example below.
- User: the username that will be used when the {user}-keyword is used.
- Date Format: the dateformat that will be used when {date} is called. Please refer to the [dateFns documentation](https://date-fns.org/v2.1.0/docs/format) for valid formats.
- Partial Branch: A regular expression that will be used when {partialBranch} is defined. It extracts the given expression result from the active branch.
Move To End: If this is enabled, the comment will not insert at the cursor, but at the end of the line, if it is not empty.
- Additional Formats: define comment symbols for additional languages, further explained in "supported filetypes"

Without the configuration, the regular comment-format will be as follows:

```csharp
 // 19700101:
 ```

Example:

- "partialBranch": "LS-\\d{4,5}",
- "user": "ES",
- "dateFormat": "YYYYMMDD",
- "commentFormat": "{date}: {user}: {partialBranch} - "

The commentformat as given in the example settings:

```csharp
 // 19700101: ES: LS-0000 -
```

- partialBranch contains the data you want to retrieve from branchnames. Configured as a regular expression.
- the user defines the initials or the username.
- dateformat is parsed by date-fns ( [Date FNS documentation](https://date-fns.org/docs/Getting-Started))
- the commentformat parses the other parameters, as well as plain text.
- {date}, {user}, {branch} and {identifier} are supported, where {identifier} gets the partialBranch-information.

### Supported filetypes

Currently the following languages/fileformats are supported out of the box:

- XML
- HTML
- Javascript
- JSX
- Typescript
- TSX
- C#

Adding support for new filetypes can be done as follows:

1. Open the user settings and navigate to the Developer Comment Extension section
1. The "Additional filetypes"-section contains a link to open the JSON-file.
1. Add the line "devComment.additionalFormats", this should trigger an example-implementation, which can be adjusted or expanded upon.

The formats are defined as an array with the following structure for the items:

```json
{ "languageId": "php", "commentSymbol":"#"}
```

Where languageId is the Id for the language as defined by VS Code ([VS Code language identifiers](https://code.visualstudio.com/docs/languages/identifiers))

## Usage

Either open the command palette and select "Add Dev Comment" or use the combination "Shift + Alt + D", this will add a comment to the current selected line.
