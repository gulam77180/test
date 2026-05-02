CREATE DATABASE vehicle_service;

USE vehicle_service;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100),
    password VARCHAR(100)
);

CREATE TABLE bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    service VARCHAR(100),
    date DATE,
    time VARCHAR(20),
    status VARCHAR(50)
);

ALTER TABLE users ADD role VARCHAR(20) DEFAULT 'user';

CREATE TABLE mechanics (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  skill VARCHAR(100),
  status VARCHAR(50)
);

INSERT INTO mechanics (name, skill) VALUES
('Rahul', 'Engine'),
('Aman', 'Brake'),
('Sahil', 'General');

CREATE TABLE bills (
  id INT AUTO_INCREMENT PRIMARY KEY,
  booking_id INT,
  amount INT,
  status VARCHAR(50)
);
ALTER TABLE bookings ADD mechanic_id INT DEFAULT NULL;
ALTER TABLE bookings ADD name VARCHAR(100);