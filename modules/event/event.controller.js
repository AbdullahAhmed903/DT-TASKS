import { ObjectId } from "mongodb";
import {getDB} from "../../db-connection.js"
import imagekitUploding from "../../services/image-kit.js";
import sharp from "sharp";
import { pagination } from "../../services/pagination.js";



const createEvent = async (req, res) => {
  try {
    const db = getDB();
    const eventsCollection = db.collection("events");

    const {
      type,
      name,
      tagline,
      description,
      moderator,
      category,
      sub_category,
      rigor_rank,
      schedule,
      attendees
    } = req.body;

    if (
      !type ||
      !name ||
      !tagline ||
      !description ||
      !moderator ||
      !category ||
      !sub_category ||
      !schedule ||
      !attendees ||
      rigor_rank === undefined
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const scheduleDate = new Date(schedule);
    
    if (isNaN(scheduleDate.getTime())) {
      return res.status(400).json({ message: "Invalid schedule date" });
    }

    let imageUrl;
    if (req.file) {
      const compressedBuffer = await sharp(req.file.buffer)
        .resize(800)
        .jpeg({ quality: 80 })
        .toBuffer();

      const uploadedImg = await imagekitUploding.upload({
        file: compressedBuffer,
        fileName: req.file.originalname,
        folder: "DT",
        useUniqueFileName: true,
      });

      imageUrl = uploadedImg.url;
    }

    const event = {
      type,
      uid: new ObjectId(), 
      name,
      tagline,
      description,
      moderator,
      category,
      sub_category,
      rigor_rank: Number(rigor_rank),
      schedule: scheduleDate, 
      files: {
        image: imageUrl,
      },
      attendees,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await eventsCollection.insertOne(event);

    res.status(201).json({ _id: result.insertedId });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




const getEventById = async (req, res) => {
  try {
    const db = getDB();
    const eventsCollection = db.collection("events");

    const event = await eventsCollection.findOne({ _id: new ObjectId(req.params.id) });
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



const deleteEventById = async (req, res) => {
  try {
    const db = getDB();
    const eventsCollection = db.collection("events");

    const result = await eventsCollection.deleteOne({ _id: new ObjectId(req.params.id) });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.json({ message: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



const updateEvent = async (req, res) => {
  try {
    const db = getDB();
    const eventsCollection = db.collection("events");

    const {
      type,
      name,
      tagline,
      description,
      moderator,
      category,
      sub_category,
      rigor_rank,
      schedule,
      attendees
    } = req.body;

    if (!Object.keys(req.body).length && !req.file) {
      return res.status(400).json({ message: "At least one field must be provided for update" });
    }

    let scheduleDate;
    if (schedule) {
      scheduleDate = new Date(schedule);
      if (isNaN(scheduleDate.getTime())) {
        return res.status(400).json({ message: "Invalid schedule date" });
      }
    }

    let imageUrl;
    if (req.file) {
      const compressedBuffer = await sharp(req.file.buffer)
        .resize(800)
        .jpeg({ quality: 80 })
        .toBuffer();

      const uploadedImg = await imagekitUploding.upload({
        file: compressedBuffer,
        fileName: req.file.originalname,
        folder: "DT",
        useUniqueFileName: true,
      });

      imageUrl = uploadedImg.url;
    }

    const updateData = {
      updatedAt: new Date(),
    };

    if (type !== undefined) updateData.type = type;
    if (name !== undefined) updateData.name = name;
    if (tagline !== undefined) updateData.tagline = tagline;
    if (description !== undefined) updateData.description = description;
    if (moderator !== undefined) updateData.moderator = moderator;
    if (category !== undefined) updateData.category = category;
    if (sub_category !== undefined) updateData.sub_category = sub_category;
    if (rigor_rank !== undefined) updateData.rigor_rank = Number(rigor_rank);
    if (scheduleDate) updateData.schedule = scheduleDate;
    if (attendees !== undefined) updateData.attendees = attendees;
    if (imageUrl) updateData.files = { image: imageUrl };

    const result = await eventsCollection.findOneAndUpdate(
      { _id: new ObjectId(req.params.id) },
      { $set: updateData },
      { returnDocument: "after" }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.json({ message: "Event updated successfully",result });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};





const getEventsWithPagination = async (req, res) => {
  try {
    const db = getDB();
    const eventsCollection = db.collection("events");

    const page = req.query.page || 1;
    const limit = req.query.limit || 10;

    const { skip, limit: pagLimit } = pagination(page, limit);

    const events = await eventsCollection.find({}).skip(skip).limit(pagLimit).toArray();
    const total = await eventsCollection.countDocuments();

    res.json({
      events,
      totalEvents:total,
      page: parseInt(page),
      limit: pagLimit
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export{
createEvent,
getEventById,
deleteEventById,
updateEvent,
getEventsWithPagination
}
