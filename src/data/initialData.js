const USERS = [
  { id: 'user_1', name: 'Alex Morgan', email: 'alex@taskflow.dev', avatar: null, role: 'Project Manager' },
  { id: 'user_2', name: 'Jordan Lee', email: 'jordan@taskflow.dev', avatar: null, role: 'Frontend Developer' },
  { id: 'user_3', name: 'Sam Rivera', email: 'sam@taskflow.dev', avatar: null, role: 'Backend Developer' },
  { id: 'user_4', name: 'Taylor Kim', email: 'taylor@taskflow.dev', avatar: null, role: 'UI/UX Designer' },
  { id: 'user_5', name: 'Casey Chen', email: 'casey@taskflow.dev', avatar: null, role: 'QA Engineer' },
];

const CURRENT_USER_ID = 'user_1';

function daysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
}

function daysFromNow(n) {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString();
}

const PROJECTS = [
  {
    id: 'proj_1',
    name: 'Website Redesign',
    description: 'Complete redesign of the company marketing website with modern UI/UX',
    color: '#3b82f6',
    memberIds: ['user_1', 'user_2', 'user_4'],
    createdAt: daysAgo(30),
    updatedAt: daysAgo(1),
    dueDate: daysFromNow(45),
  },
  {
    id: 'proj_2',
    name: 'Mobile App v2',
    description: 'Version 2 of the mobile application with new features and performance improvements',
    color: '#8b5cf6',
    memberIds: ['user_1', 'user_3', 'user_5'],
    createdAt: daysAgo(20),
    updatedAt: daysAgo(2),
    dueDate: daysFromNow(60),
  },
];

const COLUMNS_PROJ1 = [
  { id: 'col_1_1', projectId: 'proj_1', title: 'Backlog', position: 0, taskIds: ['task_1', 'task_2'], wipLimit: null, isCollapsed: false },
  { id: 'col_1_2', projectId: 'proj_1', title: 'To Do', position: 1, taskIds: ['task_3', 'task_4'], wipLimit: 5, isCollapsed: false },
  { id: 'col_1_3', projectId: 'proj_1', title: 'In Progress', position: 2, taskIds: ['task_5', 'task_6'], wipLimit: 3, isCollapsed: false },
  { id: 'col_1_4', projectId: 'proj_1', title: 'In Review', position: 3, taskIds: ['task_7'], wipLimit: 3, isCollapsed: false },
  { id: 'col_1_5', projectId: 'proj_1', title: 'Done', position: 4, taskIds: ['task_8', 'task_9'], wipLimit: null, isCollapsed: false },
];

const COLUMNS_PROJ2 = [
  { id: 'col_2_1', projectId: 'proj_2', title: 'Backlog', position: 0, taskIds: ['task_10', 'task_11'], wipLimit: null, isCollapsed: false },
  { id: 'col_2_2', projectId: 'proj_2', title: 'To Do', position: 1, taskIds: ['task_12'], wipLimit: 5, isCollapsed: false },
  { id: 'col_2_3', projectId: 'proj_2', title: 'In Progress', position: 2, taskIds: ['task_13', 'task_14'], wipLimit: 3, isCollapsed: false },
  { id: 'col_2_4', projectId: 'proj_2', title: 'In Review', position: 3, taskIds: ['task_15'], wipLimit: 3, isCollapsed: false },
  { id: 'col_2_5', projectId: 'proj_2', title: 'Done', position: 4, taskIds: ['task_16', 'task_17'], wipLimit: null, isCollapsed: false },
];

const TASKS = [
  // Project 1 tasks
  {
    id: 'task_1', projectId: 'proj_1', columnId: 'col_1_1', taskId: 'WEB-101',
    title: 'Research competitor websites', description: 'Analyze top 5 competitor websites for design inspiration and feature comparison.',
    priority: 'low', assigneeId: 'user_4', collaboratorIds: [],
    labels: ['Research'], startDate: '', dueDate: daysFromNow(14),
    estimatedEffort: '4h',
    subtasks: [
      { id: 'st_1', title: 'List competitors', completed: true },
      { id: 'st_2', title: 'Screenshot key pages', completed: false },
      { id: 'st_3', title: 'Write comparison report', completed: false },
    ],
    comments: [
      { id: 'cmt_1', userId: 'user_1', text: 'Focus on SaaS landing pages specifically.', createdAt: daysAgo(5) },
    ],
    attachments: [],
    activity: [
      { id: 'act_1', type: 'created', userId: 'user_1', description: 'created this task', createdAt: daysAgo(10) },
    ],
    createdAt: daysAgo(10), updatedAt: daysAgo(5), archivedAt: null,
  },
  {
    id: 'task_2', projectId: 'proj_1', columnId: 'col_1_1', taskId: 'WEB-102',
    title: 'Define color palette and typography', description: 'Establish the design system foundations including colors, fonts, and spacing.',
    priority: 'medium', assigneeId: 'user_4', collaboratorIds: ['user_2'],
    labels: ['Design'], startDate: '', dueDate: daysFromNow(10),
    estimatedEffort: '6h', subtasks: [], comments: [], attachments: [],
    activity: [
      { id: 'act_2', type: 'created', userId: 'user_4', description: 'created this task', createdAt: daysAgo(8) },
    ],
    createdAt: daysAgo(8), updatedAt: daysAgo(8), archivedAt: null,
  },
  {
    id: 'task_3', projectId: 'proj_1', columnId: 'col_1_2', taskId: 'WEB-103',
    title: 'Build responsive navigation component', description: 'Create a responsive navigation bar with mobile hamburger menu and dropdown submenus.',
    priority: 'high', assigneeId: 'user_2', collaboratorIds: [],
    labels: ['Feature', 'Enhancement'], startDate: daysAgo(2), dueDate: daysFromNow(5),
    estimatedEffort: '8h',
    subtasks: [
      { id: 'st_4', title: 'Desktop navigation', completed: true },
      { id: 'st_5', title: 'Mobile hamburger menu', completed: false },
      { id: 'st_6', title: 'Dropdown submenus', completed: false },
    ],
    comments: [], attachments: [],
    activity: [
      { id: 'act_3', type: 'created', userId: 'user_1', description: 'created this task', createdAt: daysAgo(7) },
      { id: 'act_4', type: 'status', userId: 'user_2', description: 'moved to To Do', createdAt: daysAgo(5) },
    ],
    createdAt: daysAgo(7), updatedAt: daysAgo(2), archivedAt: null,
  },
  {
    id: 'task_4', projectId: 'proj_1', columnId: 'col_1_2', taskId: 'WEB-104',
    title: 'Set up CI/CD pipeline', description: 'Configure automated testing and deployment pipeline using GitHub Actions.',
    priority: 'medium', assigneeId: 'user_3', collaboratorIds: [],
    labels: ['DevOps'], startDate: '', dueDate: daysFromNow(7),
    estimatedEffort: '4h', subtasks: [], comments: [], attachments: [],
    activity: [
      { id: 'act_5', type: 'created', userId: 'user_3', description: 'created this task', createdAt: daysAgo(6) },
    ],
    createdAt: daysAgo(6), updatedAt: daysAgo(6), archivedAt: null,
  },
  {
    id: 'task_5', projectId: 'proj_1', columnId: 'col_1_3', taskId: 'WEB-105',
    title: 'Implement hero section with animations', description: 'Build the landing page hero section with scroll-triggered animations and responsive layout.',
    priority: 'high', assigneeId: 'user_2', collaboratorIds: ['user_4'],
    labels: ['Feature', 'Design'], startDate: daysAgo(3), dueDate: daysFromNow(3),
    estimatedEffort: '12h',
    subtasks: [
      { id: 'st_7', title: 'Hero layout', completed: true },
      { id: 'st_8', title: 'Animations', completed: true },
      { id: 'st_9', title: 'Responsive adjustments', completed: false },
    ],
    comments: [
      { id: 'cmt_2', userId: 'user_4', text: 'Here are the Figma mockups for reference.', createdAt: daysAgo(3) },
      { id: 'cmt_3', userId: 'user_2', text: 'Looks great! Starting implementation now.', createdAt: daysAgo(2) },
    ],
    attachments: [{ id: 'att_1', name: 'hero-mockup.fig', size: '2.4 MB' }],
    activity: [
      { id: 'act_6', type: 'created', userId: 'user_1', description: 'created this task', createdAt: daysAgo(5) },
      { id: 'act_7', type: 'status', userId: 'user_2', description: 'moved to In Progress', createdAt: daysAgo(3) },
      { id: 'act_8', type: 'priority', userId: 'user_1', description: 'changed priority to High', createdAt: daysAgo(4) },
    ],
    createdAt: daysAgo(5), updatedAt: daysAgo(1), archivedAt: null,
  },
  {
    id: 'task_6', projectId: 'proj_1', columnId: 'col_1_3', taskId: 'WEB-106',
    title: 'Create contact form with validation', description: 'Build a contact form with client-side and server-side validation, including reCAPTCHA.',
    priority: 'medium', assigneeId: 'user_3', collaboratorIds: [],
    labels: ['Feature'], startDate: daysAgo(1), dueDate: daysFromNow(6),
    estimatedEffort: '6h', subtasks: [], comments: [], attachments: [],
    activity: [
      { id: 'act_9', type: 'created', userId: 'user_3', description: 'created this task', createdAt: daysAgo(4) },
      { id: 'act_10', type: 'status', userId: 'user_3', description: 'moved to In Progress', createdAt: daysAgo(1) },
    ],
    createdAt: daysAgo(4), updatedAt: daysAgo(1), archivedAt: null,
  },
  {
    id: 'task_7', projectId: 'proj_1', columnId: 'col_1_4', taskId: 'WEB-107',
    title: 'Footer component and social links', description: 'Design and implement the site footer with newsletter signup, social media links, and sitemap.',
    priority: 'low', assigneeId: 'user_2', collaboratorIds: [],
    labels: ['Feature'], startDate: daysAgo(5), dueDate: daysFromNow(1),
    estimatedEffort: '3h', subtasks: [], comments: [
      { id: 'cmt_4', userId: 'user_1', text: 'Please add the privacy policy link as well.', createdAt: daysAgo(1) },
    ], attachments: [],
    activity: [
      { id: 'act_11', type: 'created', userId: 'user_2', description: 'created this task', createdAt: daysAgo(6) },
      { id: 'act_12', type: 'status', userId: 'user_2', description: 'moved to In Review', createdAt: daysAgo(1) },
    ],
    createdAt: daysAgo(6), updatedAt: daysAgo(1), archivedAt: null,
  },
  {
    id: 'task_8', projectId: 'proj_1', columnId: 'col_1_5', taskId: 'WEB-108',
    title: 'Set up project repository and tooling', description: 'Initialize Git repository, configure ESLint, Prettier, and Husky pre-commit hooks.',
    priority: 'high', assigneeId: 'user_3', collaboratorIds: [],
    labels: ['DevOps'], startDate: daysAgo(25), dueDate: daysAgo(20),
    estimatedEffort: '2h', subtasks: [], comments: [], attachments: [],
    activity: [
      { id: 'act_13', type: 'created', userId: 'user_3', description: 'created this task', createdAt: daysAgo(25) },
      { id: 'act_14', type: 'status', userId: 'user_3', description: 'moved to Done', createdAt: daysAgo(23) },
    ],
    createdAt: daysAgo(25), updatedAt: daysAgo(23), archivedAt: null,
  },
  {
    id: 'task_9', projectId: 'proj_1', columnId: 'col_1_5', taskId: 'WEB-109',
    title: 'Create wireframes for main pages', description: 'Design wireframes for home, about, services, and contact pages.',
    priority: 'urgent', assigneeId: 'user_4', collaboratorIds: ['user_1'],
    labels: ['Design'], startDate: daysAgo(20), dueDate: daysAgo(12),
    estimatedEffort: '10h',
    subtasks: [
      { id: 'st_10', title: 'Home page wireframe', completed: true },
      { id: 'st_11', title: 'About page wireframe', completed: true },
      { id: 'st_12', title: 'Services wireframe', completed: true },
      { id: 'st_13', title: 'Contact wireframe', completed: true },
    ],
    comments: [], attachments: [],
    activity: [
      { id: 'act_15', type: 'created', userId: 'user_4', description: 'created this task', createdAt: daysAgo(20) },
      { id: 'act_16', type: 'status', userId: 'user_4', description: 'moved to Done', createdAt: daysAgo(13) },
    ],
    createdAt: daysAgo(20), updatedAt: daysAgo(13), archivedAt: null,
  },
  // Project 2 tasks
  {
    id: 'task_10', projectId: 'proj_2', columnId: 'col_2_1', taskId: 'MOB-201',
    title: 'Implement push notifications', description: 'Add push notification support for iOS and Android with Firebase Cloud Messaging.',
    priority: 'high', assigneeId: 'user_3', collaboratorIds: [],
    labels: ['Feature'], startDate: '', dueDate: daysFromNow(20),
    estimatedEffort: '16h', subtasks: [], comments: [], attachments: [],
    activity: [
      { id: 'act_17', type: 'created', userId: 'user_1', description: 'created this task', createdAt: daysAgo(15) },
    ],
    createdAt: daysAgo(15), updatedAt: daysAgo(15), archivedAt: null,
  },
  {
    id: 'task_11', projectId: 'proj_2', columnId: 'col_2_1', taskId: 'MOB-202',
    title: 'Add offline mode support', description: 'Implement offline data caching and sync mechanism for core app features.',
    priority: 'medium', assigneeId: '', collaboratorIds: [],
    labels: ['Feature', 'Enhancement'], startDate: '', dueDate: daysFromNow(25),
    estimatedEffort: '20h', subtasks: [], comments: [], attachments: [],
    activity: [
      { id: 'act_18', type: 'created', userId: 'user_1', description: 'created this task', createdAt: daysAgo(14) },
    ],
    createdAt: daysAgo(14), updatedAt: daysAgo(14), archivedAt: null,
  },
  {
    id: 'task_12', projectId: 'proj_2', columnId: 'col_2_2', taskId: 'MOB-203',
    title: 'Redesign user profile screen', description: 'Update the user profile screen with new design specs including avatar upload.',
    priority: 'medium', assigneeId: 'user_4', collaboratorIds: [],
    labels: ['Design'], startDate: '', dueDate: daysFromNow(8),
    estimatedEffort: '6h',
    subtasks: [
      { id: 'st_14', title: 'Profile layout', completed: false },
      { id: 'st_15', title: 'Avatar upload', completed: false },
    ],
    comments: [], attachments: [],
    activity: [
      { id: 'act_19', type: 'created', userId: 'user_4', description: 'created this task', createdAt: daysAgo(10) },
    ],
    createdAt: daysAgo(10), updatedAt: daysAgo(10), archivedAt: null,
  },
  {
    id: 'task_13', projectId: 'proj_2', columnId: 'col_2_3', taskId: 'MOB-204',
    title: 'Optimize app startup time', description: 'Profile and reduce cold start time from 4s to under 2s.',
    priority: 'urgent', assigneeId: 'user_3', collaboratorIds: ['user_5'],
    labels: ['Enhancement', 'Bug'], startDate: daysAgo(3), dueDate: daysFromNow(2),
    estimatedEffort: '12h',
    subtasks: [
      { id: 'st_16', title: 'Profile startup', completed: true },
      { id: 'st_17', title: 'Lazy load modules', completed: true },
      { id: 'st_18', title: 'Optimize database queries', completed: false },
    ],
    comments: [
      { id: 'cmt_5', userId: 'user_5', text: 'Current startup trace shows the DB init taking 1.5s.', createdAt: daysAgo(2) },
    ],
    attachments: [],
    activity: [
      { id: 'act_20', type: 'created', userId: 'user_1', description: 'created this task', createdAt: daysAgo(8) },
      { id: 'act_21', type: 'status', userId: 'user_3', description: 'moved to In Progress', createdAt: daysAgo(3) },
    ],
    createdAt: daysAgo(8), updatedAt: daysAgo(1), archivedAt: null,
  },
  {
    id: 'task_14', projectId: 'proj_2', columnId: 'col_2_3', taskId: 'MOB-205',
    title: 'Fix crash on image gallery', description: 'App crashes when opening gallery with more than 50 images due to memory issue.',
    priority: 'urgent', assigneeId: 'user_3', collaboratorIds: [],
    labels: ['Bug'], startDate: daysAgo(2), dueDate: daysAgo(1),
    estimatedEffort: '4h', subtasks: [], comments: [], attachments: [],
    activity: [
      { id: 'act_22', type: 'created', userId: 'user_5', description: 'created this task', createdAt: daysAgo(4) },
      { id: 'act_23', type: 'status', userId: 'user_3', description: 'moved to In Progress', createdAt: daysAgo(2) },
    ],
    createdAt: daysAgo(4), updatedAt: daysAgo(1), archivedAt: null,
  },
  {
    id: 'task_15', projectId: 'proj_2', columnId: 'col_2_4', taskId: 'MOB-206',
    title: 'Add biometric authentication', description: 'Implement fingerprint and Face ID login options for enhanced security.',
    priority: 'high', assigneeId: 'user_3', collaboratorIds: [],
    labels: ['Feature'], startDate: daysAgo(7), dueDate: daysFromNow(4),
    estimatedEffort: '8h', subtasks: [], comments: [], attachments: [],
    activity: [
      { id: 'act_24', type: 'created', userId: 'user_1', description: 'created this task', createdAt: daysAgo(12) },
      { id: 'act_25', type: 'status', userId: 'user_3', description: 'moved to In Review', createdAt: daysAgo(2) },
    ],
    createdAt: daysAgo(12), updatedAt: daysAgo(2), archivedAt: null,
  },
  {
    id: 'task_16', projectId: 'proj_2', columnId: 'col_2_5', taskId: 'MOB-207',
    title: 'Update app icon and splash screen', description: 'Replace app icon and splash screen with new branding assets.',
    priority: 'low', assigneeId: 'user_4', collaboratorIds: [],
    labels: ['Design'], startDate: daysAgo(18), dueDate: daysAgo(10),
    estimatedEffort: '2h', subtasks: [], comments: [], attachments: [],
    activity: [
      { id: 'act_26', type: 'created', userId: 'user_4', description: 'created this task', createdAt: daysAgo(18) },
      { id: 'act_27', type: 'status', userId: 'user_4', description: 'moved to Done', createdAt: daysAgo(11) },
    ],
    createdAt: daysAgo(18), updatedAt: daysAgo(11), archivedAt: null,
  },
  {
    id: 'task_17', projectId: 'proj_2', columnId: 'col_2_5', taskId: 'MOB-208',
    title: 'Write unit tests for auth module', description: 'Add comprehensive unit tests for the authentication module covering login, signup, and password reset.',
    priority: 'medium', assigneeId: 'user_5', collaboratorIds: [],
    labels: ['Testing'], startDate: daysAgo(15), dueDate: daysAgo(8),
    estimatedEffort: '8h',
    subtasks: [
      { id: 'st_19', title: 'Login tests', completed: true },
      { id: 'st_20', title: 'Signup tests', completed: true },
      { id: 'st_21', title: 'Password reset tests', completed: true },
    ],
    comments: [], attachments: [],
    activity: [
      { id: 'act_28', type: 'created', userId: 'user_5', description: 'created this task', createdAt: daysAgo(15) },
      { id: 'act_29', type: 'status', userId: 'user_5', description: 'moved to Done', createdAt: daysAgo(9) },
    ],
    createdAt: daysAgo(15), updatedAt: daysAgo(9), archivedAt: null,
  },
];

const NOTIFICATIONS = [
  { id: 'notif_1', userId: 'user_1', type: 'assigned', title: 'Task assigned', message: 'You were assigned to "Implement hero section with animations"', taskId: 'task_5', isRead: false, createdAt: daysAgo(3) },
  { id: 'notif_2', userId: 'user_1', type: 'due_soon', title: 'Task due soon', message: '"Footer component and social links" is due tomorrow', taskId: 'task_7', isRead: false, createdAt: daysAgo(0) },
  { id: 'notif_3', userId: 'user_1', type: 'comment', title: 'New comment', message: 'Taylor Kim commented on "Research competitor websites"', taskId: 'task_1', isRead: true, createdAt: daysAgo(5) },
  { id: 'notif_4', userId: 'user_1', type: 'overdue', title: 'Task overdue', message: '"Fix crash on image gallery" is overdue', taskId: 'task_14', isRead: false, createdAt: daysAgo(1) },
];

export function getInitialData() {
  return {
    projects: PROJECTS,
    columns: [...COLUMNS_PROJ1, ...COLUMNS_PROJ2],
    tasks: TASKS,
    users: USERS,
    notifications: NOTIFICATIONS,
    currentUserId: CURRENT_USER_ID,
  };
}

export { USERS, CURRENT_USER_ID };
