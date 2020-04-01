-- select * from Distance;

-- Distance --
CREATE TABLE IF NOT EXISTS Distance (
  distance_id int(11) AUTO_INCREMENT PRIMARY KEY,
  km FLOAT (11) NOT NULL,
  locationA varchar(50) NOT NULL,
  locationB varchar(50) NOT NULL,
  counterAB integer(11),
  counterBA integer(11)
);
-- first insert
-- insert into Distance(km,locationA,locationB,counterAB,counterBA)value(35.0,"telaviv","jerusalem",0,0),(35.0,"jerusalem","telaviv",0,0)