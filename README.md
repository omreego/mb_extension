# Metabase API Chrome Extension

This Chrome extension allows you to interact with the Metabase API using your current session token.

## Features

- Automatically detects Metabase session tokens
- Provides an interface to check session status
- Allows making API calls to Metabase endpoints

## Installation

1. Clone this repository or download the files
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked" and select this directory

## Usage

1. Log in to your Metabase instance
2. Click the extension icon in your Chrome toolbar
3. Use the "Check Session" button to verify your connection
4. The extension will automatically retrieve your session token

## Development

To modify or extend the extension:

1. Make your changes to the source files
2. Go to `chrome://extensions/`
3. Click the refresh icon on the extension card
4. Test your changes

## Files

- `manifest.json`: Extension configuration
- `popup.html`: Extension popup interface
- `popup.js`: Popup interaction logic
- `background.js`: Background script for session handling
- `contentScript.js`: Page interaction script

## Note

Make sure you have the necessary permissions to access your Metabase instance's API endpoints. 