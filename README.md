# Enabled Desktop App [![Tweet](https://img.shields.io/twitter/url/http/shields.io.svg?style=social)](https://twitter.com/intent/tweet?text=Check%20out%20this%20cool%20project&url=https://github.com/rojahno/enabled-desktop&hashtags=project,opensource)

![Github License](https://img.shields.io/badge/license-MIT-green)
![Code Size](https://img.shields.io/github/languages/code-size/rojahno/enabled-desktop)

<img alt="Enabled Desktop App"
        height="350"
        src="https://i.imgur.com/0fa0y9i.png" />

### Description
This Project was created as a Bachelor Thesis at Norwegian University of Science and Technology in Ålesund. The aim of the project is to give patients with ALS a way to perform simple tasks and communicate with the people around them using the [Emotiv Epoc X Headset](https://www.emotiv.com/epoc-x/) 

#### Bachelor Thesis
Here is a link to our thesis if you want to read more into our project - [Bachelor Report]()

## Table of content

- [**Getting Started**](#getting-started)
- [Built With](#built-with)
- [Contributing](#contributing)
- [License](#license)
- [Get Help](#get-help)
- [Acknowledgments](#acknowledgements)


## Getting Started
This app is meant to be used with the Enabled Desktop App which can be found here:
- https://github.com/andesob/Enabled-app

1. Download our app from [here](https://github.com/andesob/Enabled-app).
2. Download the desktop app from [here](#Install).

### Install
Clone the repo via git and install dependencies:

clone:
```bash
gh repo clone rojahno/Enabled-desktop
```
install dependencies:
```bash
yarn
```

## Run application

```bash
yarn start
```

## Packaging for Production

To package apps for the local platform:

```bash
yarn rebuild
```

Mac & Linux on local platforms:
```bash
yarn package
```
Windows:
```bash
yarn electron-builder --win
```

## Built With

- [Electron](https://www.electronjs.org/)
- [React Js](https://reactjs.org/)
- [Typescript](https://www.typescriptlang.org/)

### External Libraries

- [Material UI](https://material-ui.com/)
- [Material Icons](https://material.io/resources/icons/)

## Contributing
<table style="color:blue;">
  <tr>
  <td align="center"><a href="https://github.com/andesob"><img src="https://avatars.githubusercontent.com/u/48057293?s=400&v=4" width="100px;" alt=""/><br /><sub><b>Anders Søbakken</b></sub></td>
  <td align="center"><a href="https://github.com/rojahno"><img src="https://avatars.githubusercontent.com/u/48057307?s=460&v=4" width="100px;" alt=""/><br /><sub><b>Andreas Rojahn Sunde</b></sub></td>
  <td align="center"><a href="https://github.com/EskilTorland"><img src="https://avatars.githubusercontent.com/u/48057831?s=460&v=4" width="100px;" alt=""/><br /><sub><b>Eskil Engebretsen Torland</b></sub></td>
  <td align="center"><a href="https://github.com/trymjor"><img src="https://avatars.githubusercontent.com/u/46708784?s=460&v=4" width="100px;" alt=""/><br /><sub><b>Trym Jørgensen</b></sub></td>
  </tr>
</table>

#### Issues
In the case of a bug report, bugfix or a suggestions, please feel very free to open an issue.

#### Pull request
Pull requests are always welcome, and we'll do our best to do reviews as fast as we can.

### Support
<a href="https://www.buymeacoffee.com/enableda">
    <img alt="Support us with coffee"
        height="80"
        src="https://www.buymeacoffee.com/assets/img/guidelines/download-assets-sm-1.svg" />
</a>  

## License

This project is licensed under the [MIT License](https://github.com/this/project/blob/master/LICENSE)

## Get Help
- If appropriate, [open an issue](https://github.com/this/project/issues) on GitHub

## Acknowledgements

- [README.md template](https://gist.github.com/SimonHoiberg/15db461e2c1c2e933d94ffeb363e2185) used in this project
- [Electron React Boilerplate](https://github.com/electron-react-boilerplate/electron-react-boilerplate) used in this project
