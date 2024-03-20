const Joi = require('joi');

const PlaylistPayloadSchema = Joi.object({
  name: Joi.string().required(),
  owner: Joi.string(),
});

const SongPlaylistPayloadSchema = Joi.object({
  songId: Joi.string().required(),
});

const PostActivityPayloadSchema = Joi.object({
  playlistId: Joi.string().required(),
  songId: Joi.string().required(),
  userId: Joi.string().required(),
  action: Joi.string().required(),
  time: Joi.string().required(),
});

module.exports = {
  PlaylistPayloadSchema,
  SongPlaylistPayloadSchema,
  PostActivityPayloadSchema,
};
