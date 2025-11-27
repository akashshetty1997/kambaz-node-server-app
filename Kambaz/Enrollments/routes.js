import EnrollmentsDao from "./dao.js";

export default function EnrollmentRoutes(app) { // ✅ Remove db parameter
  const dao = EnrollmentsDao(); // ✅ Remove db parameter

  // Get enrollments for a user
  app.get("/api/enrollments/user/:userId", async (req, res) => { // ✅ Add async
    const { userId } = req.params;
    const enrollments = await dao.findEnrollmentsForUser(userId); // ✅ Add await
    res.json(enrollments);
  });

  // Get enrollments for a course
  app.get("/api/enrollments/course/:courseId", async (req, res) => { // ✅ Add async
    const { courseId } = req.params;
    const enrollments = await dao.findEnrollmentsForCourse(courseId); // ✅ Add await
    res.json(enrollments);
  });

  // Enroll user in course
  app.post("/api/enrollments", async (req, res) => { // ✅ Add async
    const { user, course } = req.body;
    const enrollment = await dao.enrollUserInCourse(user, course); // ✅ Add await
    res.json(enrollment);
  });

  // Unenroll user from course
  app.delete("/api/enrollments/user/:userId/course/:courseId", async (req, res) => { 
    const { userId, courseId } = req.params;
    await dao.unenrollUserFromCourse(userId, courseId); 
    res.sendStatus(204);
  });
}