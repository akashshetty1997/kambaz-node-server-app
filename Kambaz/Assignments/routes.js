import AssignmentsDao from "./dao.js";

export default function AssignmentRoutes(app) {
  const dao = AssignmentsDao();

  const findAssignmentsForCourse = async (req, res) => {
    const { cid } = req.params;
    const assignments = await dao.findAssignmentsForCourse(cid);
    res.json(assignments);
  };

  const createAssignment = async (req, res) => {
    const { cid } = req.params;
    const assignment = {
      ...req.body,
      course: cid,
    };
    const newAssignment = await dao.createAssignment(assignment);
    res.json(newAssignment);
  };

  const deleteAssignment = async (req, res) => {
    const { aid } = req.params;
    const status = await dao.deleteAssignment(aid);
    res.json(status);
  };

  const updateAssignment = async (req, res) => {
    const { aid } = req.params;
    const status = await dao.updateAssignment(aid, req.body);
    res.json(status);
  };

  const findAssignmentById = async (req, res) => {
    const { aid } = req.params;
    const assignment = await dao.findAssignmentById(aid);
    res.json(assignment);
  };

  app.get("/api/courses/:cid/assignments", findAssignmentsForCourse);
  app.post("/api/courses/:cid/assignments", createAssignment);
  app.delete("/api/courses/:cid/assignments/:aid", deleteAssignment);
  app.put("/api/courses/:cid/assignments/:aid", updateAssignment);
  app.get("/api/courses/:cid/assignments/:aid", findAssignmentById);
}
