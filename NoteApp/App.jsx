import React, { useState } from 'react'

export default function App() {
  const [notes, setNotes] = useState([])
  const [text, setText] = useState('')

  const addNote = () => {
    const trimmed = text.trim()
    if (!trimmed) return
    const id = Date.now().toString(36) + Math.random().toString(36).slice(2)
    setNotes(prev => [...prev, { id, text: trimmed, editing: false }])
    setText('')
  }

  const deleteNote = id => setNotes(prev => prev.filter(n => n.id !== id))

  const startEdit = id => setNotes(prev => prev.map(n => (n.id === id ? { ...n, editing: true, editText: n.text } : n)))

  const cancelEdit = id => setNotes(prev => prev.map(n => (n.id === id ? { ...n, editing: false } : n)))

  const changeEditText = (id, value) => setNotes(prev => prev.map(n => (n.id === id ? { ...n, editText: value } : n)))

  const saveEdit = id => setNotes(prev => prev.map(n => (n.id === id ? { ...n, text: n.editText ?? n.text, editing: false } : n)))

  return (
    <div className="container">
      <h1>Note App</h1>

      <div className="inputRow">
        <input
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Write a note..."
        />
        <button onClick={addNote}>Add</button>
      </div>

      <ul className="notes">
        {notes.length === 0 && <li className="empty">No notes yet — add one!</li>}
        {notes.map(n => (
          <li className="note" key={n.id}>
            {n.editing ? (
              <div className="editRow">
                <input value={n.editText ?? n.text} onChange={e => changeEditText(n.id, e.target.value)} />
                <button onClick={() => saveEdit(n.id)}>Save</button>
                <button className="muted" onClick={() => cancelEdit(n.id)}>
                  Cancel
                </button>
              </div>
            ) : (
              <div className="noteRow">
                <span className="noteText">{n.text}</span>
                <div className="actions">
                  <button onClick={() => startEdit(n.id)}>Update</button>
                  <button className="danger" onClick={() => deleteNote(n.id)}>
                    Delete
                  </button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
