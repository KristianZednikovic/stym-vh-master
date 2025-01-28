CREATE TABLE IF NOT EXISTS users
(
    id         SERIAL PRIMARY KEY,
    username   VARCHAR(50) UNIQUE NOT NULL,
    email      VARCHAR(100)       NOT NULL,
    password   VARCHAR(255)       NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    token VARCHAR(255)
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
                        url VARCHAR(100) NOT NULL,
                        description TEXT
);

INSERT INTO game_store (title, url, description) VALUES
                                                    ('Shadow Quest', 'Game1.exe', 'Embark on an epic RPG adventure in a world of magic and mystery.'),
                                                    ('Galactic Warfare', 'Game1.exe', 'Command vast fleets in a strategic battle for the galaxy.'),
                                                    ('Cyber Heist', 'Game1.exe', 'Plan and execute daring heists in a futuristic cyberpunk world.'),
                                                    ('Mystic Arena', 'Game1.exe', 'Compete in a tournament of powerful mages, mastering elemental spells.'),
                                                    ('Racing Legends', 'Game1.exe', 'Experience the thrill of high-speed racing in exotic locations.'),
                                                    ('Pirate Bounty', 'Game1.exe', 'Set sail on a swashbuckling adventure to find lost treasures.'),
                                                    ('Dungeon Delvers', 'Game1.exe', 'Explore dangerous dungeons, fight monsters, and discover ancient artifacts.'),
                                                    ('Puzzle Masters', 'Game1.exe', 'Solve challenging puzzles and unravel mind-bending mysteries.'),
                                                    ('Space Explorers', 'Game1.exe', 'Journey to distant planets, discover alien life, and uncover cosmic secrets.'),
                                                    ('Zombie Uprising', 'Game1.exe', 'Survive a zombie apocalypse and fight for the future of humanity.');

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
