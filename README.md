# Eversource
[![Build Status](https://travis-ci.org/zoltan-mihalyi/eversource.svg?branch=master)](https://travis-ci.org/zoltan-mihalyi/eversource)

A HTML5-based 2D MMORPG with LPC style pixel graphics.

## Features
- Browser and mobile support with Apache Cordova
- Tiled map support
- NPC characters, character editor
- Character selection
- WebSocket connection with diff replication and relevance check

## How to run

Install dependencies:
```sh
npm install
```
 
Build:
 ```sh
npm run build
```

Run:
```sh
npm run start
```
Open `localhost:8000` in a browser!

## Run Tools
**Eversource Tools** is an nw.js application which can edit presets (npc appearance) and palettes. 

Install nw.js (`tools/runner`) and Tools (`tools`) dependencies: 
```sh
npm install
```
Run from `tools/runner`:
```sh
npm run nw
```