# ---- Dependencies ----
FROM node:24-alpine AS build
WORKDIR /app
COPY . .
RUN yarn install --frozen-lockfile
RUN yarn build:subpath

FROM nginx:1.24-alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD [ "nginx", "-g", "daemon off;" ]
