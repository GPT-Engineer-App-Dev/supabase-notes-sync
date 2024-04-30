import { useState } from 'react';
import { Box, Button, Input, Text, VStack } from '@chakra-ui/react';
import { client } from 'lib/crud';

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');

  const fetchNotes = async () => {
    const fetchedNotes = await client.getWithPrefix('note:');
    setNotes(fetchedNotes.map(n => ({ id: n.key, ...n.value })));
  };

  const addNote = async () => {
    const noteId = `note:${Date.now()}`;
    const success = await client.set(noteId, { text: newNote });
    if (success) {
      setNotes([...notes, { id: noteId, text: newNote }]);
      setNewNote('');
    }
  };

  const updateNote = async (id, newText) => {
    const success = await client.set(id, { text: newText });
    if (success) {
      const updatedNotes = notes.map(note => note.id === id ? { ...note, text: newText } : note);
      setNotes(updatedNotes);
    }
  };

  const deleteNote = async (id) => {
    const success = await client.delete(id);
    if (success) {
      const updatedNotes = notes.filter(note => note.id !== id);
      setNotes(updatedNotes);
    }
  };

  return (
    <VStack spacing={4}>
      <Button onClick={fetchNotes}>Load Notes</Button>
      <Input value={newNote} onChange={(e) => setNewNote(e.target.value)} placeholder="Add a new note" />
      <Button onClick={addNote}>Add Note</Button>
      {notes.map(note => (
        <Box key={note.id}>
          <Text>{note.text}</Text>
          <Input defaultValue={note.text} onBlur={(e) => updateNote(note.id, e.target.value)} />
          <Button onClick={() => deleteNote(note.id)}>Delete</Button>
        </Box>
      ))}
    </VStack>
  );
};

export default Notes;