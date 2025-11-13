import EnrollmentsDao from "./dao.js";

export default function EnrollmentRoutes(app, db) {
  const dao = EnrollmentsDao(db);

  // Get enrollments for a user
  app.get("/api/enrollments/user/:userId", (req, res) => {
    const { userId } = req.params;
    const enrollments = dao.findEnrollmentsForUser(userId);
    res.json(enrollments);
  });

  // Get enrollments for a course
  app.get("/api/enrollments/course/:courseId", (req, res) => {
    const { courseId } = req.params;
    const enrollments = dao.findEnrollmentsForCourse(courseId);
    res.json(enrollments);
  });

  // Enroll user in course
  app.post("/api/enrollments", (req, res) => {
    const { user, course } = req.body;
    const enrollment = dao.enrollUserInCourse(user, course);
    res.json(enrollment);
  });

  // Unenroll user from course
  app.delete("/api/enrollments/user/:userId/course/:courseId", (req, res) => {
    const { userId, courseId } = req.params;
    dao.unenrollUserFromCourse(userId, courseId);
    res.sendStatus(204);
  });
}
