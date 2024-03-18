# OpenMusic API V1

## Project setup
### Setup PostgreSQL using Docker
#### Pull docker image and run docker image of postgres
```
docker pull postgres
docker run --name postgres -e POSTGRES_PASSWORD=supersecretpassword -p 5432:5432 -d postgres
```

#### Access postgres container
```
docker exec -it postgres bash
psql -U postgres
```

#### Create user
```
CREATE USER developer WITH ENCRYPTED PASSWORD 'supersecretpassword';
```

#### Create database
```
CREATE DATABASE notesapp;
```

#### Manage user access
```
GRANT ALL ON DATABASE notesapp TO developer;
ALTER DATABASE notesapp OWNER TO developer;
```

### Install Dependency
```
npm install
```

### Run Migration
```
npm run migrate up
```

### Start App
```
npm run start:dev
```