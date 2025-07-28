// src/pages/AdminDashboard/AdminDashboard.jsx (Complete with modifications)
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/common/Layout/Layout';
import Button from '../../components/common/Button/Button';
import Input from '../../components/common/Input/Input';
import { useAuth } from '../../hooks/useAuth';
import { useApi } from '../../hooks/useApi';
import toast from 'react-hot-toast';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const { loading, execute } = useApi();
  const navigate = useNavigate();
  
  // Form hooks for different sections
  const { register: registerEmployee, handleSubmit: handleEmployeeSubmit, formState: { errors: employeeErrors }, reset: resetEmployee } = useForm();
  const { register: registerProject, handleSubmit: handleProjectSubmit, formState: { errors: projectErrors }, reset: resetProject } = useForm();
  const { register: registerTask, handleSubmit: handleTaskSubmit, formState: { errors: taskErrors }, reset: resetTask } = useForm();
  
  // State management
  const [invitedEmployees, setInvitedEmployees] = useState([]);
  const [allEmployees, setAllEmployees] = useState([]);
  const [pendingInvitations, setPendingInvitations] = useState([]);
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  
  // Assignment state - single unified assignment
  const [selectedProject, setSelectedProject] = useState('');
  const [selectedTask, setSelectedTask] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [selectedProjectForTask, setSelectedProjectForTask] = useState('');
  
  // Loading states
  const [loadingEmployees, setLoadingEmployees] = useState(false);
  const [loadingInvitations, setLoadingInvitations] = useState(false);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [loadingTasks, setLoadingTasks] = useState(false);

  useEffect(() => {
    loadEmployees();
    loadPendingInvitations();
    loadProjects();
    loadTasks();
  }, []);

  // Helper function for authenticated requests
  const authFetch = async (url, options = {}) => {
    const token = localStorage.getItem('authToken');
    const response = await fetch(url, {
      ...options,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        ...options.headers
      }
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Request failed');
    }
    
    return response.json();
  };

  // ===== EMPLOYEE MANAGEMENT FUNCTIONS =====
  const loadEmployees = async () => {
    setLoadingEmployees(true);
    const result = await execute(() => authFetch('http://localhost:5000/api/v1/employee'));
    if (result.success) {
      setAllEmployees(result.data || []);
    } else {
      toast.error('Failed to load employees: ' + result.error);
    }
    setLoadingEmployees(false);
  };

  const loadPendingInvitations = async () => {
    setLoadingInvitations(true);
    const result = await execute(() => authFetch('http://localhost:5000/api/v1/auth/pending-invitations'));
    if (result.success) {
      setPendingInvitations(result.data || []);
    } else {
      toast.error('Failed to load pending invitations: ' + result.error);
    }
    setLoadingInvitations(false);
  };

  const onInviteEmployee = async (data) => {
    const result = await execute(() => 
      authFetch('http://localhost:5000/api/v1/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          email: data.email,
          password: 'TempPassword123!',
          role: 'employee'
        })
      })
    );

    if (result.success) {
      toast.success(`Employee invitation sent to ${data.email}!`);
      setInvitedEmployees(prev => [...prev, { 
        email: data.email, 
        status: 'invited', 
        timestamp: new Date(),
        userId: result.data?.id
      }]);
      resetEmployee();
      toast.success('Check employee email for verification link!', { duration: 6000 });
      loadEmployees();
      loadPendingInvitations();
    } else {
      toast.error(result.error);
    }
  };

  const onResendInvitation = async (email, userId) => {
    const result = await execute(() => 
      authFetch('http://localhost:5000/api/v1/auth/resend-invitation', {
        method: 'POST',
        body: JSON.stringify({ userId, email })
      })
    );

    if (result.success) {
      toast.success(`Invitation resent to ${email}!`);
      setPendingInvitations(prev => 
        prev.map(inv => 
          inv.email === email 
            ? { ...inv, lastSent: new Date() }
            : inv
        )
      );
    } else {
      toast.error('Failed to resend invitation: ' + result.error);
    }
  };

  const onDeleteInvitation = async (email, userId) => {
    if (!window.confirm(`Are you sure you want to delete the invitation for ${email}? This will remove the user completely.`)) {
      return;
    }

    const result = await execute(() => 
      authFetch(`http://localhost:5000/api/v1/auth/delete-invitation/${userId}`, {
        method: 'DELETE'
      })
    );

    if (result.success) {
      toast.success(`Invitation for ${email} deleted successfully`);
      setPendingInvitations(prev => prev.filter(inv => inv.email !== email));
      setInvitedEmployees(prev => prev.filter(inv => inv.email !== email));
      loadEmployees();
    } else {
      toast.error('Failed to delete invitation: ' + result.error);
    }
  };

  const onRemoveEmployee = async (employeeId, employeeName) => {
    if (!window.confirm(`Are you sure you want to deactivate ${employeeName}? This action cannot be undone.`)) {
      return;
    }

    const result = await execute(() => 
      authFetch(`http://localhost:5000/api/v1/employee/deactivate/${employeeId}`)
    );

    if (result.success) {
      toast.success(`Employee ${employeeName} has been deactivated`);
      loadEmployees();
    } else {
      toast.error('Failed to deactivate employee: ' + result.error);
    }
  };

  // ===== PROJECT MANAGEMENT FUNCTIONS =====
  const loadProjects = async () => {
    setLoadingProjects(true);
    const result = await execute(() => authFetch('http://localhost:5000/api/v1/project'));
    if (result.success) {
      setProjects(result.data || []);
    } else {
      toast.error('Failed to load projects: ' + result.error);
    }
    setLoadingProjects(false);
  };

  const onCreateProject = async (data) => {
    const result = await execute(() => 
      authFetch('http://localhost:5000/api/v1/project', {
        method: 'POST',
        body: JSON.stringify({
          name: data.projectName,
          teamId: 'w7268578db3d0bc'
        })
      })
    );

    if (result.success) {
      toast.success(`Project "${data.projectName}" created successfully!`);
      resetProject();
      loadProjects();
    } else {
      toast.error('Failed to create project: ' + result.error);
    }
  };

  const onDeleteProject = async (projectId, projectName) => {
    if (!window.confirm(`Are you sure you want to delete project "${projectName}"? This will also delete all associated tasks.`)) {
      return;
    }

    const result = await execute(() => 
      authFetch(`http://localhost:5000/api/v1/project/${projectId}`, {
        method: 'DELETE'
      })
    );

    if (result.success) {
      toast.success(`Project "${projectName}" deleted successfully!`);
      loadProjects();
      loadTasks(); // Refresh tasks as associated tasks are deleted
      // Reset selection if deleted project was selected
      if (selectedProject === projectId) {
        setSelectedProject('');
        setSelectedTask('');
      }
      if (selectedProjectForTask === projectId) {
        setSelectedProjectForTask('');
      }
    } else {
      toast.error('Failed to delete project: ' + result.error);
    }
  };

  // ===== TASK MANAGEMENT FUNCTIONS =====
  const loadTasks = async () => {
    setLoadingTasks(true);
    const result = await execute(() => authFetch('http://localhost:5000/api/v1/task'));
    if (result.success) {
      setTasks(result.data || []);
    } else {
      toast.error('Failed to load tasks: ' + result.error);
    }
    setLoadingTasks(false);
  };

  const onCreateTask = async (data) => {
    if (!selectedProjectForTask) {
      toast.error('Please select a project for this task');
      return;
    }

    const result = await execute(() => 
      authFetch('http://localhost:5000/api/v1/task', {
        method: 'POST',
        body: JSON.stringify({
          name: data.taskName,
          projectId: selectedProjectForTask,
          priority: data.taskPriority || 'medium'
        })
      })
    );

    if (result.success) {
      toast.success(`Task "${data.taskName}" created successfully!`);
      resetTask();
      setSelectedProjectForTask('');
      loadTasks();
    } else {
      toast.error('Failed to create task: ' + result.error);
    }
  };

  const onDeleteTask = async (taskId, taskName) => {
    if (!window.confirm(`Are you sure you want to delete task "${taskName}"?`)) {
      return;
    }

    const result = await execute(() => 
      authFetch(`http://localhost:5000/api/v1/task/${taskId}`, {
        method: 'DELETE'
      })
    );

    if (result.success) {
      toast.success(`Task "${taskName}" deleted successfully!`);
      loadTasks();
      // Reset selection if deleted task was selected
      if (selectedTask === taskId) {
        setSelectedTask('');
      }
    } else {
      toast.error('Failed to delete task: ' + result.error);
    }
  };

  // ===== ASSIGNMENT FUNCTIONS =====
  const onAssignTask = async () => {
    if (!selectedProject || !selectedTask || !selectedEmployee) {
      toast.error('Please select project, task, and employee');
      return;
    }

    const result = await execute(() => 
      authFetch(`http://localhost:5000/api/v1/task/assign-employee/${selectedTask}`, {
        method: 'PUT',
        body: JSON.stringify({
          employeeId: selectedEmployee
        })
      })
    );

    if (result.success) {
      const employee = allEmployees.find(emp => emp.id === selectedEmployee);
      const task = tasks.find(t => t.id === selectedTask);
      toast.success(`Task "${task?.name}" assigned to ${employee?.name}!`);
      
      // Reset selections
      setSelectedProject('');
      setSelectedTask('');
      setSelectedEmployee('');
      
      loadTasks();
    } else {
      toast.error('Failed to assign task: ' + result.error);
    }
  };

  // Get tasks for selected project
  const getTasksForProject = () => {
    return tasks.filter(task => task.projectId === selectedProject);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Layout>
      <div className="admin-dashboard">
        <div className="dashboard-header">
          <div className="header-content">
            <h1>Admin Dashboard</h1>
            <p>Welcome back, {user?.email}</p>
          </div>
          <Button variant="secondary" onClick={handleLogout}>
            Sign Out
          </Button>
        </div>

        <div className="dashboard-content">
          {/* ===== EMPLOYEE INVITATION SECTION ===== */}
          <div className="section-card">
            <h2>Invite New Employee</h2>
            <p>Send an invitation email to onboard a new employee to your organization.</p>
            
            <form onSubmit={handleEmployeeSubmit(onInviteEmployee)} className="invite-form">
              <Input
                label="Employee Email"
                type="email"
                placeholder="employee@company.com"
                required
                error={employeeErrors.email?.message}
                {...registerEmployee('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: 'Invalid email address'
                  }
                })}
              />
              
              <Button
                type="submit"
                loading={loading}
              >
                Send Invitation
              </Button>
            </form>
          </div>

          {/* ===== PENDING INVITATIONS SECTION ===== */}
          <div className="section-card">
            <div className="section-header">
              <h2>Pending Invitations</h2>
              <Button 
                variant="secondary" 
                size="small" 
                onClick={loadPendingInvitations}
                loading={loadingInvitations}
              >
                Refresh
              </Button>
            </div>
            
            {loadingInvitations ? (
              <div className="loading-state">
                <p>Loading pending invitations...</p>
              </div>
            ) : pendingInvitations.length === 0 && invitedEmployees.length === 0 ? (
              <p className="no-items">No pending invitations.</p>
            ) : (
              <div className="invitations-table">
                <div className="table-header">
                  <div className="table-cell">Email</div>
                  <div className="table-cell">Status</div>
                  <div className="table-cell">Sent</div>
                  <div className="table-cell">Actions</div>
                </div>
                
                {/* Recent invitations from current session */}
                {invitedEmployees.map((invitation, index) => (
                  <div key={`recent-${index}`} className="table-row">
                    <div className="table-cell">
                      <strong>{invitation.email}</strong>
                    </div>
                    <div className="table-cell">
                      <span className="status status--pending">Pending Verification</span>
                    </div>
                    <div className="table-cell">
                      {invitation.timestamp.toLocaleString()}
                    </div>
                    <div className="table-cell">
                      <div className="action-buttons">
                        <Button
                          variant="secondary"
                          size="small"
                          onClick={() => onResendInvitation(invitation.email, invitation.userId)}
                        >
                          Resend
                        </Button>
                        <Button
                          variant="secondary"
                          size="small"
                          onClick={() => onDeleteInvitation(invitation.email, invitation.userId)}
                          style={{ color: '#ef4444', marginLeft: '8px' }}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* Existing pending invitations from database */}
                {pendingInvitations.map((invitation) => (
                  <div key={invitation.id} className="table-row">
                    <div className="table-cell">
                      <strong>{invitation.email}</strong>
                    </div>
                    <div className="table-cell">
                      <span className="status status--pending">Pending Verification</span>
                    </div>
                    <div className="table-cell">
                      {new Date(invitation.createdAt).toLocaleString()}
                    </div>
                    <div className="table-cell">
                      <div className="action-buttons">
                        <Button
                          variant="secondary"
                          size="small"
                          onClick={() => onResendInvitation(invitation.email, invitation.id)}
                        >
                          Resend
                        </Button>
                        <Button
                          variant="secondary"
                          size="small"
                          onClick={() => onDeleteInvitation(invitation.email, invitation.id)}
                          style={{ color: '#ef4444', marginLeft: '8px' }}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ===== PROJECT MANAGEMENT SECTION ===== */}
          <div className="section-card">
            <div className="section-header">
              <h2>Project Management</h2>
              <Button 
                variant="secondary" 
                size="small" 
                onClick={loadProjects}
                loading={loadingProjects}
              >
                Refresh
              </Button>
            </div>

            {/* Create Project Form */}
            <form onSubmit={handleProjectSubmit(onCreateProject)} className="create-form">
              <Input
                label="Project Name"
                type="text"
                placeholder="Enter project name"
                required
                error={projectErrors.projectName?.message}
                {...registerProject('projectName', {
                  required: 'Project name is required',
                  minLength: {
                    value: 2,
                    message: 'Project name must be at least 2 characters'
                  }
                })}
              />
              
              <Button
                type="submit"
                loading={loading}
              >
                Create Project
              </Button>
            </form>

            {/* Projects List */}
            {loadingProjects ? (
              <div className="loading-state">
                <p>Loading projects...</p>
              </div>
            ) : projects.length === 0 ? (
              <p className="no-items">No projects created yet.</p>
            ) : (
              <div className="projects-table">
                <div className="table-header">
                  <div className="table-cell">Project Name</div>
                  <div className="table-cell">Team</div>
                  <div className="table-cell">Created</div>
                  <div className="table-cell">Actions</div>
                </div>
                {projects.map((project) => (
                  <div key={project.id} className="table-row">
                    <div className="table-cell">
                      <strong>{project.name}</strong>
                    </div>
                    <div className="table-cell">
                      {project.teamId}
                    </div>
                    <div className="table-cell">
                      {new Date(project.createdAt).toLocaleDateString()}
                    </div>
                    <div className="table-cell">
                      <Button
                        variant="secondary"
                        size="small"
                        onClick={() => onDeleteProject(project.id, project.name)}
                        style={{ color: '#ef4444' }}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ===== TASK MANAGEMENT SECTION ===== */}
          <div className="section-card">
            <div className="section-header">
              <h2>Task Management</h2>
              <Button 
                variant="secondary" 
                size="small" 
                onClick={loadTasks}
                loading={loadingTasks}
              >
                Refresh
              </Button>
            </div>

            {/* Create Task Form */}
            <form onSubmit={handleTaskSubmit(onCreateTask)} className="create-form">
              <div className="form-group">
                <label className="input-label">Project <span className="input-required">*</span></label>
                <select 
                  value={selectedProjectForTask} 
                  onChange={(e) => setSelectedProjectForTask(e.target.value)}
                  className="input"
                  required
                >
                  <option value="">Select a project</option>
                  {projects.map(project => (
                    <option key={project.id} value={project.id}>
                      {project.name}
                    </option>
                  ))}
                </select>
              </div>

              <Input
                label="Task Name"
                type="text"
                placeholder="Enter task name"
                required
                error={taskErrors.taskName?.message}
                {...registerTask('taskName', {
                  required: 'Task name is required',
                  minLength: {
                    value: 2,
                    message: 'Task name must be at least 2 characters'
                  }
                })}
              />

              <div className="form-group">
                <label className="input-label">Priority</label>
                <select 
                  {...registerTask('taskPriority')}
                  className="input"
                  defaultValue="medium"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              
              <Button
                type="submit"
                loading={loading}
                disabled={!selectedProjectForTask}
              >
                Create Task
              </Button>
            </form>

            {/* Tasks List */}
            {loadingTasks ? (
              <div className="loading-state">
                <p>Loading tasks...</p>
              </div>
            ) : tasks.length === 0 ? (
              <p className="no-items">No tasks created yet.</p>
            ) : (
              <div className="tasks-table">
                <div className="table-header">
                  <div className="table-cell">Task Name</div>
                  <div className="table-cell">Project</div>
                  <div className="table-cell">Priority</div>
                  <div className="table-cell">Status</div>
                  <div className="table-cell">Actions</div>
                </div>
                {tasks.map((task) => (
                  <div key={task.id} className="table-row">
                    <div className="table-cell">
                      <strong>{task.name}</strong>
                    </div>
                    <div className="table-cell">
                      {projects.find(p => p.id === task.projectId)?.name || 'Unknown'}
                    </div>
                    <div className="table-cell">
                      <span className={`priority priority--${task.priority}`}>
                        {task.priority}
                      </span>
                    </div>
                    <div className="table-cell">
                      <span className={`status status--${task.status}`}>
                        {task.status}
                      </span>
                    </div>
                    <div className="table-cell">
                      <Button
                        variant="secondary"
                        size="small"
                        onClick={() => onDeleteTask(task.id, task.name)}
                        style={{ color: '#ef4444' }}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ===== TASK ASSIGNMENT SECTION ===== */}
          <div className="section-card">
            <h2>Task Assignment</h2>
            <p>Assign tasks to employees. Select project, then task, then employee.</p>

            <div className="assignment-form">
              <div className="assignment-row">
                <div className="form-group">
                  <label className="input-label">Project <span className="input-required">*</span></label>
                  <select 
                    value={selectedProject} 
                    onChange={(e) => {
                      setSelectedProject(e.target.value);
                      setSelectedTask(''); // Reset task when project changes
                    }}
                    className="input"
                    required
                  >
                    <option value="">Select project</option>
                    {projects.map(project => (
                      <option key={project.id} value={project.id}>
                        {project.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="input-label">Task <span className="input-required">*</span></label>
                  <select 
                    value={selectedTask} 
                    onChange={(e) => setSelectedTask(e.target.value)}
                    className="input"
                    required
                    disabled={!selectedProject}
                  >
                    <option value="">Select task</option>
                    {getTasksForProject().map(task => (
                      <option key={task.id} value={task.id}>
                        {task.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="input-label">Employee <span className="input-required">*</span></label>
                  <select 
                    value={selectedEmployee} 
                    onChange={(e) => setSelectedEmployee(e.target.value)}
                    className="input"
                    required
                  >
                    <option value="">Select employee</option>
                    {allEmployees.filter(emp => !emp.deactivated).map(employee => (
                      <option key={employee.id} value={employee.id}>
                        {employee.name} ({employee.identifier})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <Button
                    onClick={onAssignTask}
                    disabled={!selectedProject || !selectedTask || !selectedEmployee}
                    loading={loading}
                  >
                    Assign Task
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* ===== ALL EMPLOYEES SECTION ===== */}
          <div className="section-card">
            <div className="section-header">
              <h2>All Employees</h2>
              <Button 
                variant="secondary" 
                size="small" 
                onClick={loadEmployees}
                loading={loadingEmployees}
              >
                Refresh
              </Button>
            </div>
            
            {loadingEmployees ? (
              <div className="loading-state">
                <p>Loading employees...</p>
              </div>
            ) : allEmployees.length === 0 ? (
              <p className="no-items">No verified employees found.</p>
            ) : (
              <div className="employees-table">
                <div className="table-header">
                  <div className="table-cell">Name</div>
                  <div className="table-cell">Email</div>
                  <div className="table-cell">Status</div>
                  <div className="table-cell">Created</div>
                  <div className="table-cell">Actions</div>
                </div>
                {allEmployees.map((employee) => (
                  <div key={employee.id} className="table-row">
                    <div className="table-cell">
                      <strong>{employee.name || 'Not set'}</strong>
                    </div>
                    <div className="table-cell">
                      {employee.identifier || employee.email}
                    </div>
                    <div className="table-cell">
                      <span className={`status ${employee.deactivated ? 'status--deactivated' : 'status--active'}`}>
                        {employee.deactivated ? 'Deactivated' : 'Active'}
                      </span>
                    </div>
                    <div className="table-cell">
                      {new Date(employee.createdAt).toLocaleDateString()}
                    </div>
                    <div className="table-cell">
                      {!employee.deactivated && (
                        <Button
                          variant="secondary"
                          size="small"
                          onClick={() => onRemoveEmployee(employee.id, employee.name || employee.identifier)}
                          style={{ color: '#ef4444' }}
                        >
                          Deactivate
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ===== INSTRUCTIONS SECTION ===== */}
          <div className="section-card">
            <h2>Admin Dashboard Guide</h2>
            <div className="instructions-content">
              <h3>Employee Management:</h3>
              <ul className="instructions-list">
                <li><strong>Invite:</strong> Send invitation emails to new employees</li>
                <li><strong>Pending Verification:</strong> Employees who haven't verified their email yet (shown directly below invitation form)</li>
                <li><strong>Active Employees:</strong> Verified employees ready for task assignment</li>
                <li><strong>Resend/Delete:</strong> Manage pending invitations</li>
              </ul>

              <h3>Project & Task Management:</h3>
              <ul className="instructions-list">
                <li><strong>Create Projects:</strong> Set up new projects for your organization</li>
                <li><strong>Create Tasks:</strong> Add tasks under specific projects with priority levels</li>
                <li><strong>Delete:</strong> Remove projects (with associated tasks) or individual tasks</li>
                <li><strong>Task Assignment:</strong> Assign specific tasks to employees using the dedicated assignment section</li>
              </ul>

              <h3>Task Assignment Workflow:</h3>
              <ol className="instructions-list">
                <li>Select a project from the dropdown</li>
                <li>Select a task from the filtered tasks for that project</li>
                <li>Select an employee (showing both name and email for clarity)</li>
                <li>Click "Assign Task" to complete the assignment</li>
              </ol>

              <h3>Complete Workflow:</h3>
              <ol className="instructions-list">
                <li>Invite employees → They verify email and set up accounts</li>
                <li>Create projects and tasks for your organization</li>
                <li>Assign tasks to employees using the assignment section</li>
                <li>Employees download desktop app to track time against their assigned tasks</li>
                <li>Use delete buttons to remove unwanted projects or tasks (assignments will be automatically updated)</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
