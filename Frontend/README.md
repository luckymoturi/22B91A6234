# URL Shortener

A simple web app to shorten long URLs and track clicks. Built with React and Material-UI.

## What it does

This app lets you turn long URLs into short ones that are easier to share. You can also see how many times people clicked on your links.

## Main features

- Shorten URLs with custom names if you want
- Set expiration dates for your links
- See click statistics and analytics
- Add multiple URLs at once
- Works on mobile and desktop

## Screenshots

![Main interface for shortening URLs](Screenshot%202025-06-27%20124516.png)

This is where you enter your long URLs and create short ones. You can add a custom shortcode or let the app generate one automatically.

![Statistics page showing your shortened URLs](Screenshot%202025-06-27%20124527.png)

The statistics page shows all your shortened URLs with click counts, creation dates, and other useful info.

## How to run it

1. Download or clone this project
2. Open terminal and navigate to the project folder
3. Run `npm install` to install dependencies
4. Run `npm start` to start the app
5. Open your browser to http://localhost:3000

## How to use

1. Enter a long URL in the text field
2. Optionally add a custom shortcode (3-12 characters)
3. Set how long you want the link to work (in minutes)
4. Click "Shorten URLs" to create your short link
5. Copy and share your new short URL
6. Check the Statistics tab to see click data

## Tech used

- React for the frontend
- Material-UI for the design
- React Router for navigation
- Local storage to save your URLs

## Project structure

- `App.js` - Main app with routing
- `URLShortenerApp.js` - The main shortener interface
- `RedirectHandler.js` - Handles redirects when someone clicks a short URL
- `Logger.js` - Simple logging system

## Notes

- All data is stored locally in your browser
- URLs expire based on the time you set
- The app generates random 6-character codes if you don't provide a custom one
- Click tracking includes timestamps and referrer information
