'use client'
import { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';
import { ToastContainer, toast } from 'react-toastify'; // Import ToastContainer and toast
import 'react-toastify/dist/ReactToastify.css'; // Import toast styles
import '../courses/app.css'

const CoursePage = () => {

    interface Course {
        _id: string;
        title: string;
        description: string;
        category: string;
        difficulty_level: 'Beginner' | 'Intermediate' | 'Advanced';
        created_by: string;
        created_at: Date;
    }

    const [Courses, setCourses] = useState<Course[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false); 
    const [newCourse, setNewCourse] = useState({ 
        title: '',
        description: '',
        category: '',
        difficulty_level: 'Beginner',
        created_by: '',
        created_at: new Date(),
    });
    const handleEdit = (course: Course) => {
      setEditingCourse(course);
      setIsEditModalOpen(true);
  };
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingCourse, setEditingCourse] = useState<Course | null>(null);


    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await axios.get('http://localhost:3001/courses');
                if (Array.isArray(response.data)) {
                    console.log((response.data));
                    setCourses(response.data);
                } else {
                    console.log("Data isn't of type array: ", response.data);
                }
            } catch (error) {
                console.error('Error fetching courses:', error);
            }
        };
        fetchCourses();
    }, []);

    const addCourse = async () => {
        try {
            const response = await axios.post('http://localhost:3001/courses', newCourse);
            setCourses([...Courses, response.data]); 
            setIsModalOpen(false); 
            setNewCourse({ title: '', description: '', category: '', difficulty_level: 'Beginner', created_by: '', created_at: new Date() }); // Reset form
            toast.success('Course added successfully!'); 
        } catch (error) {
            console.error('Error adding course:', error);
            toast.error('Failed to add course.'); 
        }
    };

    const deleteCourse = async (id: string) => {
      try {
          await axios.delete(`http://localhost:3001/courses/${id}`); 
          setCourses(Courses.filter(course => course._id !== id)); 
          toast.success('Course deleted successfully!'); 
      } catch (error) {
          console.error('Error deleting course:', error);
          toast.error('Failed to delete course.'); 
      }
  };
  const updateCourse = async () => {
    if (!editingCourse) return;
    
    try {
        const response = await axios.put(`http://localhost:3001/courses/${editingCourse._id}`, editingCourse);
        setCourses(Courses.map(course => 
            course._id === editingCourse._id ? response.data : course
        ));
        setIsEditModalOpen(false);
        setEditingCourse(null);
        toast.success('Course updated successfully!');
    } catch (error) {
        console.error('Error updating course:', error);
        toast.error('Failed to update course.');
    }
};



    return (
      <div className="course-table-container">
        <h1 className="title">Courses</h1>
        <button onClick={() => setIsModalOpen(true)}>Add Course</button> {/* Button to open modal */}
        
        {isModalOpen && ( // Modal for adding a course
          <div className="modal">
            <h2>Add New Course</h2>
            <form onSubmit={(e) => { e.preventDefault(); addCourse(); }}>
              <input type="text" placeholder="Title" value={newCourse.title} onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })} required />
              <input type="text" placeholder="Description" value={newCourse.description} onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })} required />
              <input type="text" placeholder="Category" value={newCourse.category} onChange={(e) => setNewCourse({ ...newCourse, category: e.target.value })} required />
              <select value={newCourse.difficulty_level} onChange={(e) => setNewCourse({ ...newCourse, difficulty_level: e.target.value })}>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
              <input type="text" placeholder="Created By" value={newCourse.created_by} onChange={(e) => setNewCourse({ ...newCourse, created_by: e.target.value })} required />
              <button type="submit">Submit</button>
              <button type="button" onClick={() => setIsModalOpen(false)}>Cancel</button> {/* Button to close modal */}
            </form>
          </div>
        )}

        {isEditModalOpen && editingCourse && (
                <div className="modal">
                    <h2>Edit Course</h2>
                    <form onSubmit={(e) => { e.preventDefault(); updateCourse(); }}>
                        <input
                            type="text"
                            placeholder="Title"
                            value={editingCourse.title}
                            onChange={(e) => setEditingCourse({
                                ...editingCourse,
                                title: e.target.value
                            })}
                            required
                        />
                        <input
                            type="text"
                            placeholder="Description"
                            value={editingCourse.description}
                            onChange={(e) => setEditingCourse({
                                ...editingCourse,
                                description: e.target.value
                            })}
                            required
                        />
                        <input
                            type="text"
                            placeholder="Category"
                            value={editingCourse.category}
                            onChange={(e) => setEditingCourse({
                                ...editingCourse,
                                category: e.target.value
                            })}
                            required
                        />
                        <select
                            value={editingCourse.difficulty_level}
                            onChange={(e) => setEditingCourse({
                                ...editingCourse,
                                difficulty_level: e.target.value as 'Beginner' | 'Intermediate' | 'Advanced'
                            })}
                        >
                            <option value="Beginner">Beginner</option>
                            <option value="Intermediate">Intermediate</option>
                            <option value="Advanced">Advanced</option>
                        </select>
                        <input
                            type="text"
                            placeholder="Created By"
                            value={editingCourse.created_by}
                            onChange={(e) => setEditingCourse({
                                ...editingCourse,
                                created_by: e.target.value
                            })}
                            required
                        />
                        <button type="submit">Update</button>
                        <button type="button" onClick={() => {
                            setIsEditModalOpen(false);
                            setEditingCourse(null);
                        }}>Cancel</button>
                    </form>
                </div>
            )}

        <table className="course-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Category</th>
              <th>Difficulty Level</th>
              <th>Created By</th>
              <th>Created At</th>
            </tr>
          </thead>
          <tbody>
            {Courses.map(course => (
              <tr key={course._id}>
                <td>{course.title}</td>
                <td>{course.description}</td>
                <td>{course.category}</td>
                <td>{course.difficulty_level}</td>
                <td>{course.created_by}</td>
                <td>{new Date(course.created_at).toLocaleDateString()}</td>
                <td>
                  <button onClick={() => handleEdit(course)}>Edit</button>
                  <button onClick={() => deleteCourse(course._id)}>Delete</button> {/* Delete button */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <ToastContainer /> {/* Add ToastContainer to render toasts */}
      </div>
    );
};

export default CoursePage;