import { useState, useEffect, useMemo } from 'react';
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
  const [dbRoadmap, setDbRoadmap] = useState<{level: string, data: RoadmapTopic[]} | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoadmap = async () => {
      setLoading(true);
      try {
        const docRef = doc(db, 'roadmaps', level);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists() && docSnap.data().topics) {
          const dbTopics = docSnap.data().topics as RoadmapTopic[];
          let fallback: RoadmapTopic[] = [];
          if (level === 'secondary-ss2') fallback = SECONDARY_SS2_ROADMAP;
          else if (level === 'secondary-ss3') fallback = SECONDARY_SS3_ROADMAP;
          else if (level === 'undergraduate') fallback = UNDERGRADUATE_REAL_ROADMAP;
          else fallback = SECONDARY_ROADMAP;
          
          const merged = [...dbTopics];
          for (const localTopic of fallback) {
            if (!merged.find(t => t.id === localTopic.id)) {
              merged.push(localTopic);
            }
          }
          setDbRoadmap({ level, data: merged });
        }
      } catch (err) {
        console.error("Error fetching roadmap:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRoadmap();
  }, [level]);

  const roadmap = useMemo(() => {
    if (dbRoadmap && dbRoadmap.level === level) {
      return dbRoadmap.data;
    }
    if (level === 'secondary-ss2') return SECONDARY_SS2_ROADMAP;
    if (level === 'secondary-ss3') return SECONDARY_SS3_ROADMAP;
    if (level === 'undergraduate') return UNDERGRADUATE_REAL_ROADMAP;
    return SECONDARY_ROADMAP;
  }, [level, dbRoadmap]);

  return { roadmap, loading };
};
