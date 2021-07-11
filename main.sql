BEGIN;
PRAGMA foreign_keys = ON;
CREATE TABLE users(
    id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    login_name VARCHAR(256) NOT NULL,
    pretty_name VARCHAR(256) NOT NULL,
    email VARCHAR(256) NOT NULL,
    avatar VARCHAR(256) NOT NULL,
    passwd VARCHAR(256) NOT NULL
);
CREATE UNIQUE INDEX uq_users__email ON users(email);
INSERT INTO users VALUES (1, 'admin', 'Administrator', 'admin@example.com', 'http://www.gravatar.com/avatar/22b3de0ed1d200ba1e747a066fe69280?s=96', '21232f297a57a5a743894a0e4a801fc3');
INSERT INTO users VALUES (2, 'user', 'User', 'user@example.com', 'http://www.gravatar.com/avatar/22b3de0ed1d200ba1e747a066fe69280?s=96', 'ee11cbb19052e40b07aac0ca060c23ee');
INSERT INTO users VALUES (3, 'user1', 'User1', 'user1@example.com', 'http://www.gravatar.com/avatar/22b3de0ed1d200ba1e747a066fe69280?s=96', '24c9e15e52afc47c225b757e7bee1f9d');
INSERT INTO users VALUES (4, 'user2', 'User2', 'user2@example.com', 'http://www.gravatar.com/avatar/22b3de0ed1d200ba1e747a066fe69280?s=96', '7e58d63b60197ceb55a1c487989a3720');
INSERT INTO users VALUES (5, 'user3', 'User3', 'user3@example.com', 'http://www.gravatar.com/avatar/22b3de0ed1d200ba1e747a066fe69280?s=96', '92877af70a45fd6a2ed7fe81e1236b78');
CREATE TABLE authors(
    id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(256) NOT NULL
);
INSERT INTO authors VALUES (1, 'Ali Omar');
INSERT INTO authors VALUES (2, 'Ahmed Mahmoud');
CREATE TABLE publishers(
    id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(256) NOT NULL
);
INSERT INTO publishers VALUES (1, 'ACME Press');
INSERT INTO publishers VALUES (2, 'Example Inc.');
CREATE TABLE books(
    id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    title VARCHAR(256) NOT NULL,
    author_id INTEGER NOT NULL REFERENCES authors(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    publisher_id INTEGER NOT NULL REFERENCES publishers(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    pub_year INTEGER NOT NULL,
    description TEXT NOT NULL
);
CREATE INDEX rf_books__author ON books(author_id);
CREATE INDEX rf_books__publisher ON books(publisher_id);
CREATE INDEX rf_books__pub_year ON books(pub_year);
INSERT INTO books VALUES (1, 'How to Make Lemon Juice', 1, 1, 1990, "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.");
INSERT INTO books VALUES (2, 'Learn Programming in 10 years', 2, 1, 1999, "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.");
INSERT INTO books VALUES (3, 'Learn Programming in 15 minutes', 1, 2, 2001, "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.");
INSERT INTO books VALUES (4, 'How to drift like a wizard', 2, 2, 2008, "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.");
INSERT INTO books VALUES (5, 'ABCs', 1, 1, 2007, "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.");
INSERT INTO books VALUES (6, 'XYZs', 2, 2, 2003, "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.");
CREATE TABLE reviews(
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    book_id INTEGER NOT NULL REFERENCES books(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    stars INTEGER NOT NULL,
    review TEXT NOT NULL,
    PRIMARY KEY (user_id, book_id)
);
CREATE INDEX rf_reviews__user ON reviews(user_id);
CREATE INDEX rf_reviews__book ON reviews(book_id);
INSERT INTO reviews VALUES (3, 1, 5, 'I like the ending of this story.');
INSERT INTO reviews VALUES (4, 1, 4, 'I learned a lot');
COMMIT;
