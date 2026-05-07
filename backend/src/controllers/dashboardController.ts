import { Response } from 'express';
import asyncHandler from '../utils/asyncHandler.ts';
import Project from '../models/Project.ts';
import Task from '../models/Task.ts';
import User from '../models/User.ts';

// @desc    Get dashboard stats
// @route   GET /api/dashboard/stats
// @access  Private
export const getDashboardStats = asyncHandler(async (req: any, res: Response) => {
  const userId = req.user._id;
  const isAdmin = req.user.role === 'admin';

  let projectCount, taskCount, completedTasks, pendingTasks, overdueTasks;

  if (isAdmin) {
    projectCount = await Project.countDocuments();
    taskCount = await Task.countDocuments();
    completedTasks = await Task.countDocuments({ status: 'completed' });
    pendingTasks = await Task.countDocuments({ status: { $ne: 'completed' } });
    overdueTasks = await Task.countDocuments({ 
      status: { $ne: 'completed' },
      dueDate: { $lt: new Date() }
    });
  } else {
    projectCount = await Project.countDocuments({
      $or: [{ createdBy: userId }, { teamMembers: userId }]
    });
    taskCount = await Task.countDocuments({ assignedTo: userId });
    completedTasks = await Task.countDocuments({ assignedTo: userId, status: 'completed' });
    pendingTasks = await Task.countDocuments({ assignedTo: userId, status: { $ne: 'completed' } });
    overdueTasks = await Task.countDocuments({ 
      assignedTo: userId,
      status: { $ne: 'completed' },
      dueDate: { $lt: new Date() }
    });
  }

  // Task distribution by status
  const statusDistribution = await Task.aggregate([
    { $match: isAdmin ? {} : { assignedTo: userId } },
    { $group: { _id: '$status', count: { $sum: 1 } } }
  ]);

  // Priority distribution
  const priorityDistribution = await Task.aggregate([
    { $match: isAdmin ? {} : { assignedTo: userId } },
    { $group: { _id: '$priority', count: { $sum: 1 } } }
  ]);

  // Recent activity (last 5 tasks created)
  const recentTasks = await Task.find(isAdmin ? {} : { assignedTo: userId })
    .sort({ createdAt: -1 })
    .limit(5)
    .populate('projectId', 'title')
    .populate('assignedTo', 'name')
    .select('title status createdAt');

  res.json({
    success: true,
    data: {
      stats: {
        totalProjects: projectCount,
        totalTasks: taskCount,
        completedTasks,
        pendingTasks,
        overdueTasks
      },
      statusDistribution,
      priorityDistribution,
      recentActivity: recentTasks
    }
  });
});

// @desc    Get all team members (for assignment)
// @route   GET /api/dashboard/users
// @access  Private
export const getTeamMembers = asyncHandler(async (req: any, res: Response) => {
  const users = await User.find({}).select('name email role');
  res.json({
    success: true,
    data: users
  });
});
