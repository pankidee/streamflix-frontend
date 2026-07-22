export default function AdminMovieRow({ movie, onDelete, onEdit }) {
  return (
    <tr>
      <td>
        <img
          src={movie.posterUrl || '/poster-placeholder.svg'}
          alt={movie.title}
          style={{ width: '60px', height: '90px', objectFit: 'cover', borderRadius: '4px' }}
          onError={(e) => { e.target.src = '/poster-placeholder.svg'; }}
        />
      </td>
      <td>{movie.title}</td>
      <td>{movie.vj || '—'}</td>
      <td>{movie.genre || '—'}</td>
      <td>{movie.videoPlaylistUrl ? 'Ready' : 'No video'}</td>
      <td>
        <button onClick={() => onEdit(movie)}>Edit</button>
        <button className="danger" onClick={() => onDelete(movie)} style={{ marginLeft: '0.5rem' }}>
          Delete
        </button>
      </td>
    </tr>
  );
}