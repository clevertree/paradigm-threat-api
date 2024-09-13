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

/* Keyword Searching */

DROP TABLE IF EXISTS search_keywords;
CREATE TABLE search_keywords
(
    id      SERIAL PRIMARY KEY,
    keyword VARCHAR(64) UNIQUE NOT NULL
);



DROP TABLE IF EXISTS search_paths;
CREATE TABLE search_paths
(
    id      SERIAL PRIMARY KEY,
    path    VARCHAR(256) UNIQUE NOT NULL,
    crc32   INTEGER             NOT NULL,
    updated TIMESTAMP           NOT NULL
);



DROP TABLE IF EXISTS search_path_keywords;
CREATE TABLE search_path_keywords
(
    path_id    SERIAL,
    keyword_id SERIAL,
    count      INTEGER
);
CREATE INDEX idx_search_path_keywords ON search_path_keywords (path_id, keyword_id);

DROP TYPE search_pair_keyword_count;
CREATE TYPE search_pair_keyword_count as
(
    keyword VARCHAR(64),
    count   INTEGER
);

DROP FUNCTION search_add_keywords_to_path;
CREATE FUNCTION search_add_keywords_to_path(
    newPath VARCHAR(256),
    newCRC32 INTEGER,
    pairListString TEXT) RETURNS VOID AS
$$
DECLARE
--     keywords     VARCHAR(64)[];
--     newKeyword   VARCHAR(64);
    newPathID    INTEGER;
    newKeywordID INTEGER;
    pairList     VARCHAR(66)[];
    pairString   VARCHAR(66);
    pairEntry    VARCHAR(66)[];
    pairKeyword  VARCHAR(64);
    pairCount    INTEGER;
BEGIN
    pairList = string_to_array(pairListString, ',');

    SELECT sp.id FROM search_paths sp WHERE sp.path = newPath INTO newPathID;
    IF newPathID IS NULL THEN
        INSERT INTO search_paths (path, crc32, updated)
        VALUES (newPath, newCRC32, NOW())
        returning id into newPathID;
        raise notice 'Inserting new path: %', newPath;
    ELSE
        UPDATE search_paths SET crc32 = newCRC32, updated = NOW() WHERE path = newPath;
    END IF;

    DELETE FROM search_path_keywords spk WHERE spk.path_id = newPathID;

    FOREACH pairString IN ARRAY pairList
        LOOP
            pairEntry = string_to_array(pairString, ':');
            pairKeyword = pairEntry[1];
            pairCount = pairEntry[2]::int;

            SELECT sk.id FROM search_keywords sk WHERE sk.keyword = pairKeyword INTO newKeywordID;
            IF newKeywordID IS NULL THEN
                INSERT INTO search_keywords (keyword)
                VALUES (pairKeyword)
                returning id into newKeywordID;
                raise notice 'Inserting new keyword: %', pairKeyword;
            END IF;

            INSERT INTO search_path_keywords (path_id, keyword_id, count)
            VALUES (newPathID, newKeywordID, pairCount);
        END LOOP;
END
$$ LANGUAGE plpgsql;


DROP FUNCTION search_path_by_keywords;
CREATE FUNCTION search_path_by_keywords(keywordList TEXT, resultLimit INTEGER default 15)
    RETURNS TABLE
            (
                path  VARCHAR(64),
                count BIGINT
            )
AS
$$
DECLARE
    keywords VARCHAR(64)[];
--     searchKeywords      VARCHAR(256);
BEGIN
    keywords = string_to_array(lower(keywordList), ',');
    RETURN QUERY
        SELECT sp.path, sum(spk.count) as count
        FROM search_path_keywords spk
                 JOIN search_paths sp ON sp.id = spk.path_id
                 JOIN search_keywords sk on spk.keyword_id = sk.id
        WHERE sk.keyword = ANY (keywords)
        GROUP BY sp.path
        ORDER BY count DESC
        LIMIT resultLimit;
END
$$ LANGUAGE plpgsql;