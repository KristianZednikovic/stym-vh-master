CREATE TABLE IF NOT EXISTS users
(
    id         SERIAL PRIMARY KEY,
    username   VARCHAR(50) UNIQUE NOT NULL,
    email      VARCHAR(100)       NOT NULL,
    password   VARCHAR(255)       NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS blacklisted_tokens (
                                                  id SERIAL PRIMARY KEY,
                                                  token TEXT NOT NULL,
                                                  expiry TIMESTAMP WITH TIME ZONE NOT NULL,
                                                  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                                                  CONSTRAINT unique_token UNIQUE(token)
);

CREATE TABLE IF NOT EXISTS game_store (
                        id SERIAL PRIMARY KEY,
                        title VARCHAR(100) NOT NULL,
                        url VARCHAR(100) NOT NULL
);

INSERT INTO game_store (id, title, url) VALUES
(1, 'Game 1', 'Game1.exe');

CREATE TABLE IF NOT EXISTS library (
                        game_id INT NOT NULL,
                        user_id INT NOT NULL,
                        game_title VARCHAR(100) NOT NULL,
                        game_key VARCHAR(255) NOT NULL,
                        CONSTRAINT unique_game_key UNIQUE(game_key),
                        FOREIGN KEY (user_id) REFERENCES users(id),
                        FOREIGN KEY (game_id) REFERENCES game_store(id)
);

CREATE INDEX IF NOT EXISTS idx_blacklisted_tokens_token ON blacklisted_tokens(token);
CREATE INDEX IF NOT EXISTS idx_blacklisted_tokens_expiry ON blacklisted_tokens(expiry);
