#See https://aka.ms/customizecontainer to learn how to customize your debug container and how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

ENV ASPNETCORE_ENVIRONMENT="Okd"

FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /src

COPY ["KingICT.Academy2023.eMeet.WebAPI/KingICT.Academy2023.eMeet.WebAPI.csproj", "KingICT.Academy2023.eMeet.WebAPI/"]


RUN dotnet restore "KingICT.Academy2023.eMeet.WebAPI/KingICT.Academy2023.eMeet.WebAPI.csproj"
COPY . .
WORKDIR "/src/KingICT.Academy2023.eMeet.WebAPI"
RUN dotnet build "KingICT.Academy2023.eMeet.WebAPI.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "KingICT.Academy2023.eMeet.WebAPI.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "KingICT.Academy2023.eMeet.WebAPI.dll"]