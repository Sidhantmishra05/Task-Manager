import React, {
    createContext,
    useContext,
    useEffect,
    useState
} from "react";
import axios from "axios";

const TaskContext = createContext();

const apiUrl =  "https://task-manager-1-i7l8.onrender.com";
const apiUrle= "https://task-manager-1-i7l8.onrender.com/createtask";

export const useTaskContext = () => {
    return useContext(TaskContext);
};

export const TaskProvider = ({ children }) => {
    const [tasks, setTasks] = useState([]);
    const [filteredTasks, setFilteredTasks] = useState([]);
    const [totalTasks, setTotalTasks] = useState(0);
    const [completedTasks, setCompletedTasks] = useState(0);
    const [todoTasks, setTodoTasks] = useState(0);

    useEffect(() => {
        fetchData();
    }, [totalTasks]);

    const fetchData = async () => {
        try {
            const response = await axios.get(`${apiUrl}/tasks`);
            setTasks(response.data);
            setFilteredTasks(response.data);
            setTotalTasks(response.data.length);
            const completedCount = response.data.filter(
                (task) => task.status === "completed"
            ).length;
            setCompletedTasks(completedCount);
            setTodoTasks(response.data.length - completedCount);
        } catch (err) {
            console.error("Error fetching data:", err);
        }
    };

    const handleFilterClick = (status) => {
        if (status === "all") {
            setFilteredTasks(tasks);
        } else {
            const filtered = tasks.filter((task) =>
                task.status === status);
            setFilteredTasks(filtered);
        }
    };

    const addTask = async (title, description, status) => {
        try {
            const response = await axios.post(`${apiUrle}`, {
                title,
                description,
                status,
            });
            setTasks([...tasks, response.data]);
            if (status === "completed") {
                setCompletedTasks((prev) => prev + 1);
            } else {
                setTodoTasks((prev) => prev + 1);
            }
            setTotalTasks((prev) => prev + 1);
        } catch (err) {
            console.error("Error adding task:", err);
        }
    };

    const deleteTask = async (taskId) => {
        try {
            await axios.delete(`${apiUrl}/tasks/${taskId}`);
            const updatedTasks = tasks.filter((task) => task.id !== taskId);
            setTasks(updatedTasks);
            setFilteredTasks(updatedTasks);
            setTotalTasks((prev) => prev - 1);
            const completedCount = updatedTasks.filter(
                (task) => task.status === "completed"
            ).length;
            setCompletedTasks(completedCount);
            setTodoTasks(updatedTasks.length - completedCount);
        } catch (err) {
            console.error("Error deleting task:", err);
        }
    };

    
    const editTask = async (taskId, updatedTitle, updatedDescription, updatedStatus) => {
        try {
            console.log(" Sending PUT request:", { taskId, updatedTitle, updatedDescription, updatedStatus });
    
            // Ensure correct data structure
            const payload = {
                title: updatedTitle?.title || updatedTitle, // Extract string if it's nested
                description: updatedDescription, 
                status: updatedStatus || "pending" // Default status if missing
            };
    
            console.log(" Final Payload:", payload);
    
            await axios.put(`${apiUrl}/tasks/${taskId}`, payload, {
                headers: { "Content-Type": "application/json" },
            });
    
            console.log(" Task updated successfully");
            fetchData();
        } catch (err) {
            console.error("Error editing task:", err.response?.data || err.message);
        }
    };
    
  
    

    const updateTaskStatus = async (taskId, status) => {
        try {
            // Find the existing task data
            const taskToUpdate = tasks.find(task => task._id === taskId);
            if (!taskToUpdate) {
                console.error(" Task not found in frontend state.");
                return;
            }
    
            // Debugging: Log the request payload
            console.log(" Sending update request:", {
                title: taskToUpdate.title,
                description: taskToUpdate.description,
                status: status
            });
    
            // Send the request
            const response = await axios.put(`${apiUrl}/tasks/${taskId}`, {
                title: taskToUpdate.title,
                description: taskToUpdate.description,
                status: status
            });
    
            // Log response
            console.log(" Task updated successfully:", response.data);
    
            // Update UI
            const updatedTasks = tasks.map(task =>
                task._id === taskId ? { ...task, status } : task
            );
    
            setTasks(updatedTasks);
            setFilteredTasks(updatedTasks);
            setCompletedTasks(prev => (status === "completed" ? prev + 1 : Math.max(0, prev - 1)));
            setTodoTasks(prev => (status !== "completed" ? prev + 1 : Math.max(0, prev - 1)));
        } catch (err) {
            console.error(" Error updating task status:", err.response?.data || err.message);
        }
    };
    
   
    return (
        <TaskContext.Provider
            value={{
                filteredTasks,
                totalTasks,
                completedTasks,
                todoTasks,
                handleFilterClick,
                addTask,
                deleteTask,
                editTask,
                updateTaskStatus,
            }}
        >
            {children}
        </TaskContext.Provider>
    );
};
