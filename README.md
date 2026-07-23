# 🚀 Downzilla

<div align="center">

![Downzilla Banner](https://img.shields.io/badge/Download-Everything-blue?style=for-the-badge)

**A modern, high-performance online media downloader supporting hundreds of websites.**

Download videos, audio, playlists, subtitles and metadata from YouTube and 200+ supported platforms without installing any software.

---

[Features](#features) •
[Architecture](#architecture) •
[Installation](#installation) •
[API](#api) •
[Roadmap](#roadmap)

</div>

---

# 📖 Overview

Downzilla is a full-stack media downloading platform built to provide a fast, secure and scalable way to download online content.

Unlike traditional downloaders, Downzilla separates the frontend from the backend, allowing the application to scale independently while providing a smooth user experience.

The backend is powered by **Node.js**, **yt-dlp**, and **FFmpeg**, while the frontend is a lightweight Vanilla JavaScript Single Page Application.

---

# ✨ Features

## 🎥 Video Downloads

- MP4 Downloads
- Multiple resolutions if available 
- Audio + Video merging
- auto quality selection
- Custom quality selection, sometimes is overwritten by auto quality selection

---

## 🎵 Audio Downloads

- MP3 Extraction
- Original Audio

---

## 📂 Playlist Support

- Playlist metadata
- ZIP packaging *(planned)*

---

## 🌍 Supported Websites

Supports **200+ websites** through yt-dlp including:

- YouTube
- Vimeo
- TikTok
- Facebook
- Instagram
- Twitter/X
- Reddit
- SoundCloud
- Twitch

and hundreds more.

---

## 📄 Metadata Extraction

Retrieve

- Thumbnail
- Duration
- Title
- Description
- Channel
- Formats

without downloading the media.

---

## ⚡ Performance

- Fast metadata extraction (mostly impacted by host)
- Parallel format processing
- IPv4 fallback
- Retry handling
- Cookie support (for YouTube)
- Automatic format filtering (144p to 1080p)

---

# 🏗 Architecture

```text
                         ┌─────────────────────┐
                         │      User Browser   │
                         └──────────┬──────────┘
                                    │
                                    │ HTTPS
                                    ▼
                      ┌──────────────────────────┐
                      │      Frontend SPA        │
                      │   Vanilla JavaScript     │
                      │     Hosted on Netlify    │
                      └──────────┬───────────────┘
                                 │
                          REST API Requests
                                 │
                                 ▼
                 ┌────────────────────────────────┐
                 │         Node.js Backend         │
                 │            Express              │
                 └───────┬───────────────┬─────────┘
                         │               │
                         │               │
                  yt-dlp Engine      FFmpeg
                         │               │
                         └───────┬───────┘
                                 │
                                 ▼
                     Media Processing Layer
                                 │
                                 ▼
                       Stream / Download URL
                                 │
                                 ▼
                              User
```

---

# 🛠 Tech Stack

## Frontend

- HTML5
- CSS3
- Vanilla JavaScript
- little tailwindcss 
---

## Basic Backend 

- Node js
- Express.js

## streaming Backend

- Node.js
- Express.js
- yt-dlp
- FFmpeg

---

## Hosting

Frontend

- Netlify

Backend

- Render

Streaming Backend
- Railway (not in use anymore)
- Render (running with docker)

---

## Utilities

- Child Process
- Streams
- Crypto
- File System
- Path

---

# 📂 Project Structure

```text
downzilla/

├── frontend/
│   ├── styles/
│   ├── js/
|   |-- ui-component/s
│   ├── images/
│   └── index.html
├── package.json
└── README.md
```

---

# ⚙ How It Works

1. User enters a URL.

2. Frontend sends the URL to the basic backend.

3. basic backend creates a process tracker to track the metadata extraction them queries the stream backend.

4. streaming Backend validates the URL.

5. yt-dlp extracts metadata.

6. metadata then sent to basic backend then the process tracker for this process is deleted then sent to frontend 

7. Formats are filtered.

8. User selects preferred quality.

9. Stream Backend downloads or streams media directly.

10. FFmpeg merges audio/video when necessary.

11. Final media is returned to the user.

12. user can share download links and share there non age sensitive content publicly on the application for all users.

---

# 📡 API Flow

```text
Client
   │
   ▼
POST /extract
   │
   ▼
Validate URL
   │
   ▼
yt-dlp
   │
   ▼
Metadata JSON
   │
   ▼
Filter Formats
   │
   ▼
Return Response
```

---

# 🔒 Security

- Input validation
- URL sanitization
- Temporary file cleanup
- Safe filename generation

---

# 📈 Future Roadmap

- [ ] ZIP playlist downloads
- [ ] Subtitle downloads
- [ ] Video trimming
- [ ] Mobile application

---

# 🤝 Contributing

Contributions are welcome!

Feel free to

- Open issues
- Submit pull requests
- Suggest features
- Improve documentation

---

# 📜 License

got none

---

# ⚠ Disclaimer

Downzilla is intended for downloading content that you own or have permission to download.

Users are responsible for complying with the Terms of Service and copyright laws applicable in their jurisdiction.

---

# ❤️ Built With

- Node.js
- Express
- yt-dlp
- FFmpeg
- Vanilla JavaScript

---

<div align="center">

**Download made easy. Download faster.**

Made with ❤️ using Open Source Software, appreciate yt-dlp and ffmepeg 🙏.

</div>
