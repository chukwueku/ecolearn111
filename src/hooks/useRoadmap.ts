import { useState, useEffect } from 'react';
import { collection, doc, getDoc, getDocs, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { 
  SECONDARY_ROADMAP, 
  SECONDARY_SS2_ROADMAP, 
  SECONDARY_SS3_ROADMAP, 
  UNDERGRADUATE_REAL_ROADMAP, 
  RoadmapTopic 
} from '../constants';

export const useRoadmap = (level: string) => {
  const [roadmap, setRoadmap] = useState<RoadmapTopic[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoadmap = async () => {
      setLoading(true);
      try {
        const docRef = doc(db, 'roadmaps', level);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists() && docSnap.data().topics) {
          setRoadmap(docSnap.data().topics as RoadmapTopic[]);
        } else {
          // Fallback to constants
          let fallback: RoadmapTopic[] = [];
          if (level === 'secondary-ss2') fallback = SECONDARY_SS2_ROADMAP;
          else if (level === 'secondary-ss3') fallback = SECONDARY_SS3_ROADMAP;
          else if (level === 'undergraduate') fallback = UNDERGRADUATE_REAL_ROADMAP;
          else fallback = SECONDARY_ROADMAP;
          setRoadmap(fallback);
        }
      } catch (err) {
        console.error("Error fetching roadmap:", err);
        // Fallback
        let fallback: RoadmapTopic[] = [];
        if (level === 'secondary-ss2') fallback = SECONDARY_SS2_ROADMAP;
        else if (level === 'secondary-ss3') fallback = SECONDARY_SS3_ROADMAP;
        else if (level === 'undergraduate') fallback = UNDERGRADUATE_REAL_ROADMAP;
        else fallback = SECONDARY_ROADMAP;
        setRoadmap(fallback);
      } finally {
        setLoading(false);
      }
    };

    fetchRoadmap();
  }, [level]);

  return { roadmap, loading };
};
