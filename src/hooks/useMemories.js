import { useState, useEffect } from 'react';

export const useMemories = () => {
  const [memories, setMemories] = useState(() => {
    const saved = localStorage.getItem('digital_memories_v2');
    return saved ? JSON.parse(saved) : [];
  });

  const [collections, setCollections] = useState(() => {
    const saved = localStorage.getItem('digital_collections');
    return saved ? JSON.parse(saved) : [{ id: 'default', name: 'Untethered Moments', color: '#5b21b6' }];
  });

  useEffect(() => {
    localStorage.setItem('digital_memories_v2', JSON.stringify(memories));
  }, [memories]);

  useEffect(() => {
    localStorage.setItem('digital_collections', JSON.stringify(collections));
  }, [collections]);

  const addMemory = (memory) => {
    const newMemory = {
      ...memory,
      id: crypto.randomUUID(),
      images: memory.images || [], // Support for multiple images
      tags: memory.tags || [],
      location: memory.location || '',
      story: memory.story || '',
      collectionId: memory.collectionId || 'default',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setMemories((prev) => [newMemory, ...prev]);
  };

  const updateMemory = (id, updatedData) => {
    setMemories((prev) =>
      prev.map((m) => (m.id === id ? { ...m, ...updatedData, updatedAt: new Date().toISOString() } : m))
    );
  };

  const deleteMemory = (id) => {
    setMemories((prev) => prev.filter((m) => m.id !== id));
  };

  const addCollection = (name, color) => {
    const newColl = { id: crypto.randomUUID(), name, color };
    setCollections(prev => [...prev, newColl]);
  };

  const deleteCollection = (id) => {
    if (id === 'default') return;
    setCollections(prev => prev.filter(c => c.id !== id));
    // Reassign memories to default
    setMemories(prev => prev.map(m => m.collectionId === id ? { ...m, collectionId: 'default' } : m));
  };

  const toggleFavorite = (id) => {
    setMemories(prev => prev.map(m => m.id === id ? { ...m, favorite: !m.favorite } : m));
  };

  return {
    memories,
    collections,
    addMemory,
    updateMemory,
    deleteMemory,
    addCollection,
    deleteCollection,
    toggleFavorite,
  };
};
