import { Request, Response } from 'express';
import asyncHandler from '../utils/asyncHandler.ts';
import Project from '../models/Project.ts';
import Task from '../models/Task.ts';

// @desc    Get all projects
// @route   GET /api/projects
// @access  Private
export const getProjects = asyncHandler(async (req: any, res: Response) => {
  let query;

  if (req.user.role === 'admin') {
    query = Project.find().populate('createdBy', 'name email').populate('teamMembers', 'name email');
  } else {
    query = Project.find({
      $or: [
        { createdBy: req.user._id },
        { teamMembers: req.user._id }
      ]
    }).populate('createdBy', 'name email').populate('teamMembers', 'name email');
  }

  const projects = await query;

  res.json({
    success: true,
    count: projects.length,
    data: projects
  });
});

// @desc    Get single project
// @route   GET /api/projects/:id
// @access  Private
export const getProject = asyncHandler(async (req: any, res: Response) => {
  const project = await Project.findById(req.params.id)
    .populate('createdBy', 'name email')
    .populate('teamMembers', 'name email');

  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }

  // Check access
  if (req.user.role !== 'admin' && 
      project.createdBy.toString() !== req.user._id.toString() && 
      !project.teamMembers.some((m: any) => m._id.toString() === req.user._id.toString())) {
    res.status(403);
    throw new Error('Not authorized to access this project');
  }

  res.json({
    success: true,
    data: project
  });
});

// @desc    Create new project
// @route   POST /api/projects
// @access  Private (Admin only)
export const createProject = asyncHandler(async (req: any, res: Response) => {
  req.body.createdBy = req.user._id;

  const project = await Project.create(req.body);

  res.status(201).json({
    success: true,
    data: project
  });
});

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private (Admin only)
export const updateProject = asyncHandler(async (req: any, res: Response) => {
  let project = await Project.findById(req.params.id);

  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }

  project = await Project.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.json({
    success: true,
    data: project
  });
});

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private (Admin only)
export const deleteProject = asyncHandler(async (req: any, res: Response) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }

  // Delete associated tasks
  await Task.deleteMany({ projectId: req.params.id });
  await project.deleteOne();

  res.json({
    success: true,
    data: {}
  });
});
