FROM node:alpine

WORKDIR /usr/app

COPY package*.json yarn.lock ./

# COPY ENV variable
COPY .env ./

# COPY tsconfig.json file
COPY tsconfig.json .

RUN yarn

COPY . .

# RUN yarn build

RUN yarn prisma generate 

# RUN npx prisma db seed

EXPOSE 8000

CMD ["yarn", "start"]