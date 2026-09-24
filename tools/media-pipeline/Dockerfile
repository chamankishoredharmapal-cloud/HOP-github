FROM node:22-bookworm-slim

RUN apt-get update && apt-get install -y --no-install-recommends \
    libvips-dev \
    imagemagick \
    ffmpeg \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /pipeline

COPY package.json ./
RUN npm install --production

COPY . .

ENTRYPOINT ["node", "src/cli.mjs"]
