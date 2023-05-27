# ModelPrompter

> An AI-driven digital garden...imagine Notion + Codepen + Stable Diffusion + Auto GPT all in one app

---

## Features
<table>
  <tr>
    <td><img width="549" alt="Screenshot 2023-05-22 080401" src="https://github.com/ozramos/modelprompter/assets/69949201/b2389e50-1fb1-4217-be90-0b864735ab94">
    </td>
    <td>
<h3>Write and edit Markdown and JavaScript</h3>     
      
https://github.com/ozramos/modelprompter/assets/69949201/57ee300e-d2cc-4d1b-a5e2-ea60470191cf

  </tr>
  <tr>
    <td>
      <h3>Live code with any library or framework</h3>
      
https://github.com/ozramos/modelprompter/assets/69949201/5f41da86-eb2e-46f4-9c03-2845e69f7b46

  </tr>  
</table>

## Features
### Offline with opt-in cloud sync
- offline
  - in-browser data storage with IndexedDB
  - import/export .json
- cloud
  - create and/or sync to your own (https://dexie.org/cloud)

### Editing
- Right click (or long tap) to edit messages
  - Markdown with executable HTML and JavaScript
  - Use a customizable monaco editor (same as VSCode)
- Unsandboxed HTML and JavaScript with access to page var

### Branding
- Easy to rebrand (instructions soon)

## [more info coming soon]

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

# Building
## Static site
```
# Just build
npm run build

# Build and test
npm run test
```

# Cloud
coming soon

## Extra setup
- `npx dexie-cloud connect`
- `npx dexie-cloud whitelist http://localhost:9000 http://localhost:8000` etc
- Local cloud setup soon

# Troubleshooting

# Database Schema (out of date)
The core database is currently powered by IndexedDB via [Dexie.js](https://dexie.org/):

```bash
# SERVER
id
name

# CHANNEL
id
name
server
prompt

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
