FROM node:22-alpine

# Thư mục làm việc trong container
WORKDIR /app

# Copy package.json và package-lock.json của tu-vi-app vào
COPY tu-vi-app/package*.json ./tu-vi-app/
RUN cd tu-vi-app && npm install

# Copy toàn bộ code
COPY . .

# Build ứng dụng Vite
RUN cd tu-vi-app && npm run build

# Cài đặt công cụ serve để phục vụ web tĩnh
RUN npm install -g serve

# Mở port 7860 theo yêu cầu của Hugging Face Spaces
EXPOSE 7860

# Chạy ứng dụng
CMD ["serve", "-s", "tu-vi-app/dist", "-l", "7860"]
