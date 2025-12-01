# Backend FullStack P3 - Tienda de Cartas Pokémon

API REST desarrollada con NestJS para una tienda de cartas Pokémon. Incluye sistema de autenticación JWT, gestión de productos, categorías, usuarios y boletas de compra.

## Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- [Node.js](https://nodejs.org/) (versión más reciente recomendada)
- [XAMPP](https://www.apachefriends.org/) con **Apache** y **MySQL**
- Git

## Instalación y Configuración

### 1. Clonar el Repositorio

```bash
git clone https://github.com/NicolasGarridoB/BackendFullStackP3.git
cd BackendFullStackP3
```

### 2. Instalar Dependencias

```bash
npm i
```

### 3. Configurar XAMPP

1. Abre el **Panel de Control de XAMPP**
2. Inicia los servicios de **Apache** y **MySQL**
3. Asegúrate de que MySQL esté corriendo en el **puerto 3307**

> **Nota:** El proyecto está configurado para usar el puerto 3307. Si usas el puerto por defecto (3306), deberás modificar el archivo `.env`.

### 4. Configurar Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto con el siguiente contenido:

```env
# Configuración de Base de Datos MySQL (XAMPP)
DB_TYPE=mysql
DB_HOST=127.0.0.1
DB_PORT=3307
DB_USERNAME=root
DB_PASSWORD=
DB_NAME=test

# Configuración JWT
JWT_SECRET=tu_secreto_super_seguro_y_muy_largo_aqui_123456789
JWT_EXPIRES=1d

# Entorno de ejecución
NODE_ENV=development
```

> **Importante:** La base de datos `test` debe crearse en el admin del mysql con el nombre "test" 
Ejecutar el siguiente comando en mysql:

CREATE DATABASE test;

### 5. Iniciar el Servidor

```bash
npm run start:dev
```

El servidor se iniciará en modo desarrollo y verás en la consola:

```
✔ Aplicación corriendo en: http://localhost:3000
✔ Swagger UI:           http://localhost:3000/docs
```

### 6. Poblar la Base de Datos (Seed)

Una vez que el servidor esté corriendo:

1. Abre tu navegador y ve a: **http://localhost:3000/docs**
2. Desplázate hasta el final de la página, justo **arriba de los schemas**
3. Busca la sección **"Seed"**
4. Ejecuta el endpoint `POST /api/v1/seed` haciendo clic en **"Try it out"** → **"Execute"**
5. Es necesario realizar este paso antes de intentar iniciar sesion como admin o vendedor, ya que estos datos de usuario se inyectan. Las credenciales para iniciar sesión como admin son: 

    usuario: admin
    contraseña: admin123

Esto creará las tablas necesarias e inyectará datos iniciales (usuarios, productos, categorías).

### Probar la APP

Como administrador podrás crear nuevos productos y nuevas categorias, y estas se verán reflejadas en la bd.


## Uso de la API

### Acceder a Swagger UI

Toda la documentación interactiva de la API está disponible en:

** http://localhost:3000/docs**

### Autenticación con JWT

Para endpoints protegidos:

1. Inicia sesión usando el endpoint `/api/v1/auth/login` con las credenciales de un usuario creado por el seed
2. Copia el token JWT que recibes en la respuesta
3. En Swagger, haz clic en el botón **"Authorize"** (🔒) en la parte superior
4. Pega el token en el campo correspondiente
5. Haz clic en **"Authorize"** y luego **"Close"**

Ahora podrás acceder a todos los endpoints protegidos.

##  Estructura del Proyecto

```
src/
├── auth/           # Autenticación y autorización (JWT, Guards, Decorators)
├── users/          # Gestión de usuarios
├── productos/      # Gestión de productos
├── categorias/     # Gestión de categorías
├── boletas/        # Gestión de boletas de compra
├── seed/           # Datos iniciales para la base de datos
├── app.module.ts   # Módulo principal
└── main.ts         # Punto de entrada de la aplicación
```

## Tecnologías Utilizadas

- **NestJS** - Framework de Node.js
- **TypeORM** - ORM para TypeScript
- **MySQL** - Base de datos
- **JWT** - Autenticación
- **Swagger** - Documentación de API
- **class-validator** - Validación de datos
- **bcrypt** - Encriptación de contraseñas

##  Scripts Disponibles

```bash
# Desarrollo con hot-reload
npm run start:dev

# Compilar el proyecto
npm run build

# Producción
npm run start:prod

# Ejecutar tests
npm run test

# Formatear código
npm run format

# Linting
npm run lint
```

##  Seguridad

- Las contraseñas se encriptan usando **bcrypt**
- Autenticación mediante **JWT** (JSON Web Tokens)
- Validación de datos en todos los endpoints
- Guards para proteger rutas según roles de usuario
- CORS configurado para permitir peticiones desde el frontend

