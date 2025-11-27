import { v4 as uuidv4 } from "uuid";
import model from "../Courses/model.js"; // Keep this - modules are embedded in courses

export default function ModulesDao() {

  async function findModulesForCourse(courseId) {
    const course = await model.findById(courseId);
    return course?.modules || []; 
  }

  async function createModule(courseId, module) {
    const newModule = { ...module, _id: uuidv4() };
    await model.updateOne({ _id: courseId }, { $push: { modules: newModule } });
    return newModule;
  }

  async function deleteModule(courseId, moduleId) {
    const status = await model.updateOne(
      { _id: courseId },
      { $pull: { modules: { _id: moduleId } } }
    );
    return status;
  }

  async function updateModule(courseId, moduleId, moduleUpdates) {
    // Find the course and update the specific module
    const course = await model.findById(courseId);
    if (!course) {
      throw new Error("Course not found");
    }

    // Find the module index
    const moduleIndex = course.modules.findIndex((m) => m._id === moduleId);
    if (moduleIndex === -1) {
      throw new Error("Module not found");
    }

    // Update the module
    Object.assign(course.modules[moduleIndex], moduleUpdates);
    await course.save();

    return course.modules[moduleIndex];
  }

  return {
    findModulesForCourse,
    createModule,
    deleteModule,
    updateModule,
  };
}
