exports.up = (pgm) => {
  pgm.createTable('collaborations', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    playlistId: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    userId: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
  });

  /*
    Menambahkan constraint UNIQUE, kombinasi dari kolom note_id dan user_id.
    Guna menghindari duplikasi data antara nilai keduanya.
  */
  pgm.addConstraint(
    'collaborations',
    'unique_playlist_id_and_user_id',
    'UNIQUE("playlistId", "userId")',
  );

  // memberikan constraint foreign key pada kolom note_id dan user_id terhadap notes.id dan users.id
  pgm.addConstraint(
    'collaborations',
    'fk_collaborations.playlist_id_playlists.id',
    'FOREIGN KEY("playlistId") REFERENCES playlists(id) ON DELETE CASCADE',
  );
  pgm.addConstraint(
    'collaborations',
    'fk_collaborations.user_id_users.id',
    'FOREIGN KEY("userId") REFERENCES users(id) ON DELETE CASCADE',
  );
};

exports.down = (pgm) => {
  // menghapus tabel collaborations
  pgm.dropTable('collaborations');
};
