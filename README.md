<img src="https://www.stefantincu.com/misc/tinnitus-banner.png" alt="preview">

## Tinnitus CMS front-end

Content management application built in React used by Tinnitus Sounds admin to upload, view, edit and delete albums, presets and samples. It features a dashboard to display information about resources, revenue and general overview. Each type of asset has a section which displays resources and search a specific resource by name. For each individual resource there is a page to view its own information and also a page to edit certain fields. To upload an asset the admin must complete a form which requires general information like name, description, category etc., must upload a cover image and an audio file (for samples and presets) and a list of audio files for an album asset. Also each type of asset has a page to manage categories. There is also a page for statistics and reports which display information about client application and resources usage.

## Project Status

This project is currently in development. Minimum features are implemented. Dashboard still needs some work to display revenue gained by client application 
and also the statistics and reports page is not completed yet.

## Installation and Setup Instructions

Installation:

Clone down this repository. Be sure you already have installed `node` and `npm`.

Run `npm install` after above prerequisites.


To Start the application in development mode:

`npm run dev` and visit `localhost:3000`


To format the code:

`npm run format`


To fix warnings:

`npm run fix`


To Build for production:

`npm run build`


## Project Screen Shots

### Home page

![Alt text](https://www.stefantincu.com/tinnitus/home.png "Home")

### Dashboard

![Alt text](https://www.stefantincu.com/tinnitus/dashboard.png "Dashboard")

### Album list

![Alt text](https://www.stefantincu.com/tinnitus/album_list.png "Album list")

### Album upload

![Alt text](https://www.stefantincu.com/tinnitus/album_upload.png "Album upload")

### Album view

![Alt text](https://www.stefantincu.com/tinnitus/album_view.png "Album view")

### Album view

![Alt text](https://www.stefantincu.com/tinnitus/album_edit.png "Album edit")

### Album categories

![Alt text](https://www.stefantincu.com/tinnitus/album_categories.png "Album categories")

### Preset upload

![Alt text](https://www.stefantincu.com/tinnitus/preset_upload.png "Preset upload")



## Reflection  

This started as a side project, but aims to become a product. There are over 100 million people in the world which suffer from a different form of tinnitus from lightweight symptoms to the level where the patient can lose his/her hearing. Unfortunately in most cases tinnitus cannot be cured, but it can be masked with music. The type of music used in masking tinnitus slightly differs from the regular music we hear everyday. There are special frequencies and white noises which are used in different patterns to help the patient not hearing anymore the sounds that irritates him/her. Although these sounds are enough to do the work usually they are combined with ambiental noises or melodic sequences to offer more comfort.

The project was a very good opportunity for improving my skills working on UI/UX for the application and also becoming more efficient in React. 

React was the choice from the start because I am more experienced with this library than with other front-end frameworks. It's easy to setup now using configuration tools like Vite which also helps you bundle everything to be production ready. I used SASS for styling because it helped me a lot dealing with variables, mixins and other reusable parts which I managed more easily. I also like the code to be clean, easily understood and not be prone to errors so Typescript really was the way here especially for declaring types and reuse them in application, always knowing what a function can return or what are the parameters types.
