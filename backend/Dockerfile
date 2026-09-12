FROM node:20-bookworm

RUN apt-get update \
  && apt-get install -y --no-install-recommends python3 python3-pip \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev

COPY ml/requirements.txt ./ml/requirements.txt
RUN pip3 install --no-cache-dir --break-system-packages -r ml/requirements.txt

COPY . .
ENV NODE_ENV=production
ENV PYTHON_PATH=python3
EXPOSE 5000
CMD ["node", "server.js"]
