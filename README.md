## Renamulon

### What is it?

This is a bulk file renamer for nodejs projects with typescript or javascript

### Usage

``` sh
npx renamulon <directory> [-f format] [-x extensions] [-r] [-d] [-g]

# EXAMPLE

npx renamulon src -f snake -x ts tsx --dry -r
```

Options:
- `<directory>` specifies the directory to start the file renaming.
- `--format`, `-f` is an option that specifies the format style for the file names. The options are `kebab`, `camel`, `pascal`, and `snake`. The default value is `kebab`. 
- `--ext`, `-x` is an option that specifies the list of file extensions to include in the renaming. The default value is `js jsx ts tsx`.

Flags:
- `--dry`, `-d` is an optional flag. No changes will be made on the system if true. The default value is `false`.
- `--use-git`, `-g` is an optional flag. Renaming will be done with `git mv` instead of `mv` if true. The default value is `false`.
- `--remove-dots`, `-r` is an optional flag. It specifies whether dots in file names should be left untouched or formatted out (This does not include the dot before the file extension). The efault value is `false`.

### Testing

``` sh
npm run test
```

### Build

``` sh
npm run build
```