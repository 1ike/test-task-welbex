-- Adminer 4.8.1 PostgreSQL 14.5 (Debian 14.5-1.pgdg110+1) dump

DROP TABLE IF EXISTS "test_data";
DROP SEQUENCE IF EXISTS test_data_id_seq;
CREATE SEQUENCE test_data_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 32767 CACHE 1;

CREATE TABLE "public"."test_data" (
    "id" smallint DEFAULT nextval('test_data_id_seq') NOT NULL,
    "date" timestamp NOT NULL,
    "name" character varying(256) NOT NULL,
    "qty" integer NOT NULL,
    "distance" numeric NOT NULL,
    CONSTRAINT "test_data_pkey" PRIMARY KEY ("id")
) WITH (oids = false);

INSERT INTO "test_data" ("id", "date", "name", "qty", "distance") VALUES
(1,	'2022-09-28 15:13:26.967277',	'Lorem ipsum',	120,	1320.33),
(2,	'2022-09-28 15:14:01.984099',	'dolor sit amet',	23,	890),
(3,	'2022-09-28 15:14:28.604596',	'consectetur adipiscing elit',	521,	3244),
(4,	'2022-09-28 15:14:52.123542',	'sed do eiusmod',	97,	435),
(5,	'2022-09-28 15:15:18.781492',	'tempor incididunt',	54,	524.5),
(6,	'2022-09-28 15:15:45.663364',	'ut labore',	6255,	452),
(7,	'2022-09-28 15:16:09.351749',	'et dolore',	7,	21),
(8,	'2022-09-28 15:16:27.094743',	'magna aliqua',	987,	3245),
(9,	'2022-09-28 15:17:12.286361',	'Ut enim',	734,	429),
(10,	'2022-09-28 15:17:36.655755',	'ad minim',	632,	2555),
(11,	'2022-09-28 15:18:11.699211',	'veniam',	62,	98.3);

-- 2022-09-28 15:19:03.306948+00