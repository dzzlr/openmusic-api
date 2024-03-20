exports.up = (pgm) => {
  pgm.createTable('playlist_song_activities', {
    id: {
      type: 'serial',
      primaryKey: true,
    },
    playlistId: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    songId: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    userId: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    action: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    time: {
      type: 'VARCHAR(50)',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });

  pgm.addConstraint(
    'playlist_song_activities',
    'fk_playlist_song_activities.playlist_id_playlists.id',
    'FOREIGN KEY("playlistId") REFERENCES playlists(id) ON DELETE CASCADE',
  );
};

exports.down = (pgm) => {
  pgm.dropTable('playlist_song_activities');
};
