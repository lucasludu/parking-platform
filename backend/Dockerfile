# Etapa 1: Construcción (Build) usando el SDK de .NET 10
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# Copiar el archivo de la solución (opcional) y los archivos de proyecto .csproj
COPY ["Parking.slnx", "./"]
COPY ["Parking.API/Parking.API.csproj", "Parking.API/"]
COPY ["Parking.Application/Parking.Application.csproj", "Parking.Application/"]
COPY ["Parking.Domain/Parking.Domain.csproj", "Parking.Domain/"]
COPY ["Parking.Infrastructure/Parking.Infrastructure.csproj", "Parking.Infrastructure/"]

# Restaurar las dependencias (NuGet)
RUN dotnet restore "Parking.API/Parking.API.csproj"

# Copiar todo el resto del código fuente al contenedor
COPY . .
WORKDIR "/src/Parking.API"

# Compilar el proyecto
RUN dotnet build "Parking.API.csproj" -c Release -o /app/build

# Etapa 2: Publicación (Publish)
FROM build AS publish
RUN dotnet publish "Parking.API.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Etapa 3: Imagen final (Runtime) mucho más ligera, solo con ASP.NET Core
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app

# Exponer el puerto por defecto de ASP.NET Core en contenedores modernos
EXPOSE 8080

# Copiar los binarios compilados de la etapa de publicación
COPY --from=publish /app/publish .

# Comando de inicio de la aplicación
ENTRYPOINT ["dotnet", "Parking.API.dll"]
