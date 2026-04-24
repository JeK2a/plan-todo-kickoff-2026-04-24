FROM nginx:1.27-alpine

COPY index.html /usr/share/nginx/html/index.html
COPY app.js /usr/share/nginx/html/app.js
COPY taskLogic.js /usr/share/nginx/html/taskLogic.js
COPY styles.css /usr/share/nginx/html/styles.css

EXPOSE 80
