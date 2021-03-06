### STAGE 1: Compile ###
FROM node:12 as angular_builder
ARG build=0

RUN npm set progress=false && npm config set depth 0 && npm cache clean --force

WORKDIR /home/node/app

COPY . .

RUN yarn install

# use npm as it handles the parameter differently than yarn
RUN npm run-script pre-build --BUILD=$build
RUN yarn run build:plugin

### STAGE 2: Upload sourcemaps ###
FROM getsentry/sentry-cli as sourcemap_upload
ARG sentry=""
ARG build=0

COPY --from=angular_builder /home/node/app/dist /work

RUN sentry-cli --auth-token $sentry releases -o mypet new -p skilltree-creator PLUGIN-3.0-b$build
RUN sentry-cli --auth-token $sentry releases -o mypet -p skilltree-creator files PLUGIN-3.0-b$build upload-sourcemaps /work
RUN sentry-cli --auth-token $sentry releases -o mypet -p skilltree-creator finalize PLUGIN-3.0-b$build

ENTRYPOINT []

### STAGE 3: Upload to maven repo ###
FROM maven as artifact_upload
ARG mavenUser=""
ARG mavenPassword=""

WORKDIR /opt

RUN mkdir /opt/gui
COPY --from=angular_builder /home/node/app/dist /opt/gui
COPY ./pom.xml /opt/pom.xml
COPY ./settings.xml /opt/settings.xml
RUN mvn --settings settings.xml -B -Duser=${mavenUser} -Dpassword=${mavenPassword} clean deploy
