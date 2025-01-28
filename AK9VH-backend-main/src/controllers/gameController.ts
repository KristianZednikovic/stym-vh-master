import { Request, Response } from 'express';
import { pool } from '../config/database';
import path from 'path';
import fs from 'fs';

export const downloadGame = async (req: Request, res: Response): Promise<void> => {
    const userId = parseInt(req.params.userId, 10); // Získání userId z parametrů
    const gameId = parseInt(req.params.gameId, 10); // Získání gameId z parametrů

    if (isNaN(userId) || isNaN(gameId)) {
        res.status(400).json({ message: 'Neplatné parametry.' });
        return;
    }

    try {
        const gameResult = await pool.query('SELECT * FROM game_store WHERE id = $1', [gameId]);
        if (gameResult.rowCount === 0) {
            res.status(404).json({ message: 'Hra nenalezena.' });
            return;
        }
        const game = gameResult.rows[0];

        const gameKey = `KEY-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
        await pool.query(
            'INSERT INTO library (game_id, user_id, game_title, game_key) VALUES ($1, $2, $3, $4)',
            [gameId, userId, game.title, gameKey]
        );

        const filePath = path.join(__dirname, '../../games', game.url);
        if (!fs.existsSync(filePath)) {
            res.status(404).json({ message: 'Soubor hry nenalezen.' });
            return;
        }
        res.download(filePath);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Chyba serveru.' });
    }
};

export const verifyGameKey = async (req: Request, res: Response): Promise<void> => {
    const userId = parseInt(req.params.userId, 10);
    const gameId = parseInt(req.params.gameId, 10);

    if (isNaN(userId) || isNaN(gameId)) {
        res.status(400).json({ message: 'Invalid userId or gameId.' });
        return;
    }

    try {
        const result = await pool.query(
            `SELECT game_key 
             FROM library 
             WHERE user_id = $1 AND game_id = $2`,
            [userId, gameId]
        );

        const result_token = await pool.query(
            `SELECT token 
             FROM users 
             WHERE id = $1`,
            [userId]
        );

        if (result.rowCount === 0) {
            res.status(404).json({ message: 'License not found. User does not own this game.' });
            return;
        }
        
        console.error('TOKEN\n\n\n\n\n\n:', result_token.rows[0].token);
        if (result_token.rows[0].token === null) {
            res.status(404).json({ message: 'User is not online.' });
            return;
        }

        const gameKey = result.rows[0].game_key;

        res.status(200).json({ message: 'License is valid.', gameKey });
    } catch (error) {
        console.error('Error verifying license:', error);
        res.status(500).json({ message: 'Server error.' });
    }
};

// Opravená funkce: Získání knihovny uživatele
export const getUserLibrary = async (req: Request, res: Response): Promise<void> => {
    const userId = parseInt(req.params.userId, 10);

    try {
        const result = await pool.query(
            `SELECT g.id AS game_id, g.title AS game_title, g.url AS game_url
             FROM library l
             JOIN game_store g ON l.game_id = g.id
             WHERE l.user_id = $1`,
            [userId]
        );
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error fetching user library:', error);
        res.status(500).json({ message: 'Chyba při získávání knihovny.' });
    }
};


export const isGameInLibrary = async (req: Request, res: Response): Promise<void> => {
    const userId = parseInt(req.params.userId, 10);
    const gameId = parseInt(req.params.gameId, 10);

    if (isNaN(userId) || isNaN(gameId)) {
        res.status(400).json({ message: 'Neplatné parametry.' });
        return;
    }

    try {
        const result = await pool.query(
            'SELECT * FROM library WHERE user_id = $1 AND game_id = $2',
            [userId, gameId]
        );
    
        if (result.rows.length > 0) {
            res.status(200).json({ exists: true });
        } else {
            res.status(200).json({ exists: false });
        }
    } catch (error) {
        console.error('Error during query execution:', error);
        res.status(500).json({ message: 'Chyba serveru.' });
    }
};


export const uninstallGame = async (req: Request, res: Response): Promise<void> => {
    const userId = parseInt(req.params.userId, 10); // Získání userId z parametrů
    const gameId = parseInt(req.params.gameId, 10); // Získání gameId z parametrů

    if (isNaN(userId) || isNaN(gameId)) {
        res.status(400).json({ message: 'Neplatné parametry.' });
        return;
    }

    try {
        // Zkontroluj, zda hra existuje v knihovně uživatele
        const libraryResult = await pool.query(
            'SELECT * FROM library WHERE user_id = $1 AND game_id = $2',
            [userId, gameId]
        );

        if (libraryResult.rowCount === 0) {
            res.status(404).json({ message: 'Hra nebyla nalezena v knihovně uživatele.' });
            return;
        }

        // Odstraň hru z knihovny
        await pool.query('DELETE FROM library WHERE user_id = $1 AND game_id = $2', [userId, gameId]);

        res.status(200).json({ message: 'Hra byla úspěšně odinstalována.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Chyba serveru.' });
    }
};


export const getGameById = async (req: Request, res: Response): Promise<void> => {
    const gameId = parseInt(req.params.gameId, 10);

    if (isNaN(gameId)) {
        res.status(400).json({ message: 'Invalid gameId.' });
        return;
    }

    try {
        const gameResult = await pool.query('SELECT * FROM game_store WHERE id = $1', [gameId]);
        if (gameResult.rowCount === 0) {
            res.status(404).json({ message: 'Game not found.' });
            return;
        }
        const game = gameResult.rows[0];
        res.status(200).json(game);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error.' });
    }
};


export const getAllGames = async (req: Request, res: Response): Promise<void> => {
    try {
        const result = await pool.query('SELECT id, title, url, description FROM game_store');
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error fetching games:', error);
        res.status(500).json({ message: 'Error fetching games.' });
    }
};