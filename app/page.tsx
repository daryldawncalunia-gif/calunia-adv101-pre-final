'use client';
import { useState, useEffect } from 'react';

type Tab = 'todo' | 'completed';

interface Todo {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  dateCreated: string;
  dateUpdated: string;
}

export default function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState<{ title: string; description: string }>({ title: '', description: '' });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editData, setEditData] = useState<{ title: string; description: string }>({ title: '', description: '' });
  const [activeTab, setActiveTab] = useState<Tab>('todo');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Load todos from localStorage on component mount
  useEffect(() => {
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
      try {
        const parsed = JSON.parse(savedTodos);
        if (Array.isArray(parsed)) {
          setTodos(parsed as Todo[]);
        }
      } catch (e) {
        console.warn('Failed to parse todos from localStorage, seeding sample data.');
      }
    } else {
      // Initialize with sample data
      const sampleTodos: Todo[] = [
        {
          id: 1700445601,
          title: 'Grocery Shopping',
          description: 'Pick up milk, eggs, cheese, and fresh produce from the market.',
          completed: false,
          dateCreated: 'November 20, 2025 09:23 PM',
          dateUpdated: 'November 20, 2025 09:23 PM'
        },
        {
          id: 1700445602,
          title: 'Pay Utility Bills',
          description: 'Ensure electricity and internet bills are paid before the due date (Friday).',
          completed: false,
          dateCreated: 'November 20, 2025 09:23 PM',
          dateUpdated: 'November 20, 2025 09:23 PM'
        },
        {
          id: 1700445603,
          title: 'Call Mom',
          description: 'Check in and finalize plans for the upcoming holiday weekend.',
          completed: false,
          dateCreated: 'November 20, 2025 09:23 PM',
          dateUpdated: 'November 20, 2025 09:23 PM'
        },
        {
          id: 1700445604,
          title: 'Car Wash',
          description: 'Take the car to the wash and check the tire pressure.',
          completed: false,
          dateCreated: 'November 20, 2025 09:23 PM',
          dateUpdated: 'November 20, 2025 09:23 PM'
        },
        {
          id: 1700445605,
          title: 'Book Appointment',
          description: 'Schedule the annual physical check-up with Dr. Peterson.',
          completed: false,
          dateCreated: 'November 20, 2025 09:23 PM',
          dateUpdated: 'November 20, 2025 09:23 PM'
        }
      ];
      setTodos(sampleTodos);
    }
  }, []);

  // Save todos to localStorage whenever todos change
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  // Format date
  const formatDate = (): string => {
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    };
    return now.toLocaleString('en-US', options);
  };

  // Create a new todo
  const addTodo = () => {
    if (newTodo.title.trim() !== '' && newTodo.description.trim() !== '') {
      const currentDate = formatDate();
      const newTodoItem = {
        id: Date.now(),
        title: newTodo.title.trim(),
        description: newTodo.description.trim(),
        completed: false,
        dateCreated: currentDate,
        dateUpdated: currentDate
      };
      setTodos([...todos, newTodoItem]);
      setNewTodo({ title: '', description: '' });
    }
  };

  // Update a todo
  const startEditing = (todo: Todo) => {
    setEditingId(todo.id);
    setEditData({ title: todo.title, description: todo.description });
  };

  const saveEdit = () => {
    if (editData.title.trim() !== '' && editData.description.trim() !== '') {
      setTodos(todos.map(todo =>
        todo.id === editingId ? { 
          ...todo, 
          title: editData.title.trim(),
          description: editData.description.trim(),
          dateUpdated: formatDate()
        } : todo
      ));
      setEditingId(null);
      setEditData({ title: '', description: '' });
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditData({ title: '', description: '' });
  };

  // Delete a todo
  const deleteTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  // Mark as complete/incomplete
  const toggleComplete = (id: number) => {
    setTodos(todos.map(todo =>
      todo.id === id ? {
        ...todo,
        completed: !todo.completed,
        dateUpdated: formatDate(),
      } : todo
    ));
  };

  // Filter todos based on active tab and search term
  const filteredTodos = todos.filter(todo => {
    const matchesSearch = 
      todo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      todo.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeTab === 'completed') {
      return todo.completed && matchesSearch;
    } else if (activeTab === 'todo') {
      return !todo.completed && matchesSearch;
    }
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Todo Application
        </h1>

        {/* Add Todo Form */}
        <div className="mb-8 bg-blue-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Add New Todo</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              value={newTodo.title}
              onChange={(e) => setNewTodo({...newTodo, title: e.target.value})}
              placeholder="Title..."
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <input
              type="text"
              value={newTodo.description}
              onChange={(e) => setNewTodo({...newTodo, description: e.target.value})}
              placeholder="Description..."
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={addTodo}
            className="w-full md:w-auto px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200"
          >
            Add Todo
          </button>
        </div>

        {/* Search and Tabs */}
        <div className="mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="w-full md:w-64">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search todos..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex border border-gray-300 rounded-lg overflow-hidden">
            <button
              onClick={() => setActiveTab('todo')}
              className={`px-6 py-2 font-medium transition duration-200 ${
                activeTab === 'todo'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              To Do ({todos.filter(todo => !todo.completed).length})
            </button>
            <button
              onClick={() => setActiveTab('completed')}
              className={`px-6 py-2 font-medium transition duration-200 ${
                activeTab === 'completed'
                  ? 'bg-green-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Completed ({todos.filter(todo => todo.completed).length})
            </button>
          </div>
        </div>

        {/* Todo Table */}
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date Created/Updated
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTodos.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    {searchTerm ? 'No todos match your search.' : 'No todos found.'}
                  </td>
                </tr>
              ) : (
                filteredTodos.map(todo => (
                  <tr 
                    key={todo.id} 
                    className={`transition duration-200 ${
                      todo.completed ? 'bg-green-50 hover:bg-green-100' : 'hover:bg-gray-50'
                    }`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                      {todo.id}
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingId === todo.id ? (
                        <input
                          type="text"
                          value={editData.title}
                          onChange={(e) => setEditData({...editData, title: e.target.value})}
                          className="w-full px-3 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                          autoFocus
                        />
                      ) : (
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={todo.completed}
                            onChange={() => toggleComplete(todo.id)}
                            className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                          />
                          <span className={`text-sm font-medium ${
                            todo.completed ? 'line-through text-gray-500' : 'text-gray-900'
                          }`}>
                            {todo.title}
                          </span>
                        </div>
                      )}
                    </td>
                    
                    <td className="px-6 py-4">
                      {editingId === todo.id ? (
                        <input
                          type="text"
                          value={editData.description}
                          onChange={(e) => setEditData({...editData, description: e.target.value})}
                          className="w-full px-3 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      ) : (
                        <span className={`text-sm ${
                          todo.completed ? 'line-through text-gray-500' : 'text-gray-700'
                        }`}>
                          {todo.description}
                        </span>
                      )}
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {todo.dateUpdated}
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {editingId === todo.id ? (
                        <div className="flex space-x-2">
                          <button
                            onClick={saveEdit}
                            className="text-green-600 hover:text-green-900 font-medium"
                          >
                            Save
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="text-gray-600 hover:text-gray-900 font-medium"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="flex space-x-3">
                          <button
                            onClick={() => startEditing(todo)}
                            className="text-blue-600 hover:text-blue-900 font-medium"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => deleteTodo(todo.id)}
                            className="text-red-600 hover:text-red-900 font-medium"
                          >
                            Delete
                          </button>
                          <button
                            onClick={() => toggleComplete(todo.id)}
                            className={`font-medium ${
                              todo.completed 
                                ? 'text-orange-600 hover:text-orange-900' 
                                : 'text-green-600 hover:text-green-900'
                            }`}
                          >
                            {todo.completed ? 'Undo' : 'Complete'}
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Stats */}
        <div className="mt-6 pt-4 border-t border-gray-200 text-sm text-gray-600 flex justify-between items-center">
          <div>
            <span className="font-semibold">Total:</span> {todos.length} | 
            <span className="font-semibold text-green-600 ml-2">Completed:</span> {todos.filter(todo => todo.completed).length} | 
            <span className="font-semibold text-blue-600 ml-2">Pending:</span> {todos.filter(todo => !todo.completed).length}
          </div>
          <div className="text-xs text-gray-500">
            Data persists in browser storage
          </div>
        </div>
      </div>
    </div>
  );
}