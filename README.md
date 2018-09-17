# devcomment README

## Configuration parameters

Add the following to your settings.json:

```json
"devComment": {
    "partialBranch": "LS-\\d{4,5}",
    "user": "ES",
    "dateFormat": "YYYYMMDD",
    "commentFormat": "{date}: {user}: {identifier} - "
},
```

partialBranch contains the data you want to retrieve from branchnames. In the example, a LS with either 4 or 5 digits is retrieved from the branchname and injected.
the user defines the initials or the username
dateformat is parsed by date-fns ( https://date-fns.org/docs/Getting-Started )
the commentformat parses the other parameters, as well as plain text.
{date}, {user}, {branch} and {identifier} are supported, where {identifier} gets the partialBranch-information.

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