const albumModel = ({ id, name, year }) => ({
  id,
  name,
  year,
});

const songModel = ({
  id,
  title,
  year,
  performer,
  genre,
  duration,
  albumId,
}) => ({
  id,
  title,
  year,
  performer,
  genre,
  duration,
  albumId,
});

module.exports = { albumModel, songModel };
