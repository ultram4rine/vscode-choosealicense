FROM gitpod/workspace-node

RUN sudo install-packages libnss3 libatk1.0-0 libatk-bridge2.0-0 libdrm2 libgtk-3-0 libgbm1 libasound2 xauth xvfb
RUN npm install -g yarn npm-check-updates