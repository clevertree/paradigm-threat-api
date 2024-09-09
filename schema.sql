DROP TABLE IF EXISTS channels;
CREATE TABLE channels
(
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(64) UNIQUE NOT NULL,
    description VARCHAR(255)       NULL
);
DROP TABLE IF EXISTS users;
CREATE TABLE users
(
    id        SERIAL PRIMARY KEY,
    username  VARCHAR(64) UNIQUE NOT NULL,
    email     VARCHAR(64) UNIQUE NULL,
    full_name VARCHAR(64)        NULL
);

DROP TABLE IF EXISTS posts;
CREATE TABLE posts
(
    id         SERIAL PRIMARY KEY,
    user_id    SERIAL    NOT NULL,
    channel_id SERIAL    NOT NULL,
    created    TIMESTAMP NOT NULL,
    content    TEXT      NOT NULL
);

