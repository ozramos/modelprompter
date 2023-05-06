# ModelPrompter

A LangChain/autoGPT powered Ai playground that runs on the desktop and web

---

## Features
### Chat
<img width="658" alt="image" src="https://user-images.githubusercontent.com/69949201/236559884-6fa4ac20-748f-40db-9994-4d7f4dacbd01.png">

<br>
<br>
<br>
<hr>
<br>
<br>
<br>

# Local setup
## Requirements
- git (Linux users may already have this) - https://git-scm.com/download
- NodeJS (>= 16.x; tested with 18.15.x) - https://nodejs.org/en

## Setup
### 1. Install dependencies
```bash
# Clone repo locally
git clone https://github.com/ozramos/modelprompter
cd modelprompter

# Install dependencies
npm i

# Copy tmp.env to .env
cp tmp.env .env
```

### 2. Add environment variables
> 🚨 The `.env` file will contain your API keys, so keep this file safe! It's blocked from being accidently comitted to the repository, but you should still be careful about opening this file (like when streaming)

- [Create an OpenAI API key](https://platform.openai.com/account/api-keys) and add it `OPENAI_API_KEY=` in `.env`


### 3. Run, build, and deploy
```bash
# Start running locally at http://localhost:9000
npm start

# Build the project for the web
npm run build
```


# Troubleshooting


# Database Schema
The core database is currently powered by IndexedDB via [Dexie.js](https://dexie.org/):

```bash
# SERVER
id
name

# CHANNEL
id
name
server

# MESSAGE
id
timestamp
from
to
message

# PERSON
id
timestamp
first
last
bio
photo
channels
```
