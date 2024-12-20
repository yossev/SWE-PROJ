'use client';
import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function RateModulePage() {
  const { userId } = useParams();
  const router = useRouter();
  const [modules, setModules] = useState([]);
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [rating, setRating] = useState<number | null>(null);

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/modules`);
        setModules(response.data);
      } catch (err) {
        console.error('Failed to fetch modules', err);
      }
    };

    fetchModules();
  }, []);

  const handleSubmit = async () => {
    try {
      await axios.post('http://localhost:3001/ratings', {
        ratedEntity: 'Module',
        ratedEntityId: selectedModule,
        user_id: userId,
        rating,
      });
      alert('Rating submitted successfully!');
      router.push('/dashboard');
    } catch (err) {
      console.error('Failed to submit rating', err);
    }
  };

  return (
    <div>
      <h1>Rate Module</h1>
      <label>
        Select Module:
        <select onChange={(e) => setSelectedModule(e.target.value)}>
          <option value="">Select a module</option>
          {modules.map((module: any) => (
            <option key={module._id} value={module._id}>
              {module.title}
            </option>
          ))}
        </select>
      </label>
      <label>
        Rating:
        <input
          type="number"
          value={rating || ''}
          onChange={(e) => setRating(Number(e.target.value))}
          min={1}
          max={5}
        />
      </label>
      <button onClick={handleSubmit} className="btn btn-primary">
        Submit
      </button>
    </div>
  );
}
