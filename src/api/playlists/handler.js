const autoBind = require('auto-bind');

class PlaylistsHandler {
  constructor(playlistsService, songsService, validator) {
    this._playlistsService = playlistsService;
    this._songsService = songsService;
    this._validator = validator;

    autoBind(this);
  }

  async postPlaylistHandler(req, h) {
    this._validator.validatePlaylistPayload(req.payload);
    const { name } = req.payload;
    const { id: credentialId } = req.auth.credentials;

    const playlistId = await this._playlistsService.addPlaylist({
      name,
      owner: credentialId,
    });

    const response = h.response({
      status: 'success',
      message: 'Playlist berhasil ditambahkan',
      data: {
        playlistId,
      },
    });
    response.code(201);
    return response;
  }

  async getPlaylistsHandler(req) {
    const { id: credentialId } = req.auth.credentials;
    const playlists = await this._playlistsService.getPlaylists(credentialId);
    return {
      status: 'success',
      data: {
        playlists,
      },
    };
  }

  async deletePlaylistByIdHandler(req) {
    const { id } = req.params;
    const { id: credentialId } = req.auth.credentials;

    await this._playlistsService.verifyPlaylistOwner(
      id,
      credentialId,
    );
    await this._playlistsService.deletePlaylistById(id);

    return {
      status: 'success',
      message: 'Playlist berhasil dihapus',
    };
  }

  async postSongPlaylistByIdHandler(req, h) {
    this._validator.validateSongPlaylistPayload(req.payload);
    const { id } = req.params;
    const { songId } = req.payload;
    const { id: credentialId } = req.auth.credentials;

    await this._playlistsService.verifyPlaylistAccess(id, credentialId);

    await this._songsService.getSongById(songId);

    await this._playlistsService.addSongToPlaylist(id, songId);

    await this._playlistsService.addActivityToPlaylist(id, songId, credentialId, 'add');

    const response = h.response({
      status: 'success',
      message: 'Lagu berhasil ditambahkan ke playlist',
    });
    response.code(201);
    return response;
  }

  async getSongPlaylistByIdHandler(req) {
    const { id } = req.params;
    const { id: credentialId } = req.auth.credentials;

    await this._playlistsService.verifyPlaylistAccess(
      id,
      credentialId,
    );

    const playlist = await this._playlistsService.getSongsFromPlaylist(
      id,
    );

    return {
      status: 'success',
      data: {
        playlist,
      },
    };
  }

  async deleteSongPlaylistByIdHandler(req) {
    const { id } = req.params;
    const { songId } = req.payload;
    const { id: credentialId } = req.auth.credentials;

    await this._playlistsService.verifyPlaylistAccess(
      id,
      credentialId,
    );

    await this._playlistsService.deleteSongFromPlaylist(id, songId);

    await this._playlistsService.addActivityToPlaylist(id, songId, credentialId, 'delete');

    return {
      status: 'success',
      message: 'Lagu berhasil dihapus dari playlist',
    };
  }

  async getPlaylistActivitiesByIdHandler(req) {
    const { id } = req.params;
    const { id: credentialId } = req.auth.credentials;

    await this._playlistsService.verifyPlaylistAccess(id, credentialId);

    const activities = await this._playlistsService.getActivitiesFromPlaylist(id);

    return {
      status: 'success',
      data: {
        id,
        activities,
      },
    };
  }
}

module.exports = PlaylistsHandler;
