const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const { mapDBToAlbumModel } = require('../../utils');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const ClientError = require('../../exceptions/ClientError');

class AlbumsService {
  constructor(cacheService) {
    this._pool = new Pool();
    this._cacheService = cacheService;
  }

  async addAlbum({ name, year }) {
    const id = `album-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO albums VALUES($1, $2, $3) RETURNING id',
      values: [id, name, year],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Album gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async getAlbums() {
    const result = await this._pool.query('SELECT * FROM albums');
    return result.rows.map(mapDBToAlbumModel);
  }

  async getAlbumById(id) {
    const query = {
      text: 'SELECT * FROM albums WHERE id = $1',
      values: [id],
    };
    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Album tidak ditemukan');
    }

    const resultSongs = await this._pool.query({
      text: 'SELECT id, title, performer FROM songs WHERE "albumId" = $1',
      values: [id],
    });

    return {
      ...result.rows.map(mapDBToAlbumModel)[0],
      songs: resultSongs.rows,
    };
  }

  async editAlbumById(id, { name, year }) {
    const query = {
      text: 'UPDATE albums SET name = $1, year = $2 WHERE id = $3 RETURNING id',
      values: [name, year, id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Gagal memperbarui album. Id tidak ditemukan');
    }
  }

  async editAlbumCoverById(id, fileLocation) {
    const query = {
      text: 'UPDATE albums SET "coverUrl" = $1 WHERE id = $2 RETURNING id',
      values: [fileLocation, id],
    };

    await this._pool.query(query);
  }

  async deleteAlbumById(id) {
    const query = {
      text: 'DELETE FROM albums WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Album gagal dihapus. Id tidak ditemukan');
    }
  }

  async isAlbumExist(id) {
    const result = await this._pool.query({
      text: 'SELECT * FROM albums WHERE id = $1',
      values: [id],
    });

    if (!result.rowCount) {
      throw new NotFoundError('Album tidak ditemukan');
    }
  }

  async likeTheAlbum(id, userId) {
    await this.isAlbumExist(id);

    const result = await this._pool.query({
      text: 'SELECT * FROM user_album_likes WHERE "albumId" = $1 AND "userId" = $2',
      values: [id, userId],
    });

    if (!result.rowCount) {
      const resultInsert = await this._pool.query({
        text: 'INSERT INTO user_album_likes ("albumId", "userId") VALUES($1, $2) RETURNING id',
        values: [id, userId],
      });

      if (!resultInsert.rowCount) {
        throw new InvariantError('Gagal menyukai album');
      }
    } else {
      throw new ClientError('Anda sudah menyukai album ini');
    }
  }

  async getAlbumLikesById(id) {
    try {
      const source = 'cache';
      const likes = await this._cacheService.get(`user_album_likes:${id}`);
      return { likes: +likes, source };
    } catch (error) {
      await this.isAlbumExist(id);

      const result = await this._pool.query({
        text: 'SELECT * FROM user_album_likes WHERE "albumId" = $1',
        values: [id],
      });

      const likes = result.rowCount;
      await this._cacheService.set(`user_album_likes:${id}`, likes);
      const source = 'server';

      return { likes, source };
    }
  }

  async unlikeTheAlbum(id, userId) {
    await this.isAlbumExist(id);

    const result = await this._pool.query({
      text: 'DELETE FROM user_album_likes WHERE "albumId" = $1 AND "userId" = $2 RETURNING id',
      values: [id, userId],
    });

    if (!result.rowCount) {
      throw new InvariantError('Gagal membatalkan menyukai album');
    }

    await this._cacheService.delete(`user_album_likes:${id}`);
  }
}

module.exports = AlbumsService;
