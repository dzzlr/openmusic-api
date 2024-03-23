const autoBind = require('auto-bind');

class ExportsHandler {
  constructor(producerService, playlistsService, validator) {
    this._producerService = producerService;
    this._playlistsService = playlistsService;
    this._validator = validator;

    autoBind(this);
  }

  async postExportPlaylistsHandler(req, h) {
    this._validator.validateExportPlaylistsPayload(req.payload);
    const { id } = req.params;
    const { id: userId } = req.auth.credentials;

    await this._playlistsService.verifyPlaylistAccess(id, userId);

    const message = {
      id,
      targetEmail: req.payload.targetEmail,
    };

    await this._producerService.sendMessage(
      'export:playlists',
      JSON.stringify(message),
    );

    const response = h.response({
      status: 'success',
      message: 'Permintaan Anda sedang kami proses',
    });
    response.code(201);
    return response;
  }
}

module.exports = ExportsHandler;
