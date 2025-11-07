import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { api } from '../utils/api';

const Labour = () => {
  const { user } = useAuth();
  const [labourLogs, setLabourLogs] = useState([]);
  const [works, setWorks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    workId: '',
    date: '',
    workers: [{ name: '', role: '', hoursWorked: '', hourlyRate: '' }]
  });

  useEffect(() => {
    fetchLabourLogs();
    fetchWorks();
  }, []);

  const fetchLabourLogs = async () => {
    try {
      const data = await api.getLabourLogs();
      setLabourLogs(data);
    } catch (error) {
      console.error('Failed to fetch labour logs:', error);
    }
  };

  const fetchWorks = async () => {
    try {
      const data = await api.getWorks();
      setWorks(data.filter(w => w.status === 'in_progress'));
    } catch (error) {
      console.error('Failed to fetch works:', error);
    }
  };

  const addWorker = () => {
    setFormData({
      ...formData,
      workers: [...formData.workers, { name: '', role: '', hoursWorked: '', hourlyRate: '' }]
    });
  };

  const updateWorker = (index, field, value) => {
    const updatedWorkers = formData.workers.map((worker, i) => 
      i === index ? { ...worker, [field]: value } : worker
    );
    setFormData({ ...formData, workers: updatedWorkers });
  };

  const removeWorker = (index) => {
    setFormData({
      ...formData,
      workers: formData.workers.filter((_, i) => i !== index)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const workers = formData.workers.map(w => ({
        ...w,
        hoursWorked: parseFloat(w.hoursWorked),
        hourlyRate: parseFloat(w.hourlyRate)
      }));

      const totalCost = workers.reduce((sum, w) => sum + (w.hoursWorked * w.hourlyRate), 0);

      const log = {
        workId: parseInt(formData.workId),
        date: formData.date,
        workers,
        totalCost,
        createdAt: new Date().toISOString()
      };

      await api.createLabourLog(log);

      // Create corresponding finance entry
      await api.createFinance({
        workId: log.workId,
        type: 'expense',
        category: 'labour',
        amount: totalCost,
        description: `Daily labour cost - ${new Date(log.date).toLocaleDateString()}`,
        date: log.date,
        createdAt: new Date().toISOString()
      });

      setFormData({
        workId: '',
        date: '',
        workers: [{ name: '', role: '', hoursWorked: '', hourlyRate: '' }]
      });
      setShowForm(false);
      fetchLabourLogs();
    } catch (error) {
      console.error('Failed to create labour log:', error);
    }
  };

  const roles = ['mason', 'casual', 'foreman', 'driver_operator', 'engineer'];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Labour Management</h1>
        <button 
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors duration-200 flex items-center space-x-2"
          onClick={() => setShowForm(true)}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span>Log Daily Labour</span>
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">Daily Labour Log</h2>
          </div>
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Work</label>
                  <select
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.workId}
                    onChange={(e) => setFormData({...formData, workId: e.target.value})}
                    required
                  >
                    <option value="">Select Work</option>
                    {works.map(work => (
                      <option key={work.id} value={work.id}>{work.title}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                  <input
                    type="date"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-4">
                  <label className="block text-sm font-medium text-gray-700">Workers</label>
                  <button 
                    type="button" 
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm transition-colors duration-200 flex items-center space-x-1"
                    onClick={addWorker}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span>Add Worker</span>
                  </button>
                </div>
                
                <div className="space-y-4">
                  {formData.workers.map((worker, index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-lg">
                      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                        <div>
                          <input
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Worker Name"
                            value={worker.name}
                            onChange={(e) => updateWorker(index, 'name', e.target.value)}
                            required
                          />
                        </div>
                        <div>
                          <select
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            value={worker.role}
                            onChange={(e) => updateWorker(index, 'role', e.target.value)}
                            required
                          >
                            <option value="">Select Role</option>
                            {roles.map(role => (
                              <option key={role} value={role}>{role.replace('_', ' ')}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <input
                            type="number"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Hours"
                            value={worker.hoursWorked}
                            onChange={(e) => updateWorker(index, 'hoursWorked', e.target.value)}
                            required
                          />
                        </div>
                        <div>
                          <input
                            type="number"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Rate/hr"
                            value={worker.hourlyRate}
                            onChange={(e) => updateWorker(index, 'hourlyRate', e.target.value)}
                            required
                          />
                        </div>
                        <div className="flex items-center">
                          <button
                            type="button"
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-md text-sm transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            onClick={() => removeWorker(index)}
                            disabled={formData.workers.length === 1}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                      {worker.hoursWorked && worker.hourlyRate && (
                        <div className="mt-2 text-sm text-gray-600">
                          Cost: ${(parseFloat(worker.hoursWorked) * parseFloat(worker.hourlyRate)).toFixed(2)}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex space-x-4">
                <button 
                  type="submit" 
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors duration-200"
                >
                  Log Labour
                </button>
                <button 
                  type="button" 
                  className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors duration-200"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Labour Logs</h2>
        </div>
        <div className="overflow-x-auto">
          {labourLogs.length === 0 ? (
            <div className="p-8 text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No labour logs</h3>
              <p className="mt-1 text-sm text-gray-500">Start by logging your first daily labour entry.</p>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Work</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Workers</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Hours</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Cost</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {labourLogs.map(log => (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {log.work?.title || 'Unknown Work'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(log.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {log.workers.length} workers
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {log.workers.reduce((sum, w) => sum + w.hoursWorked, 0)} hrs
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        ${log.totalCost.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="space-y-1">
                        {log.workers.map((worker, idx) => (
                          <div key={idx} className="text-xs">
                            <span className="font-medium">{worker.name}</span> ({worker.role}) - {worker.hoursWorked}h @ ${worker.hourlyRate}/h
                          </div>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default Labour;