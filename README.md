# StoryTower

## Overview

StoryTower is a React Native mobile application with a backend that leverages web scraping to build and maintain a catalog of manhwa (Korean comics) from various websites. The application utilizes GraphQL, Apollo Server, and MongoDB technologies to provide a seamless and efficient user experience.

## Features

- Browse a vast collection of manhwa from different websites.
- Search for specific manhwa titles and discover new ones.
- Save your favorite manhwa to your personal collection.
- Read manhwa chapters within the app.

## Technologies Used

- React Native: A JavaScript framework for building cross-platform mobile apps.
- GraphQL: A query language for APIs that enables clients to request exactly the data they need.
- Apollo Server: A GraphQL server that connects to the React Native front-end.
- MongoDB: A NoSQL database to store and retrieve manhwa data.
- Web Scraping: The backend performs web scraping on various manhwa websites to gather catalog information.

## Installation

1. Clone the repository: `git clone https://github.com/squarecylinder/StoryTower.git`
2. Navigate to the project directory: `cd StoryTower`
3. Install dependencies: `npm install`
4. Start the development server: `npm start`

## Configuration

- The backend web scraping sources are located in the `src/scraping/webScraper.js` file. You can add or modify web scraping sources to fetch data from different manhwa websites.
- MongoDB connection settings can be configured in the `config/connection.js` file.

## Usage

1. Launch the StoryTower mobile application on your device or emulator.
2. Browse the manhwa catalog, search for titles, and read your favorite manhwa chapters.
3. Save manhwa to your personal collection for easy access.

## Contributing

We welcome contributions to enhance and expand the StoryTower app. If you find a bug, have an idea for an improvement, or want to add new features, please open an issue or submit a pull request.

## License

This project is licensed under the [MIT License](https://opensource.org/licenses/MIT).

