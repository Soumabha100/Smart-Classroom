// client/src/components/ResourcePlanner.jsx (FIXED for Persistence)

import React, { useState, useEffect } from "react";
import { 
    FileText, 
    Link as LinkIcon, 
    UploadCloud, 
    ClipboardList,
    PlusCircle,
    Trash2,
    BookOpen,
    Edit,
    Loader2,
    AlertCircle 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// --- Local Storage Key ---
const STORAGE_KEY = 'teacherResources';

// --- Mock Data (Used only on first run if localStorage is empty) ---
const mockResources = [
    { id: 'r1', type: 'File', title: 'React Lifecycle Cheatsheet.pdf', class: 'Web Dev 101', date: 'Dec 10', link: '#', isShared: true },
    { id: 'r2', type: 'Link', title: 'External DBNF Tutorial', class: 'Database Systems', date: 'Dec 5', link: 'https://example.com/dbnf', isShared: true },
    { id: 'r3', type: 'Plan', title: 'Lesson Plan: Module 4 Intro', class: 'Web Dev 101', date: 'Dec 12', isShared: false },
];
const mockClassNames = ['Web Dev 101', 'Database Systems', 'DSA with Python'];
// --- End Mock Data ---


// Function to initialize state from localStorage
const initializeResources = () => {
    try {
        const storedResources = localStorage.getItem(STORAGE_KEY);
        // If data exists in localStorage, parse and return it.
        if (storedResources) {
            return JSON.parse(storedResources);
        }
    } catch (error) {
        console.error("Error reading from localStorage:", error);
        // Fallback to mock data if localStorage read fails
    }
    // If no data or error, return the initial mock data
    return mockResources;
};


// Tab Content: Resource List (remains the same)
const ResourceList = ({ resources, onDelete, onEdit }) => (
    <div className="space-y-4">
        {resources.map((resource) => (
            <motion.div
                key={resource.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="p-4 bg-white dark:bg-slate-800 rounded-lg shadow-sm border dark:border-slate-700 flex items-center justify-between"
            >
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400">
                        {resource.type === 'File' && <FileText size={20} />}
                        {resource.type === 'Link' && <LinkIcon size={20} />}
                        {resource.type === 'Plan' && <ClipboardList size={20} />}
                    </div>
                    <div>
                        <a 
                            href={resource.type === 'Link' ? resource.link : '#'} 
                            target={resource.type === 'Link' ? "_blank" : "_self"}
                            rel="noopener noreferrer" 
                            className={`font-semibold ${resource.type === 'Link' ? 'text-blue-600 hover:underline dark:text-blue-400' : 'text-slate-800 dark:text-white'}`}
                        >
                            {resource.title}
                        </a>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            Class: {resource.class} | {resource.date} 
                            {resource.isShared && <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300">Shared</span>}
                        </p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button 
                        onClick={() => onEdit(resource)}
                        className="p-2 text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 rounded-full transition-colors"
                        title="Edit Resource"
                    >
                        <Edit size={18} />
                    </button>
                    <button 
                        onClick={() => onDelete(resource.id)}
                        className="p-2 text-red-500 hover:text-red-700 dark:hover:text-red-400 rounded-full transition-colors"
                        title="Delete Resource"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            </motion.div>
        ))}
        {resources.length === 0 && (
            <p className="text-center text-slate-500 dark:text-slate-400 p-8 border rounded-lg dark:border-slate-700">
                No resources found. Click 'Add New' to get started.
            </p>
        )}
    </div>
);

// Tab Content: Add New Resource Form (No change needed)
const AddResourceForm = ({ classes, onSubmit }) => {
    const [type, setType] = useState('File');
    const [title, setTitle] = useState('');
    const [file, setFile] = useState(null);
    const [url, setUrl] = useState('');
    const [classId, setClassId] = useState(classes[0] || '');
    const [isShared, setIsShared] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null); 

    const handleSubmit = (e) => {
        e.preventDefault();
        setError(null);
        
        if (!title.trim() || !classId) {
            setError("Title and Class are required.");
            return;
        }

        if (type === 'File' && !file) {
            setError("Please select a file to upload.");
            return;
        }

        if (type === 'Link' && (!url.match(/^https?:\/\/.+/) || url.length < 5)) {
            setError("Please enter a valid URL.");
            return;
        }

        setIsSubmitting(true);
        
        // Pass ALL required data to the parent component
        onSubmit({ 
            title, 
            type, 
            url, 
            classId, 
            isShared,
            fileName: file?.name 
        });

        // Simulate upload/save process
        setTimeout(() => {
            setTitle('');
            setFile(null);
            setUrl('');
            setIsSubmitting(false);
        }, 1500);
    };

    return (
        <motion.form 
            onSubmit={handleSubmit} 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4 p-6 border rounded-xl dark:border-slate-700 bg-slate-50 dark:bg-slate-900"
        >
            <h4 className="font-semibold text-lg text-slate-800 dark:text-white flex items-center gap-2">
                <PlusCircle size={20} className="text-indigo-500" /> 
                Add New Resource
            </h4>

            <div className="grid grid-cols-3 gap-3">
                {['File', 'Link', 'Plan'].map(t => (
                    <button
                        key={t}
                        type="button"
                        onClick={() => {setType(t); setError(null);}}
                        className={`p-3 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2 ${
                            type === t ? 'bg-indigo-600 text-white shadow-md' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                        }`}
                    >
                        {t === 'File' && <UploadCloud size={18} />}
                        {t === 'Link' && <LinkIcon size={18} />}
                        {t === 'Plan' && <ClipboardList size={18} />}
                        {t}
                    </button>
                ))}
            </div>

            <input
                type="text"
                placeholder={`Resource Title (${type} Name)`}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-3 border rounded-md dark:border-slate-600 dark:bg-slate-800 dark:text-white"
            />
            
            <select
                value={classId}
                onChange={(e) => setClassId(e.target.value)}
                className="w-full p-3 border rounded-md dark:border-slate-600 dark:bg-slate-800 dark:text-white"
            >
                <option value="" disabled>Select Class to Associate</option>
                {classes.map(c => (
                    <option key={c} value={c}>{c}</option>
                ))}
            </select>
            
            {type === 'File' && (
                <div className="p-3 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg text-center bg-white dark:bg-slate-800">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        {file ? file.name : 'Click to Upload File (PDF, DOCX, etc.)'}
                    </label>
                    <input
                        type="file"
                        onChange={(e) => setFile(e.target.files[0])}
                        className="hidden"
                        id="file-upload"
                    />
                    <label 
                        htmlFor="file-upload" 
                        className="inline-flex items-center px-4 py-2 bg-indigo-500 text-white font-semibold rounded-lg cursor-pointer hover:bg-indigo-600 transition-colors"
                    >
                        <UploadCloud size={18} className="mr-2" />
                        Choose File
                    </label>
                </div>
            )}

            {type === 'Link' && (
                <input
                    type="url"
                    placeholder="Enter External URL (e.g., https://youtube.com/lesson)"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="w-full p-3 border rounded-md dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                />
            )}

            {error && (
                <div className="flex items-center gap-2 text-red-600 bg-red-100 p-3 rounded-md text-sm">
                    <AlertCircle size={16} /> {error}
                </div>
            )}

            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <input
                        id="share-toggle"
                        type="checkbox"
                        checked={isShared}
                        onChange={(e) => setIsShared(e.target.checked)}
                        className="w-4 h-4 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500 dark:focus:ring-indigo-600 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <label htmlFor="share-toggle" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Share with enrolled students?
                    </label>
                </div>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                    {isSubmitting ? (
                        <Loader2 size={18} className="animate-spin" />
                    ) : (
                        <PlusCircle size={18} />
                    )}
                    {isSubmitting ? 'Saving...' : 'Save Resource'}
                </button>
            </div>
        </motion.form>
    );
};


const ResourcePlanner = () => {
    const [activeTab, setActiveTab] = useState('list');
    
    // FIX 1: Initialize state from localStorage
    const [resources, setResources] = useState(initializeResources); 
    
    const [feedback, setFeedback] = useState(null);
    const mockClassNames = ['Web Dev 101', 'Database Systems', 'DSA with Python'];

    // FIX 2: Use useEffect to save resources to localStorage whenever the state changes
    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(resources));
        } catch (error) {
            console.error("Error writing to localStorage:", error);
            setFeedback({ message: "Could not save resources to local storage. Data may be lost on refresh.", type: 'error' });
            setTimeout(() => setFeedback(null), 5000);
        }
    }, [resources]);


    const handleResourceSubmit = (res) => {
        setFeedback({ message: `Resource "${res.title}" of type ${res.type} saved successfully!`, type: 'success' });
        
        // Use the data passed from the form (res) to construct the new resource object
        setResources(prev => [{ 
            id: `r${Date.now()}`, 
            type: res.type, 
            title: res.title, 
            class: res.classId, 
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), // Use current date
            isShared: res.isShared, 
            link: res.type === 'Link' ? res.url : '#' 
        }, ...prev]); 
        
        setTimeout(() => setFeedback(null), 3000);
        setActiveTab('list'); // Switch back to the list to show the new item
    };

    const handleDeleteResource = (id) => {
        if(window.confirm("Are you sure you want to delete this resource?")) {
            // FIX 3: Update state, which triggers useEffect to update localStorage
            setResources(prev => prev.filter(r => r.id !== id)); 
            setFeedback({ message: "Resource deleted successfully.", type: 'success' });
            setTimeout(() => setFeedback(null), 3000);
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex gap-4 border-b dark:border-slate-700">
                <button
                    onClick={() => setActiveTab('list')}
                    className={`pb-3 text-lg font-semibold transition-colors ${
                        activeTab === 'list' ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600' : 'text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400'
                    }`}
                >
                    <span className="flex items-center gap-2"><BookOpen size={20} /> My Resource Library</span>
                </button>
                <button
                    onClick={() => setActiveTab('add')}
                    className={`pb-3 text-lg font-semibold transition-colors ${
                        activeTab === 'add' ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600' : 'text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400'
                    }`}
                >
                    <span className="flex items-center gap-2"><PlusCircle size={20} /> Add New</span>
                </button>
            </div>

            {feedback && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={`p-3 rounded-lg text-sm font-semibold ${feedback.type === 'success' ? 'bg-green-100 text-green-700' : feedback.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}
                >
                    <span className="flex items-center gap-2"><AlertCircle size={16} /> {feedback.message}</span>
                </motion.div>
            )}

            <AnimatePresence mode="wait">
                {activeTab === 'add' && (
                    <AddResourceForm key="form" classes={mockClassNames} onSubmit={handleResourceSubmit} />
                )}
                {activeTab === 'list' && (
                    <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <ResourceList resources={resources} onDelete={handleDeleteResource} onEdit={(r) => { 
                            console.log('Editing resource:', r.title);
                            setFeedback({ message: `Simulating editing for: ${r.title}`, type: 'info' });
                            setActiveTab('add'); 
                            setTimeout(() => setFeedback(null), 3000);
                        }} />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ResourcePlanner;