import { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc
} from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from './useAuth';

export const useMemories = () => {
  const { user } = useAuth();
  const [memories, setMemories] = useState([]);
  const [collections, setCollections] = useState([{ id: 'default', name: 'Untethered Moments', color: '#5b21b6' }]);

  useEffect(() => {
    if (!user) {
      setMemories([]);
      setCollections([{ id: 'default', name: 'Untethered Moments', color: '#5b21b6' }]);
      return;
    }

    // Memories Listener
    const qMemories = query(
      collection(db, 'memories'), 
      where('userId', '==', user.id)
    );
    
    const unsubscribeMemories = onSnapshot(qMemories, (snapshot) => {
      const mems = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      // Sort client-side to avoid Firebase complex index requirements
      mems.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
      setMemories(mems);
    });

    // Collections Listener
    const qCollections = query(
      collection(db, 'collections'), 
      where('userId', '==', user.id)
    );

    const unsubscribeCollections = onSnapshot(qCollections, (snapshot) => {
      const cols = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCollections([{ id: 'default', name: 'Untethered Moments', color: '#5b21b6' }, ...cols]);
    });

    return () => {
      unsubscribeMemories();
      unsubscribeCollections();
    };
  }, [user]);

  const addMemory = async (memory) => {
    if (!user) return;
    try {
      await addDoc(collection(db, 'memories'), {
        ...memory,
        userId: user.id,
        images: memory.images || [],
        tags: memory.tags || [],
        location: memory.location || '',
        story: memory.story || '',
        collectionId: memory.collectionId || 'default',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error adding memory:", error);
    }
  };

  const updateMemory = async (id, updatedData) => {
    if (!user) return;
    try {
      const memRef = doc(db, 'memories', id);
      await updateDoc(memRef, {
        ...updatedData,
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error("Error updating memory:", error);
    }
  };

  const deleteMemory = async (id) => {
    if (!user) return;
    try {
      await deleteDoc(doc(db, 'memories', id));
    } catch (error) {
      console.error("Error deleting memory:", error);
    }
  };

  const addCollection = async (name, color) => {
    if (!user) return;
    try {
      await addDoc(collection(db, 'collections'), {
        name,
        color,
        userId: user.id,
      });
    } catch (error) {
      console.error("Error adding collection:", error);
    }
  };

  const deleteCollection = async (id) => {
    if (!user || id === 'default') return;
    try {
      await deleteDoc(doc(db, 'collections', id));
      // Reassign memories in this collection to 'default'
      const memoriesToUpdate = memories.filter(m => m.collectionId === id);
      for (const m of memoriesToUpdate) {
        await updateDoc(doc(db, 'memories', m.id), { collectionId: 'default' });
      }
    } catch (error) {
      console.error("Error deleting collection:", error);
    }
  };

  const toggleFavorite = async (id) => {
    if (!user) return;
    const memory = memories.find(m => m.id === id);
    if (!memory) return;
    try {
      await updateDoc(doc(db, 'memories', id), {
        favorite: !memory.favorite
      });
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
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
