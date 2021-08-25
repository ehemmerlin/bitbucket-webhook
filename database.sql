DROP TABLE IF EXISTS repositories CASCADE;
DROP TABLE IF EXISTS dependencies CASCADE;
DROP SEQUENCE IF EXISTS repositories_id_seq CASCADE;
DROP SEQUENCE IF EXISTS dependencies_id_seq CASCADE;

CREATE TABLE IF NOT EXISTS repositories (
    id integer NOT NULL,
    name varchar(25) NOT NULL,
    url varchar(255) NOT NULL,
    enabled boolean DEFAULT true,
    created_at timestamp NOT NULL DEFAULT NOW(),
    PRIMARY KEY (id)
);

CREATE SEQUENCE repositories_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER TABLE ONLY repositories ALTER COLUMN id SET DEFAULT nextval('repositories_id_seq'::regclass);

CREATE TABLE IF NOT EXISTS dependencies (
  id integer NOT NULL,
  repository_id int NOT NULL,
  name varchar(25) NOT NULL,
  url VARCHAR(255) NOT NULL,
  created_at timestamp NOT NULL DEFAULT NOW(),
  PRIMARY KEY (id),
  FOREIGN KEY (repository_id) REFERENCES repositories(id) ON DELETE CASCADE
);

CREATE SEQUENCE dependencies_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER TABLE ONLY dependencies ALTER COLUMN id SET DEFAULT nextval('dependencies_id_seq'::regclass);

INSERT into repositories(name, url)
VALUES('application', 'PIL/repos/application');

INSERT into dependencies(name, url, repository_id)
VALUES('core', 'PIL/repos/core', 1);

INSERT into dependencies(name, url, repository_id)
VALUES('utils', 'PIL/repos/utils', 1);
