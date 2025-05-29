FROM node
WORKDIR /
RUN git config --global credential.helper store && \
    git clone https://github.com/renatoiub/whatsapp-hard-api-node.git && \
    cd whatsapp-hard-api-node && \
    npm install

ENV AUTO_UPDATE=true
ENV PROTECT_ROUTES=true
ENV TOKEN=RANDOM_STRING_HERE
ENV PORT=3333
ENV RESTORE_SESSIONS_ON_START_UP=true
ENV APP_URL=http://localhost:3333
ENV LOG_LEVEL=silent
ENV videoMimeTypes=video/mp4,video/avi,video/mkv,video/quicktime,video/x-msvideo,video/x-matroska
ENV audioMimeTypes=audio/mp3,audio/wav,audio/ogg,audio/mpeg
ENV documentMimeTypes=application/pdf,application/msword,application/vnd.ms-excel,application/vnd.ms-powerpoint,application/x-rar-compressed
ENV imageMimeTypes=image/jpeg,image/png,image/gif,image/jpg
ENV MAX_INSTANCES=50
ENV ADMINTOKEN=da71b564a1ed7e998204ca0d7cae38e791ca2154
ENV DEFAULT_AUDIO_OUTPUT=OGG
ENV USER=admin
ENV PASSWORD=adminpass
ENV NODE_ENV=development
ENV SESSION_SECRET=8e46213be6df58e0702d3e8d4b5cf9ba48a610c3
ENV COOKIE_SECRET=da71b564a1ed7e998204ca0d7cae38e791ca2154



EXPOSE $PORT

CMD cd /whatsapp-hard-api-node/ && \
if [ "$AUTO_UPDATE" = true ]; then git pull ; fi && \
     npm start
