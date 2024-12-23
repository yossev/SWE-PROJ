import { useState, useEffect } from 'react';
import axios from 'axios';

interface ModuleRating {
  moduleId: string;
  averageRating: number;
}

interface ContentEffectivenessData {
  courseId: string;
  courseRating: number;
  instructorRating: number;
  moduleRatings: ModuleRating[];
}

const ContentEffectiveness = ({ courseId, instructorId }: { courseId: string, instructorId: string }) => {
  const [contentEffectivenessData, setContentEffectivenessData] = useState<ContentEffectivenessData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContentEffectiveness = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/progress/content-effectiveness/${courseId}`, {
          params: { instructorId } // Send the instructorId as a query param
        });
        setContentEffectivenessData(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch content effectiveness data.');
        setLoading(false);
      }
    };

    fetchContentEffectiveness();
  }, [courseId, instructorId]);

  // Handle loading and error states
  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  // If data is not available, show a message
  if (!contentEffectivenessData) {
    return <div>No data available for content effectiveness.</div>;
  }

  return (
    <div className="content-effectiveness">
      <h2>Instructor and Course Content Effectiveness</h2>

      {/* Instructor Rating */}
      <div className="rating">
        <h3>Instructor Rating:</h3>
        <p>{contentEffectivenessData.instructorRating} / 5</p>
      </div>

      {/* Course Rating */}
      <div className="rating">
        <h3>Course Rating:</h3>
        <p>{contentEffectivenessData.courseRating} / 5</p>
      </div>

      {/* Module Ratings */}
      <div className="module-ratings">
        <h3>Module Ratings:</h3>
        <ul>
          {contentEffectivenessData.moduleRatings.map((module: ModuleRating) => (
            <li key={module.moduleId}>
              Module {module.moduleId}: {module.averageRating} / 5
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ContentEffectiveness;
