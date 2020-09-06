## Renamulon

### What is it?

This is a bulk file renamer for nodejs projects with typescript or javascript

### Usage

``` sh
npx renamulon <directory> [-f format] [-x extensions] [-r] [-d]

# EXAMPLE

npx renamulon src -f snake -x ts tsx --dry -r
```

Options:
- `<directory>` specifies the directory to start the file renaming.
- `--format`, `-f` is an option that specifies the format style for the file names. The options are `kebab`, `camel`, `pascal`, and `snake`. The default value is `kebab`. 
- `--ext`, `-x` is an option that specifies the list of file extensions to include in the renaming. The default value is `js jsx ts tsx`.

Flags:
- `--dry`, `-d` is an optional flag. It specifies whether any changes should be made on the system.
- `--remove-dots`, `-r` is an optional flag. It specifies whether dots in file names should be left untouched or formatted out (This does not include the dot before the file extension).

### Testing

``` sh
npm run test
```

### Build

``` sh
npm run build
```