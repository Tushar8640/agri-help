"use client"

import React, { createContext, useContext, useState, useEffect } from 'react';

// Types
export interface Project {
  id: string;
  name: string;
  cropType: string;
  status: 'Planning' | 'Active' | 'Harvested';
  area: number;
  areaUnit: 'ha' | 'acre';
  startDate: string;
  endDate?: string;
  budget: number;
  expenses: number;
  yield?: number;
  yieldUnit?: 'ton' | 'kg';
  progress: number;
  weather: {
    risk: 'Low' | 'Medium' | 'High';
    forecast: string;
  };
}

export interface Expense {
  id: string;
  projectId: string;
  description: string;
  amount: number;
  date: string;
  category: 'Seeds' | 'Fertilizer' | 'Pesticides' | 'Labor' | 'Equipment' | 'Other';
}

export interface Harvest {
  id: string;
  projectId: string;
  date: string;
  quantity: number;
  unit: 'ton' | 'kg';
  quality: 'Excellent' | 'Good' | 'Average' | 'Poor';
  notes?: string;
}

interface ProjectContextType {
  projects: Project[];
  expenses: Expense[];
  harvests: Harvest[];
  loading: boolean;
  addProject: (project: Omit<Project, 'id'>) => void;
  updateProject: (project: Project) => void;
  deleteProject: (id: string) => void;
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  addHarvest: (harvest: Omit<Harvest, 'id'>) => void;
  getProjectById: (id: string) => Project | undefined;
  getExpensesByProjectId: (projectId: string) => Expense[];
  getHarvestsByProjectId: (projectId: string) => Harvest[];
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

// Sample data
const sampleProjects: Project[] = [
  {
    id: '1',
    name: 'Winter Wheat 2025',
    cropType: 'Wheat',
    status: 'Active',
    area: 120,
    areaUnit: 'ha',
    startDate: '2024-09-15',
    budget: 50000,
    expenses: 32500,
    progress: 65,
    weather: {
      risk: 'Low',
      forecast: 'Sunny'
    }
  },
  {
    id: '2',
    name: 'Spring Corn',
    cropType: 'Corn',
    status: 'Planning',
    area: 85,
    areaUnit: 'ha',
    startDate: '2025-03-01',
    budget: 42000,
    expenses: 8500,
    progress: 20,
    weather: {
      risk: 'Medium',
      forecast: 'Rainy'
    }
  },
  {
    id: '3',
    name: 'Organic Tomatoes',
    cropType: 'Vegetables',
    status: 'Harvested',
    area: 18,
    areaUnit: 'ha',
    startDate: '2024-04-10',
    endDate: '2024-08-30',
    budget: 28000,
    expenses: 26400,
    yield: 145,
    yieldUnit: 'ton',
    progress: 100,
    weather: {
      risk: 'Low',
      forecast: 'Sunny'
    }
  },
  {
    id: '4',
    name: 'Soybean Field 3',
    cropType: 'Soybean',
    status: 'Active',
    area: 95,
    areaUnit: 'ha',
    startDate: '2024-05-20',
    budget: 38000,
    expenses: 24700,
    progress: 75,
    weather: {
      risk: 'High',
      forecast: 'Storm'
    }
  }
];

const sampleExpenses: Expense[] = [
  { id: '1', projectId: '1', description: 'Winter wheat seeds', amount: 12500, date: '2024-09-15', category: 'Seeds' },
  { id: '2', projectId: '1', description: 'Fertilizer application', amount: 8500, date: '2024-10-10', category: 'Fertilizer' },
  { id: '3', projectId: '1', description: 'Seasonal workers', amount: 6800, date: '2024-10-25', category: 'Labor' },
  { id: '4', projectId: '1', description: 'Pesticide treatment', amount: 4700, date: '2024-11-15', category: 'Pesticides' },
  { id: '5', projectId: '2', description: 'Corn seeds purchase', amount: 8500, date: '2025-02-10', category: 'Seeds' },
  { id: '6', projectId: '3', description: 'Organic tomato seeds', amount: 4200, date: '2024-03-25', category: 'Seeds' },
  { id: '7', projectId: '3', description: 'Organic fertilizer', amount: 6500, date: '2024-04-15', category: 'Fertilizer' },
  { id: '8', projectId: '3', description: 'Harvesting equipment', amount: 9800, date: '2024-08-15', category: 'Equipment' },
  { id: '9', projectId: '3', description: 'Seasonal workers', amount: 5900, date: '2024-08-20', category: 'Labor' },
  { id: '10', projectId: '4', description: 'Soybean seeds', amount: 9500, date: '2024-05-20', category: 'Seeds' },
  { id: '11', projectId: '4', description: 'Fertilizer application', amount: 7800, date: '2024-06-05', category: 'Fertilizer' },
  { id: '12', projectId: '4', description: 'Pest control', amount: 5400, date: '2024-07-12', category: 'Pesticides' },
  { id: '13', projectId: '4', description: 'Equipment maintenance', amount: 2000, date: '2024-07-25', category: 'Equipment' }
];

const sampleHarvests: Harvest[] = [
  { id: '1', projectId: '3', date: '2024-08-10', quantity: 45, unit: 'ton', quality: 'Excellent', notes: 'Best quality from east field' },
  { id: '2', projectId: '3', date: '2024-08-20', quantity: 55, unit: 'ton', quality: 'Good', notes: 'Slightly affected by rain' },
  { id: '3', projectId: '3', date: '2024-08-30', quantity: 45, unit: 'ton', quality: 'Good', notes: 'Final harvest, good overall yield' },
];

export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>(sampleProjects);
  const [expenses, setExpenses] = useState<Expense[]>(sampleExpenses);
  const [harvests, setHarvests] = useState<Harvest[]>(sampleHarvests);
  const [loading, setLoading] = useState(true);

  // Simulate loading data
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const addProject = (project: Omit<Project, 'id'>) => {
    const newProject = {
      ...project,
      id: Date.now().toString(),
    };
    setProjects([...projects, newProject as Project]);
  };

  const updateProject = (project: Project) => {
    setProjects(projects.map(p => p.id === project.id ? project : p));
  };

  const deleteProject = (id: string) => {
    setProjects(projects.filter(p => p.id !== id));
    setExpenses(expenses.filter(e => e.projectId !== id));
    setHarvests(harvests.filter(h => h.projectId !== id));
  };

  const addExpense = (expense: Omit<Expense, 'id'>) => {
    const newExpense = {
      ...expense,
      id: Date.now().toString(),
    };
    setExpenses([...expenses, newExpense as Expense]);
    
    // Update project expense total
    const project = projects.find(p => p.id === expense.projectId);
    if (project) {
      updateProject({
        ...project,
        expenses: project.expenses + expense.amount
      });
    }
  };

  const addHarvest = (harvest: Omit<Harvest, 'id'>) => {
    const newHarvest = {
      ...harvest,
      id: Date.now().toString(),
    };
    setHarvests([...harvests, newHarvest as Harvest]);
    
    // Update project yield if needed
    const project = projects.find(p => p.id === harvest.projectId);
    if (project) {
      const currentYield = project.yield || 0;
      updateProject({
        ...project,
        yield: currentYield + harvest.quantity,
        yieldUnit: harvest.unit
      });
    }
  };

  const getProjectById = (id: string) => {
    return projects.find(p => p.id === id);
  };

  const getExpensesByProjectId = (projectId: string) => {
    return expenses.filter(e => e.projectId === projectId);
  };

  const getHarvestsByProjectId = (projectId: string) => {
    return harvests.filter(h => h.projectId === projectId);
  };

  return (
    <ProjectContext.Provider value={{
      projects,
      expenses,
      harvests,
      loading,
      addProject,
      updateProject,
      deleteProject,
      addExpense,
      addHarvest,
      getProjectById,
      getExpensesByProjectId,
      getHarvestsByProjectId
    }}>
      {children}
    </ProjectContext.Provider>
  );
};

export const useProjects = () => {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProjects must be used within a ProjectProvider');
  }
  return context;
};