# TensorBuddy

Turn your desktop folders into unstructured databases and simulate entire communities of expert and autonomous AIs around them

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
git clone https://github.com/ozramos/tensorbuddy
cd tensorbuddy

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