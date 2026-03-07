FROM node:20-alpine

RUN apk add --no-cache perl perl-image-exiftool

WORKDIR /app

COPY package.json .
RUN npm install

COPY server.js .

COPY Image-ExifTool-13.52.tar.gz .
RUN tar -xzf Image-ExifTool-13.52.tar.gz \
    && chmod +x Image-ExifTool-13.52/exiftool

EXPOSE 3000

CMD ["node", "server.js"]
