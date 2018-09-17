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

The commentformat as given in the example settings:

```csharp
 // 19700101: [Username]: [partialbBranch] -
```

- partialBranch contains the data you want to retrieve from branchnames. Configured as a regular expression.
- the user defines the initials or the username.
- dateformat is parsed by date-fns ( https://date-fns.org/docs/Getting-Started )
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