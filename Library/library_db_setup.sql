-- Създаване на база данни
CREATE DATABASE IF NOT EXISTS library_db;
USE library_db;

-- Създаване на таблица за потребители
CREATE TABLE IF NOT EXISTS Users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  role ENUM('потребител', 'библиотекар', 'администратор') NOT NULL DEFAULT 'потребител',
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Създаване на таблица за книги
CREATE TABLE IF NOT EXISTS Books (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  author VARCHAR(255) NOT NULL,
  genre VARCHAR(100) NOT NULL,
  status ENUM('налична', 'заета', 'върната') NOT NULL DEFAULT 'налична',
  borrowDate DATETIME,
  returnDate DATETIME,
  borrowedById INT,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (borrowedById) REFERENCES Users(id) ON DELETE SET NULL
);

-- Добавяне на администратор (паролата е "admin123" хеширана с bcrypt)
INSERT INTO Users (username, password, email, role)
VALUES ('admin', '$2b$10$4QR1mNmM21U04GCHwqTsaOjNNfDA4KcHydWLgfElnkHNHizOzQxwq', 'admin@library.com', 'администратор');

-- Добавяне на библиотекар
INSERT INTO Users (username, password, email, role)
VALUES ('библиотекар', '$2b$10$4VTH8HVW7jzxX7eY5hxqYeAUJGA2xjGNlZ88C0UVjNLgyrLvdIfPC', 'библиотекар@library.com', 'библиотекар');

-- Добавяне на обикновен потребител
INSERT INTO Users (username, password, email, role)
VALUES ('потребител', '$2b$10$pvILB8dG5mXvygznw6p5veDQlH25zpYZcQO1iEhhbGH1FsDmCiTCi', 'потребител@library.com', 'потребител');

-- Добавяне на примерни книги
INSERT INTO Books (title, author, genre) VALUES
('Под игото', 'Иван Вазов', 'Исторически роман'),
('Война и мир', 'Лев Толстой', 'Класика'),
('1984', 'Джордж Оруел', 'Дистопия'),
('Хари Потър и Философският камък', 'Дж. К. Роулинг', 'Фентъзи'),
('Престъпление и наказание', 'Фьодор Достоевски', 'Класика'),
('Малкият принц', 'Антоан дьо Сент-Екзюпери', 'Приказка'),
('Властелинът на пръстените', 'Дж. Р. Р. Толкин', 'Фентъзи'),
('Гордост и предразсъдъци', 'Джейн Остин', 'Класика'),
('Алиса в Страната на чудесата', 'Луис Карол', 'Фентъзи'),
('Дон Кихот', 'Мигел де Сервантес', 'Класика');

-- Индекси за по-бързо търсене
CREATE INDEX idx_books_title ON Books(title);
CREATE INDEX idx_books_author ON Books(author);
CREATE INDEX idx_books_genre ON Books(genre); 