FROM grafana/k6:latest

COPY . /app
WORKDIR /app

ENTRYPOINT ["k6", "run", "main.js"]
