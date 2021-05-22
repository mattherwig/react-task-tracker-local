import { useState, useEffect } from "react";
import About from "./components/About";
import AddTask from "./components/AddTask";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Tasks from "./components/Tasks";
import { BrowserRouter, Route } from "react-router-dom";

const App = () => {
  const [showAddTask, setShowAddTask] = useState(false);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const getTasks = async () => {
      const tasksFromServer = await fetchTasks();
      setTasks(tasksFromServer);
    };
    getTasks();
  }, []);

  // Fetch Tasks
  const fetchTasks = async () => {
    const res = await fetch("http://localhost:5000/tasks");
    const data = await res.json();
    console.log("data", data);
    return data;
  };

  const handleAddTasks = async (task) => {
    const res = await fetch(`http://localhost:5000/tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(task),
    });
    const newTask = await res.json();
    setTasks([...tasks, newTask]);
  };

  const handleToggleReminder = async (id) => {
    const task = tasks.find((task) => task.id === id);
    if (!task) return;

    const updatedTask = { ...task, reminder: !task.reminder };

    const res = await fetch(`http://localhost:5000/tasks/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedTask),
    });
    const data = await res.json();
    console.log("data", data);
    setTasks(tasks.map((task) => (data.id === task.id ? data : task)));
  };

  const handleDeleteTask = async (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
    await fetch(`http://localhost:5000/tasks/${id}`, {
      method: "DELETE",
    });
  };

  return (
    <BrowserRouter>
      <div className="container">
        <Header
          showAdd={showAddTask}
          onAdd={() => setShowAddTask(!showAddTask)}
        />
        <Route
          path="/"
          exact
          render={(props) => (
            <>
              {showAddTask && <AddTask onAddTask={handleAddTasks} />}
              {tasks.length > 0 ? (
                <Tasks
                  tasks={tasks}
                  onToggleReminder={handleToggleReminder}
                  onDelete={handleDeleteTask}
                />
              ) : (
                "No Tasks"
              )}
            </>
          )}
        />
        <Route path="/about" component={About} />
        <Footer />
      </div>
    </BrowserRouter>
  );
};

export default App;
