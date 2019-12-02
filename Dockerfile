FROM node:10


ENV NODE_ENV development
COPY package.json /tmp/package.json

WORKDIR /code
RUN  cd /tmp && \
    echo "npm installing" && \
    npm install && \
    echo "done" && \
    npm cache clean --force && \
    cp -a /tmp/node_modules/ /code && \
    rm -rf /tmp/node_modules

COPY . /code
ENV NODE_ENV production
# RUN npm run build
ENTRYPOINT ["node", "."]
