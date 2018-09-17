# devcomment README

## Configuration parameters

Add the following to your settings.json:

```json
"devComment": {
    "partialBranch": "[Regular expression based on branchname]",
    "user": "[Username]",
    "dateFormat": "YYYYMMDD",
    "commentFormat": "{date}: {user}: {identifier} - "
},
```

Without the configuration, the regular comment-format will be as follows:

```csharp
 // 19700101:
 ```

Example:

```json
"devComment": {
    "partialBranch": "LS-\\d{4,5}",
    "user": "ES",
    "dateFormat": "YYYYMMDD",
    "commentFormat": "{date}: {user}: {identifier} - "
}
```

The commentformat as given in the example settings:

```csharp
 // 19700101: ES: LS-0000 -
```

- partialBranch contains the data you want to retrieve from branchnames. Configured as a regular expression.
- the user defines the initials or the username.
- dateformat is parsed by date-fns ( <https://date-fns.org/docs/Getting-Started> )
- the commentformat parses the other parameters, as well as plain text.
- {date}, {user}, {branch} and {identifier} are supported, where {identifier} gets the partialBranch-information.

### Supported filetypes

Currently the following languages/fileformats are supported for inserting comments:

- XML
- HTML
- Javascript
- JSX
- Typescript
- TSX
- C#

## Usage

Either open the command palette and select "Add Dev Comment" or use the combination "Shift + Alt + D", this will add a comment to the current selected line.

## Planned features

- Choose your own keybinding
- Support for more languages
- Create/adjust settings automatically on install and change them through the new settings interface in Visual Studio Code
- Don't add comment tags when using the command on a line that is already a comment