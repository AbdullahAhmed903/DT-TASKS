import { ObjectId } from "mongodb";
import { getDB } from "../../db-connection.js";
import imagekitUploading from "../../services/image-kit.js";
import sharp from "sharp";
import { pagination } from "../../services/pagination.js";


const createNudge = async (req, res) => {
  try {
    const db = getDB();
    const nudgesCollection = db.collection("nudges");
    const eventCollectino=db.collection("events")

    const {
      eventId,
      title,
      description,
      sendTime,
      invitationLink
    } = req.body;

    const {coverImage,icon}=req.files

    if (
    !eventId ||
      !title ||
      !description ||
      !sendTime ||
      !invitationLink
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }
    
    
    let coverImageUrl
    if(coverImage){
        const compressedBuffer = await sharp(coverImage[0].buffer)
        .resize(800)
        .jpeg({ quality: 80 })
        .toBuffer();

        const uploadedImg = await imagekitUploading.upload({
        file: compressedBuffer,
        fileName: coverImage[0].originalname,
        folder: `DT-eventId${eventId}-nudge`,
        useUniqueFileName: true,
      });

      coverImageUrl=uploadedImg.url
    }

        let iconUrl
        if(icon){
        const compressedBuffer = await sharp(icon[0].buffer)
        .resize(800)
        .jpeg({ quality: 80 })
        .toBuffer();

        const uploadedImg = await imagekitUploading.upload({
        file: compressedBuffer,
        fileName: icon[0].originalname,
        folder: `DT-eventId${eventId}-nudge`,
        useUniqueFileName: true,
      });

      iconUrl=uploadedImg.url
    }


    const checkEvent=await eventCollectino.findOne({_id:new ObjectId(eventId)})
    if(!checkEvent){
        return res.status(404).json({message:"Event does not exist"})
    }

    const sendTimeDate = new Date(sendTime);
    if (isNaN(sendTimeDate.getTime())) {
      return res.status(400).json({ message: "Invalid send time" });
    }
    


    const nudge = {
    nudgeId:new ObjectId(),
      eventId: new ObjectId(eventId),
      title,
      description,
      sendTime: sendTimeDate,
      coverImage:coverImageUrl,
      icon:iconUrl,
      invitationLink,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await nudgesCollection.insertOne(nudge);

    res.status(201).json({ _id: result.insertedId });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




const getNudges = async (req, res) => {
  try {
    const db = getDB();
    const nudgesCollection = db.collection("nudges");
        const page = req.query.page || 1;
        const limit = req.query.limit || 10;
    
        const { skip, limit: pagLimit } = pagination(page, limit);
    const nudges = await nudgesCollection.find({}).skip(skip).limit(pagLimit).toArray();
    const total = await nudgesCollection.countDocuments();

    res.json({
      nudges,
      totalNudge:total,
      page: parseInt(page),
      limit: pagLimit
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




const getNudgeById = async (req, res) => {
  try {
    const db = getDB();
    const nudgesCollection = db.collection("nudges");

    const nudge = await nudgesCollection.findOne({ _id: new ObjectId(req.params.id) });
    if (!nudge) {
      return res.status(404).json({ message: "Nudge not found" });
    }
    res.json(nudge);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




const updateNudge = async (req, res) => {
  try {
    const db = getDB();
    const nudgesCollection = db.collection("nudges");

    const {
      eventId,
      title,
      description,
      sendTime,
    invitationLink

    } = req.body;

    if (!Object.keys(req.body).length && !req.file) {
      return res.status(400).json({ message: "At least one field must be provided for update" });
    }

    let sendTimeDate;
    if (sendTime) {
      sendTimeDate = new Date(sendTime);
      if (isNaN(sendTimeDate.getTime())) {
        return res.status(400).json({ message: "Invalid send time" });
      }
    }
    
    let coverImageUrl;
    if (req.files&&req.files.coverImage) {
      const compressedBuffer = await sharp(req.files.coverImage[0].buffer)
        .resize(800)
        .jpeg({ quality: 80 })
        .toBuffer();

      const uploadedImg = await imagekitUploading.upload({
        file: compressedBuffer,
        fileName: req.files.coverImage[0].originalname,
        folder: "DT",
        useUniqueFileName: true,
      });

      coverImageUrl = uploadedImg.url;
    }

    let iconUrl

        if (req.files&&req.files.iconUrl) {
      const compressedBuffer = await sharp(req.files.iconUrl[0].buffer)
        .resize(800)
        .jpeg({ quality: 80 })
        .toBuffer();

      const uploadedImg = await imagekitUploading.upload({
        file: compressedBuffer,
        fileName: req.files.iconUrl[0].originalname,
        folder: "DT",
        useUniqueFileName: true,
      });

      iconUrl = uploadedImg.url;
    }

    const updateData = {
      updatedAt: new Date(),
    };

    if (eventId !== undefined) updateData.eventId = new ObjectId(eventId);
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (sendTimeDate) updateData.sendTime = sendTimeDate;
    if (invitationLink !== undefined) updateData.invitationLink = invitationLink;
    if (coverImageUrl) updateData.coverImage = coverImageUrl;
    if (iconUrl) updateData.icon = iconUrl;


    const result = await nudgesCollection.findOneAndUpdate(
      { _id: new ObjectId(req.params.id) },
      { $set: updateData },
      { returnDocument: "after" }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Nudge not found" });
    }

    res.json({ message: "Nudge updated successfully", result });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};





const deleteNudge = async (req, res) => {
  try {
    const db = getDB();
    const nudgesCollection = db.collection("nudges");

    const result = await nudgesCollection.deleteOne({ _id: new ObjectId(req.params.id) });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Nudge not found" });
    }
    res.json({ message: "Nudge deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {
  createNudge,
  getNudges,
  getNudgeById,
  updateNudge,
  deleteNudge
};
