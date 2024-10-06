# WhatsApp-hard - API - NodeJs MultiDevice

This API is an implementation of [WhiskeySockets Baileys](https://github.com/WhiskeySockets/Baileys), as a RESTful API service that controls WhatsApp functions.
This code is primarily based on the [Whatsapp-api-nodejs](https://github.com/salman0ansari/whatsapp-api-nodejs) project, which has been updated and improved over time.
With this code, you can create multi-service chats, service bots, or any other system that uses WhatsApp. With this code, you don't need to know JavaScript for Node.js, just start the server and make requests in the language you feel most comfortable with.

## Installation:

### NPM install:

- Download and install nodejs.
  https://nodejs.org/en/download
  Download or clone this repository. It's recommended to have git installed for future updates:
  https://git-scm.com/downloads
  Command to clone this repository:

```
git clone https://github.com/renatoiub/whatsapp-hard-api-node
```

- Installing dependencies

```
npm i
```

- Rename the env file and configure:
  Rename the .env.example file to **.env**
  Put the application port in the env, and the mimetypes you want to send via API. If you choose to protect the routes, you'll have to send the Bearer token (Authorization: Bearer RANDOM_STRING_HERE) in the requests.

- Starting the application:

```
npm start
```

### Docker install:

- Create an image from the Dockerfile.
- Edit the file according to your needs.
- Command to start the image:
  docker build -t hard-api-whatsapp .
- Make sure you are in the folder where the Dockerfile is

## API Manager

Contribute to the project and get access to the API manager

[Test the API with the Manager!](https://api.hardcodebr.com.br/teste-api)

## Webhook Events:

connection.update
qrCode.update
presence.update
contacts.upsert
chats.upsert
chats.delete
messages.update
messages.upsert
call.events
groups.upsert
groups.update
group-participants.update

## Documentation:

- [Postman Online](https://www.postman.com/bold-spaceship-404300/workspace/hard-api/collection/26659340-899ee985-66f7-44a9-8202-3c80edcc9954?action=share&creator=26659340)

## Sends and Features:

|                                                                                                                | |
|----------------------------------------------------------------------------------------------------------------|---|
| Connection via qr_code                                                                                         | ✔ |
| Connection via pairing code                                                                                    | ✔ |
| Send text                                                                                                      | ✔ |
| Send Buttons                                                                                                   | ❌ |
| Send Template                                                                                                  | ❌ |
| Files: audio - video - image - document - gif <br><br>base64: `true`                                           | ✔ |
| Send Media URL                                                                                                 | ✔ |
| Send Media File                                                                                                | ✔ |
| Convert audio and video to WhatsApp format                                                                     | ✔ |
| Message reply                                                                                                  | ✔ |
| Send presence: Typing.. Recording audio..                                                                      | ✔ |
| Send Location                                                                                                  | ✔ |
| Send List (beta)                                                                                               | ✔ |
| Send Link Preview                                                                                              | ✔ |
| Send Contact                                                                                                   | ✔ |
| Send Reaction - emoji                                                                                          | ✔ |
| Get contacts                                                                                                   | ✔ |
| Groups: Create, join, leave, add contacts, remove contacts and admins. Ghost mention (ghostMention) true       | ✔ |

## Additional Information:

The API does not use any database.
The API is multi-device and accepts multiple connected numbers.
The average memory consumption varies with the number of instances and is extremely light.

Contribute to the project and receive updates:
Contact:
Developer: https://github.com/renatoiub/
Email: renatoiub@live.com
Instagram: @renatoiub.
Contribute to the project and receive updates:
Pix: empresa@estoqueintegrado.com
