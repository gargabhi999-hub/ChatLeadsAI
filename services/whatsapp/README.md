# WA Extractor

Automatically extracts **name, mobile number, and email** from incoming WhatsApp messages
(text and images) and writes each contact as a new row in Google Sheets.

```
WhatsApp (personal) → Baileys → Claude API → Google Sheets
```

---

## Prerequisites

- Node.js 18+
- An Anthropic API key → https://console.anthropic.com
- A Google Cloud project with Sheets API enabled

---

## 1 — Install

```bash
npm install
cp .env.example .env
```

Edit `.env` and fill in your keys (see sections below).

---

## 2 — Google Sheets setup

### 2a — Create a service account

1. Go to https://console.cloud.google.com
2. Create a project (or select an existing one)
3. Enable **Google Sheets API** (APIs & Services → Library)
4. Go to **APIs & Services → Credentials → Create Credentials → Service Account**
5. Give it any name, click **Done**
6. Click the service account → **Keys** tab → **Add Key → JSON**
7. Save the downloaded file as `google-service-account.json` in this folder

### 2b — Share your spreadsheet

1. Create a new Google Sheet
2. Copy the spreadsheet ID from the URL:
   `https://docs.google.com/spreadsheets/d/`**`<THIS_IS_YOUR_SHEET_ID>`**`/edit`
3. Open the sheet → **Share** → paste the service account email (from the JSON file, field `client_email`) → give it **Editor** access
4. Set `GOOGLE_SHEET_ID` in `.env`

---

## 3 — Anthropic API key

Get your key from https://console.anthropic.com/keys
Set `ANTHROPIC_API_KEY` in `.env`

---

## 4 — Run

```bash
npm start
```

On first run a **QR code** appears in the terminal.
Open WhatsApp → **Settings → Linked Devices → Link a Device** and scan it.

The session is saved in `./auth_info/` so you only need to scan once.

---

## How it works

| Message type | What happens |
|---|---|
| Text | Sent to Claude as-is for NLP extraction |
| Image / screenshot | Downloaded, base64-encoded, sent to Claude Vision |
| Image document | Same as image |
| Sticker / video / audio | Ignored |

Claude returns `{ name, mobile, email, confidence }`.
Rows are only written when `confidence ≥ MIN_CONFIDENCE` (default 0.6)
and the sender+contact combo hasn't been seen in the last 24 h (dedup).

---

## Google Sheet columns

| Column | Description |
|---|---|
| Timestamp | ISO 8601 UTC |
| Sender Name | WhatsApp display name |
| Sender Phone | Phone number from JID |
| Extracted Name | Name found in message |
| Mobile | Phone number found in message |
| Email | Email found in message |
| Confidence | 0.00 – 1.00 |
| Source | `text` or `image` |
| Raw Snippet | First 120 chars of message |

---

## Optional config

```env
# Only listen to specific chats (JIDs). Leave empty = all chats.
ALLOWED_JIDS=919876543210@s.whatsapp.net,911234567890@s.whatsapp.net

# Confidence threshold (0–1)
MIN_CONFIDENCE=0.6

# Sheet tab name
SHEET_NAME=Contacts
```

---

## Running in the background (Linux/Mac)

```bash
# Using PM2
npm install -g pm2
pm2 start npm --name wa-extractor -- start
pm2 save && pm2 startup
```

---

## Important note on unofficial API usage

This project uses **Baileys**, an unofficial reverse-engineered WhatsApp client.
Using unofficial clients may violate WhatsApp's Terms of Service and could result
in your number being temporarily or permanently banned.

- Do not use this on your primary number
- Use a dedicated SIM / number for extraction
- For production/business use, consider the official WhatsApp Business API

---

## Troubleshooting

| Problem | Fix |
|---|---|
| QR not scanning | Delete `auth_info/` and restart |
| `PERMISSION_DENIED` from Sheets | Re-check that the service account email has Editor access on the sheet |
| Low extraction rate | Lower `MIN_CONFIDENCE` to 0.4 and review the Confidence column |
| Getting banned | Use a fresh number; don't run 24/7 on a heavily active account |
