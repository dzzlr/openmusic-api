const mapDBToAlbumModel = ({ id, name, year, coverUrl }) => ({
  id,
  name,
  year,
  coverUrl,
});

const mapDBToAlbumModelWithSongs = ({
  id, name, year, songs,
}) => ({
  id,
  name,
  year,
  songs,
});

const mapDBToSongModel = ({ id, title, performer }) => ({
  id,
  title,
  performer,
});

const mapDBToSongModelDetail = ({
  id,
  title,
  year,
  genre,
  performer,
  duration,
  albumId,
}) => ({
  id,
  title,
  year,
  genre,
  performer,
  duration,
  albumId,
});

module.exports = {
  mapDBToAlbumModel,
  mapDBToAlbumModelWithSongs,
  mapDBToSongModel,
  mapDBToSongModelDetail,
};
