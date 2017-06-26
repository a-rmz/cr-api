# What is CRAPI
The **Character Recognition API** is a web service that provides AI-powered recognition for handwritten characters. It provides a simple interface and entry point hiding all the details of the implementation from the final user.


## Why are we doing this?


A lot of programs use OCR (Optical Character Recognition), mostly for scanners and text recognition systems. Even thought there have been significant advances within the field, most of them are app-specific (like Microsoft's OneNote, which allows to import the scanned text to a note).


------------------------------
# Minimum viable implementation
Real-time single-character recognition.
- RESTful API
- Image processing module
- Neural Network / Classifier
- Text formatter
![Image](https://user-images.githubusercontent.com/15201480/27545499-9218effe-5a55-11e7-8f02-e5bff71c01bc.png)
## RESTful API
> Technology proposal: [Feathers](https://feathersjs.com)


Provides an entry point and access to the backend service. It must implement a [rate limit](http://nordicapis.com/stemming-the-flood-how-to-rate-limit-an-api/) to avoid flooding the API. It must do session handling to ensure the processed text is returned to the right client.


## Image processing
> Technology proposal: [JIMP](https://github.com/oliver-moran/jimp)


Increaeses the contrast of the image to get nitid black and white. Crops the whole text into character tokens and reduces the size (resolution) of each token to a 8 (w) x 16 (h) proportioned grid for each character.


## Neural Network / Classifier
> Technology proposal: TBD


Takes care of the classification of each character.


## Text formatter
> Technology proposal: TBD


Stitches all the classified characters into a single plain text, which is to be returned to the client.


------------------------------


# Optional: CRAPP
## Description
A mobile client developed with [React Native](https://facebook.github.io/react-native/) to provide a client to access the API, as well as a clean interface to use it.
