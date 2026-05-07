import { Request, Response } from 'express';
import asyncHandler from '../utils/asyncHandler.ts';
import Task from '../models/Task.ts';
import Project from '../models/Project.ts';

// @desc    Get all tasks
// @route   GET /api/tasks
// @access  Private
// @query   projectId, status, priority, assignedTo
export const getTasks = asyncHandler(async (req: any, res: Response) => {
  let queryObj: any = {};

  // Filter functionality
  if (req.query.projectId) queryObj.projectId = req.query.projectId;
  if (req.query.status) queryObj.status = req.query.status;
  if (req.query.priority) queryObj.priority = req.query.priority;

  // Role based filtering
  if (req.user.role !== 'admin') {
    queryObj.assignedTo = req.user._id;
  } else if (req.query.assignedTo) {
    queryObj.assignedTo = req.query.assignedTo;
  }

  const tasks = await Task.find(queryObj)
    .populate('projectId', 'title')
    .populate('assignedTo', 'name email')
    .populate('createdBy', 'name email')
    .sort({ dueDate: 1 });

  res.json({
    success: true,
    count: tasks.length,
    data: tasks
  });
});

// @desc    Get single task
// @route   GET /api/tasks/:id
// @access  Private
export const getTask = asyncHandler(async (req: any, res: Response) => {
  const task = await Task.findById(req.params.id)
    .populate('projectId', 'title')
    .populate('assignedTo', 'name email')
    .populate('createdBy', 'name email');

  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  // Check access
  if (req.user.role !== 'admin' && task.assignedTo._id.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to access this task');
  }

  res.json({
    success: true,
    data: task
  });
});

// @desc    Create new task
// @route   POST /api/tasks
// @access  Private (Admin only)
export const createTask = asyncHandler(async (req: any, res: Response) => {
  req.body.createdBy = req.user._id;

  // Validate project existence
  const project = await Project.findById(req.body.projectId);
  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }

  const task = await Task.create(req.body);

  res.status(201).json({
    success: true,
    data: task
  });
});

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
export const updateTask = asyncHandler(async (req: any, res: Response) => {
  let task = await Task.findById(req.params.id);

  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  // Permission Logic: 
  // Admin can update anything. 
  // Members can ONLY update status.
  if (req.user.role === 'admin') {
    task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
  } else {
    // Check if task is assigned to user
    if (task.assignedTo.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to update this task');
    }

    // Only allow status update for members
    const { status } = req.body;
    if (!status) {
      res.status(400);
      throw new Error('Members can only update task status');
    }

    task.status = status;
    await task.save();
  }

  res.json({
    success: true,
    data: task
  });
});

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private (Admin only)
export const deleteTask = asyncHandler(async (req: any, res: Response) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  await task.deleteOne();

  res.json({
    success: true,
    data: {}
  });
});
