export default function AdminMovieRow({ movie, onDelete, onEdit }) {
  return (
    <tr>
      <td>
        <img src={movie.posterUrl} alt={movie.title} className="admin-thumb" />
      </td>
      <td>{movie.title}</td>
      <td>{movie.vj || '—'}</td>
      <td>{movie.genre || '—'}</td>
      <td>{movie.videoPlaylistUrl ? '✅ Ready' : '⏳ No video'}</td>
      <td>
        <button onClick={() => onEdit(movie)}>Edit</button>
        <button onClick={() => onDelete(movie)} className="danger">Delete</button>
      </td>
    </tr>
  );
}