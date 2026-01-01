import express from 'express'

const router = express.Router()
import * as nudgeController from "./nudge.controller.js"
import myMulter from '../../services/multer.js'

router.post("/create-nudge", myMulter().fields([{name:"icon",maxCount:1},{name:"coverImage",maxCount:1}]), nudgeController.createNudge)

router.get("/", nudgeController.getNudges)

router.get("/:id", nudgeController.getNudgeById)

router.put("/:id", myMulter().single("files"), nudgeController.updateNudge)

router.delete("/:id", nudgeController.deleteNudge)

export default router
