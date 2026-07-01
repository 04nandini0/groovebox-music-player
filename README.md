# Groovebox — Spotify Web Player UI Clone

A frontend recreation of the Spotify Web Player experience, built with **plain HTML5, CSS3, and vanilla JavaScript (ES6+)** — no frameworks, no libraries.

> UI recreation project built by **Nandini Sharma** for learning and internship demonstration purposes.

This project recreates the *look, layout, and interaction patterns* of a music streaming web app. It does **not** use any official Spotify logos, brand assets, or copyrighted media — all album art is generated placeholder artwork (SVG), and all audio is short original placeholder tones so the Audio API features can be demoed end-to-end.

---

## Project overview

The app has four main regions, matching a typical music-streaming dashboard:

- **Sidebar** — logo, primary navigation (Home / Search / Your Library), playlist actions (Create Playlist, Liked Songs), and a scrollable playlist list.
- **Top header** — back/forward navigation, a live search bar, and a profile button.
- **Main content** — Recently Played, Made For You, Trending Music, and Liked Songs sections, all built from card grids.
- **Bottom player** — persistent playback bar with cover art, track info, transport controls, a seek bar, and volume control.

---

## Features

- 🎵 Dynamic song rendering from a JavaScript array of song objects
- ▶️ Full playback controls using the native **HTML5 Audio API** (play, pause, next, previous)
- 🔀 Shuffle and repeat toggles
- 📊 Live progress bar with current time / total duration and click-to-seek
- 🔊 Volume slider
- 🔍 Real-time search across song title, artist, and album — updates the grid and the playback queue as you type
- ❤️ Like / unlike songs, persisted with **localStorage** so likes survive a page refresh
- 📱 Fully responsive: full sidebar on desktop, icon-only sidebar on tablet, collapsible off-canvas sidebar on mobile
- ✨ Hover/zoom animations on cards, fade-in section transitions, and a smooth play-button reveal
- ♿ Visible keyboard focus states and `prefers-reduced-motion` support

---

## Technologies used

| Layer      | Tech                                   |
|------------|-----------------------------------------|
| Structure  | Semantic HTML5                          |
| Styling    | CSS3 — Custom Properties, Flexbox, Grid, media queries |
| Behavior   | Vanilla JavaScript (ES6+) — no frameworks or build tools |
| Storage    | `localStorage` for liked songs          |
| Media      | `<audio>` element + HTML5 Audio API     |

No React, Next.js, Tailwind, Bootstrap, or any other framework/library is used.

---

## Folder structure

```
project/
│
├── index.html            # Page structure: sidebar, header, content, player
├── css/
│   └── style.css         # Variables, layout, components, responsive rules
├── js/
│   └── script.js         # Song data, audio logic, search, likes, rendering
├── assets/
│   ├── images/           # Placeholder SVG covers, logo, avatar
│   └── audio/            # Placeholder demo audio (short original tones)
└── README.md
```

---

## How to run locally

No build step or server is strictly required, but running through a local server avoids any browser restrictions on loading local audio/image files:

**Option 1 — just open it**
1. Download/clone the `project/` folder.
2. Double-click `index.html` to open it in your browser.

**Option 2 — local server (recommended)**
```bash
cd project
python3 -m http.server 8000
# then open http://localhost:8000 in your browser
```
or, with Node installed:
```bash
npx serve .
```

---

## Customizing it

Look for `TODO` comments throughout the code — they mark the exact spots to swap in your own content:

- `index.html` — logo, avatar, cover placeholders
- `js/script.js` — the `songs` array at the top of the file (title, artist, image, audio path)
- `assets/images/` and `assets/audio/` — drop in your own cover art and `.mp3`/`.wav` files, then update the paths in `script.js`

---

## Learning outcomes

Building this project demonstrates:

- Structuring a multi-region app layout (sidebar + header + scrollable content + fixed player) with **Flexbox and CSS Grid**
- Managing UI **state** in vanilla JS (current song, play/pause, shuffle, repeat, liked list) without a framework
- Working with the **HTML5 Audio API**: loading metadata, tracking `timeupdate`, seeking, and handling the `ended` event
- Persisting user data with **localStorage** and keeping the UI in sync with it
- Writing **responsive CSS** that meaningfully changes layout across desktop, tablet, and mobile breakpoints
- Building reusable rendering functions that generate DOM elements from data, instead of hardcoding markup
- Basic accessibility practices: focus states, `aria-label`s, and reduced-motion support

---

*This is an independent, unofficial UI study created for educational purposes. It is not affiliated with or endorsed by Spotify.*
