# frnpm
``` frnpm ``` A simple automatic time adjustment tool for smooth random number adjustment in Pokemon 4th generation.

## Demo
![frnpm_demo_01](https://user-images.githubusercontent.com/56142286/77245662-970d1300-6c63-11ea-95cb-d683ad19feee.gif)

## Getting Started

### Install
This is a Node.js module available through the npm registry.  
Installation is done using the ``` npm install ``` command:
```
$ npm install -g frnpm

# OR

$ yarn global add frnpm
```

## Usage
Run the app using ``` frnpm ``` command:

Start the app:
```
$ frnpm start
```

### Set a preset
The value set as a preset will be applied to each field as the initial value from the next time.  
For example, the following ``` package.json ```:
```
{
  ...
  "scripts": { ... },
  "preset": {
    "blank": 228,
    "select": 10
  }
}
```

Format and display the log:
```
$ frnpm log [options]

  Options:

    -u, --unique  Format into unique log data
    -r, --result  Format log data into results only
    -n, --newest  Format log to newest order
```

## License
The MIT License ([MIT](https://github.com/flatten-js/frnpm/blob/master/LICENSE))
