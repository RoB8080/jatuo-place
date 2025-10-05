# About this project

This project is a ETS2/ATS Community. The main functionality of this project is to provide a tool to help users building map combo, and correctly ordering their map to avoid crash.

## Features
Our project is aiming to provide prebuilt map combo, and allow user to quickly use them

First of all, user should pick a version of map combo, and pick the mods they want, and then:

1. (WIP) In `Download List` tab, user can configure their local mod file folder, we will compare the generated expected list and current list to tell them what and where to download.
2. In `Mod Order` tab, we will provided a ordered mod file list which is similar to the in-game one, help user to order their mod files in-game.

## Technical Knowledge

- NodeJS 22.x
- PNPM for package management
- Vite, Typescript, React 19
- Styling: TailwindCSS
- Router: Tanstack Router
- UI Component: shadcn UI


### i18n
- We suppose to support English, Russian and Simplified Chinese.
- The locale json file is in `public/locales/${language}/${namespace}.json`
- The default namespace is `common`
- Use `useTranslation` to get `t` in React components
- Always use selector function to translate text, e.g. `t($ => $.xxx.yyy)`, string based is not supported

## Project Structure
- `src`
  - `components`: components used in project
    - `ui`: the basic parts of ui, most of them are added by shadcn, some are modified.
    - `common`: blocks built on ui, make it simpler to build pages
    - `global`: business components used globally, such as Header, ThemeProvider, Language Select and so on.
    - `${route}`: business components used by specified route.
  - `libs`: lots of utils, includes common ones and module specified ones.
  - `routes`: Tanstack file system routes, compose components to build page.
  - `locale`: i18n related files, mostly locale json file.
  - `data`: map combo core data files, every json file is a single version of map combo.

# Tips

- Use english in code, comment and commit messages
- Use nodejs to build temp scripts if necessary

