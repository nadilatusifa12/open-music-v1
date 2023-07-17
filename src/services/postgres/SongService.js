const { Pool } = require("pg");
const { nanoid } = require("nanoid");
const { songModel } = require("../../utils");
const NotFoundError = require("../../exceptions/NotFoundError");

class SongService {
  constructor() {
    this._pool = new Pool();
  }

  async addSong({ title, year, genre, performer, duration, albumId }) {
    const id = `song-${nanoid(16)}`;
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    console.log()
    const query = {
      text: "INSERT INTO song VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id",
      values: [id, title, year, performer, genre, duration, albumId ?? "null", createdAt, updatedAt],
    };

    const result = await this._pool.query(query);
    if (!result.rows[0].id) {
      throw new InvariantError("Song gagal ditambahkan");
    }
    return result.rows[0].id;
  }

  async getAllSongs() {
    const query = {
      text: "SELECT id, title, performer FROM song"
    };
    const result = await this._pool.query(query);
    return result.rows;
  }

  async getSongById(id) {
    const query = {
      text: "SELECT * FROM song WHERE id=$1",
      values: [id],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError("Song tidak ditemukan");
    }
    return result.rows.map(songModel)[0];
  }

  async editSongById(id, { title, year, performer, genre, duration, albumId }) {
    const query = {
      text: 'UPDATE song SET title = $1, year = $2, genre = $3, performer = $4, duration = $5, "albumId" = $6 WHERE id = $7 RETURNING id',
      values: [title, year, genre, performer, duration, albumId ?? "null", id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError("Song tidak ditemukan");
    }

    return [title, year, performer, genre, duration, albumId ?? "null", id];
  }

  async deleteSongById(id) {
    const query = {
      text: "DELETE FROM song WHERE id = $1 RETURNING id",
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError("Song tidak ditemukan");
    }
  }
}

module.exports = SongService;
