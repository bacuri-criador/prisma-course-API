import { Router } from "express";
import {
  createModule,
  deleteModule,
  getModule,
  listModules,
  updateModule
} from "../controllers/module.controller.js";

const router = Router();

router.get("/", listModules);
router.get("/:id", getModule);
router.post("/", createModule);
router.put("/:id", updateModule);
router.delete("/:id", deleteModule);

export default router;
