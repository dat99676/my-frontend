# Stage 1: Build
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY ShopApi.csproj ./
RUN dotnet restore

COPY . .
RUN dotnet publish ShopApi.csproj -c Release -o /app/publish --no-restore

# Stage 2: Run
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app

ENV ASPNETCORE_ENVIRONMENT=Production
ENV PORT=8080

COPY --from=build /app/publish .

EXPOSE 8080
ENTRYPOINT ["dotnet", "ShopApi.dll"]
