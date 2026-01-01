import express from 'express'

const router=express.Router()
import * as eventController from "./event.controller.js"
import myMulter from '../../services/multer.js'


router.post("/create-event",myMulter().single("files"),eventController.createEvent)

router.put("/:id",myMulter().single("files"),eventController.updateEvent)


router.get("/:id",eventController.getEventById)

router.delete("/:id",eventController.deleteEventById)

router.get("/",eventController.getEventsWithPagination)













export default router