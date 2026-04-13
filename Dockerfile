# ╔══════════════════════════════════════════════════════════════╗
# ║  ClubOS API – Multi-stage Dockerfile for .NET 10             ║
# ║  Client: Al-Faisaly FC | Timezone: Arab Standard Time (AST)  ║
# ╚══════════════════════════════════════════════════════════════╝

# ── STAGE 1: Restore ──────────────────────────────────────────────────────────
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS restore
WORKDIR /src

COPY ["src/ClubOS.API/ClubOS.API.csproj",            "src/ClubOS.API/"]
COPY ["src/ClubOS.Application/ClubOS.Application.csproj", "src/ClubOS.Application/"]
COPY ["src/ClubOS.Domain/ClubOS.Domain.csproj",       "src/ClubOS.Domain/"]
COPY ["src/ClubOS.Infrastructure/ClubOS.Infrastructure.csproj", "src/ClubOS.Infrastructure/"]
COPY ["src/ClubOS.SharedKernel/ClubOS.SharedKernel.csproj", "src/ClubOS.SharedKernel/"]

RUN dotnet restore "src/ClubOS.API/ClubOS.API.csproj"

# ── STAGE 2: Build ────────────────────────────────────────────────────────────
FROM restore AS build
ARG BUILD_CONFIGURATION=Release
COPY . .
WORKDIR "/src/src/ClubOS.API"
RUN dotnet build "ClubOS.API.csproj" -c $BUILD_CONFIGURATION -o /app/build --no-restore

# ── STAGE 3: Publish ──────────────────────────────────────────────────────────
FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "ClubOS.API.csproj" -c $BUILD_CONFIGURATION -o /app/publish \
    --no-restore /p:UseAppHost=false

# ── STAGE 4: Runtime ──────────────────────────────────────────────────────────
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app

# Saudi Arabia timezone (AST = UTC+3)
ENV TZ=Asia/Riyadh
RUN apt-get update && apt-get install -y --no-install-recommends tzdata curl \
    && ln -snf /usr/share/zoneinfo/$TZ /etc/localtime \
    && echo $TZ > /etc/timezone \
    && rm -rf /var/lib/apt/lists/*

# Use the default non-root 'app' user provided by .NET 10 base image
RUN mkdir -p /app/logs && chown -R app:app /app

COPY --from=publish --chown=app:app /app/publish .
USER app

EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080
ENV ASPNETCORE_ENVIRONMENT=Production

# Health check for Azure App Service / Docker
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD curl -f http://localhost:8080/health || exit 1

ENTRYPOINT ["dotnet", "ClubOS.API.dll"]
