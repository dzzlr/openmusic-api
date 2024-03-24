exports.up = (pgm) => {
  pgm.createTable('user_album_likes', {
    id: {
      type: 'serial',
      primaryKey: true,
    },
    albumId: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    userId: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
  });

  pgm.addConstraint(
    'user_album_likes',
    'unique_album_id_and_user_id',
    'UNIQUE("albumId", "userId")',
  );

  pgm.addConstraint(
    'user_album_likes',
    'fk_user_album_likes.album_id_albums.id',
    'FOREIGN KEY("albumId") REFERENCES albums(id) ON DELETE CASCADE',
  );
  pgm.addConstraint(
    'user_album_likes',
    'fk_user_album_likes.user_id_users.id',
    'FOREIGN KEY("userId") REFERENCES users(id) ON DELETE CASCADE',
  );
};

exports.down = (pgm) => {
  pgm.dropTable('user_album_likes');
};
