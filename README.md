# ModelPrompter

A chat and gesture driven, DIY "everything app"

---

## Features
<table>
  <tr>
    <td>Now</td>
    <td>Soon</td>
  </tr>
  <tr>
    <td>
      <ul>
        <li>Serverless, static site with longterm local storage (IndexedDB via Dexie.js)</li>
        <li>ChatGPT like prompting with Quasar Framework Vue.js frontend (requires OpenAPI Key, other options soon)</li>
        <li>A lot of bugs 🐞</li>
      </ul>
    </td>
    <td>
      <ul>
      <li>Show messages as markdown
      <li>API and auto gpt designer
      <li>Browser extension
      <li>Optional cloud and local storage and sync
      <li>Export to native apps (desktop, mobile, browser extensions)
      <li>Encryption
      <li>a lot more 🚀
      </ul>
    </td>
  </tr>
</table>


<img width="925" alt="image" src="https://user-images.githubusercontent.com/69949201/236665885-310b02d8-0556-409c-8be0-425b888189a4.png">

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
