# github-init

> Command Line tool to create repository on GitHub

## Install

```
$ [sudo] npm install -g init-github
```

## Preview

<p align="center">
<img src="https://raw.githubusercontent.com/rabingaire/github-init/master/github.gif">
</p>

## Usage 

```
 $ github
```

## Setup

This tool requires auth tokens to create repositories on Github. You'll need to follow the given steps in order to use this tool.

- Generate [Personal Access Tokens](https://github.com/settings/tokens/new)

- Run `$ github` and hit `ctrl + c`

- Now, go to your `home directory` which is basically `/home/username` and hit `ctrl + h` to find the hidden folders

- Search for `.repogit` folder

- Open the `token.json` file insdie the `.repogit` folder

- Paste your `personal access token` and save the file.

- Run `$ github` again to successfully create repositories

## License

MIT &copy; [Rabin Gaire](http://rabingaire.com.np/)
