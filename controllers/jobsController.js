import Job from '../models/jobsModel.js';
import mongoose from 'mongoose';
import moment from 'moment';

export const createJobsController = async (req, res, next) => {
    const { company, position } = req.body;
    if (!company || !position) {
        next("Please Provide All Fields!");
    }
    req.body.createdBy = req.user.userId;
    const job = await Job.create(req.body);
    res.status(201).json({ job });
};

export const getAllJobsController = async (req, res, next) => {
    const { status, workType, search, deepsort } = req.query;
    // conditions for searching filter
    const queryObject = {
        createdBy: req.user.userId,
    }
    // filter logic
    if (status && status !== "all") {
        queryObject.status = status;
    }
    if (workType && workType !== "all") {
        queryObject.workType = workType;
    }
    if (search) {
        queryObject.position = { $regex: search, $options: 'i' };
    }

    let queryResult = Job.find(queryObject);

    if(deepsort === "latest"){
        queryResult = queryResult.sort("-createdAt");
    }
    if(deepsort === 'oldest'){
        queryResult = queryResult.sort("createdAt");
    }
    if(deepsort === "a-z"){
        queryResult = queryResult.sort("position");
    }
    if(deepsort === "z-a"){
        queryResult = queryResult.sort("-position");
    }
    
    // pagination
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page -1) *limit;

    queryResult =queryResult.skip(skip).limit(limit)
    // jobs count
    const totalJobs = await Job.countDocuments(queryResult);
    const numberOfPage = Math.ceil(totalJobs/limit);

    const jobs = await queryResult;
    // const jobs = await Job.find({ createdBy: req.user.userId });
    res.status(200).json({
        totalJobs,
        jobs,
        numberOfPage
    });
};

export const updateJobController = async (req, res, next) => {
    const { id } = req.params;
    const { company, position, createdBy } = req.body;
    // validation
    if (!company || !position) {
        next("All fields are required!");
    }

    // find job
    const job = await Job.findOne({ _id: id });
    if (!job) {
        next(`No jobs found for this id ${id}`);
    }

    if (req.user.userId !== job.createdBy.toString()) {
        next("You are not authorized to update this job!");
        return;
    }

    const updateJob = await Job.findOneAndUpdate({ _id: id }, req.body, {
        new: true,
        runValidators: true
    })

    res.status(200).json({ updateJob });
};

export const deleteJobController = async (req, res, next) => {
    const { id } = req.params;
    // find job
    const job = await Job.findOne({ _id: id });
    if (!job) {
        next(`No jobs found for this id ${id}`);
    }

    if (req.user.userId !== job.createdBy.toString()) {
        next("You are not authorized to update this job!");
        return;
    }

    await Job.deleteOne();
    res.status(200).json({ message: "Job Deleted!" });
};


// job stats filter
export const jobStatsController = async (req, res) => {
    const stats = await Job.aggregate([
        // search by user job
        {
            $match: {
                createdBy: new mongoose.Types.ObjectId(req.user.userId)
            },

        },

        {
            $group: {
                _id: "$status",
                count: { $sum: 1 }
            },
        }
    ])

    // default stats
    const defaultStats = {
        pending: stats.pending || 0,
        reject: stats.reject || 0,
        interview: stats.interview || 0,

    };

    // monthly or yearly stats
    let monthlyApplication = await Job.aggregate([
        {
            $match: {
                createdBy: new mongoose.Types.ObjectId(req.user.userId)
            }
        },
        {
            $group: {
                _id: {
                    year: { $year: "$createdAt" },
                    month: { $month: "$createdAt" }
                },
                count: {
                    $sum: 1
                }
            }
        }
    ]);

    // using package moment
    monthlyApplication = monthlyApplication.map(item => {
        const { _id: { year, month }, count } = item;
        const date = moment().month(month - 1).year(year).format('MMM Y')
        return { date, count }
    }).reverse();

    res.status(200).json({ TotalStats: stats.length, defaultStats, monthlyApplication });
}