FROM eclipse-temurin:17-jdk-alpine AS build
WORKDIR /app

COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .

# ✅ Fix permissions BEFORE running mvnw
RUN chmod +x ./mvnw

# Now we can safely run mvnw
RUN ./mvnw -q -ntp dependency:go-offline

COPY src ./src
RUN ./mvnw package -DskipTests

FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar

ENTRYPOINT ["java","-jar","app.jar"]
