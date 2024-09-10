# Here we are getting our node as Base image
FROM node:20.10.0

# create user in the docker image
USER node

# Creating a new directory for app files and setting path in the container
RUN mkdir -p /home/node/app && chown -R node:node /home/node/app

# setting working directory in the container
WORKDIR /home/node/app

# copy package.json into the container
COPY --chown=node:node package.json .

# installing the dependencies into the container
RUN npm install

# only install dependencies in production mode in the container pass ARG from compose file
# ARG NODE_ENV
# RUN if [ "$NODE_ENV" = "development" ]; \
#     then npm install; \
#     else npm install --only=production; \
#     fi

# grant permission of node project directory to node user & copy all files
COPY --chown=node:node . .

# container exposed network port number
# ENV PORT 4000 - can be overridden
EXPOSE 4000

# command to run within the container
CMD [ "npm", "start" ]