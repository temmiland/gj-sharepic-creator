#
# Copyright (C) 2024 Temmi Pietsch - All Rights Reserved
#
# You may not use, distribute or modify this code without the explicitly
# permission of the author.
#

FROM oven/bun AS builder

LABEL MAINTAINER="Temmi Pietsch <welcome@temmi.land>"

COPY . /app

WORKDIR /app

RUN bun --version && \
	bun pm cache rm && \
	bun i && \
	bun run build

FROM nginx:stable-alpine

LABEL maintainer="Temmi Pietsch <welcome@temmi.land>"

COPY --from=builder /app/dist/ /app/src/robots.txt /app/src/sitemap.xml /usr/share/nginx/html/

COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

CMD ["nginx", "-g", "daemon off;"]

EXPOSE 95
